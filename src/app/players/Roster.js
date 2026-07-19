"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

function Avatar({ name }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
      {initial}
    </div>
  );
}

export default function Roster({ currentAdminId }) {
  const router = useRouter();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "" });
  const [resettingId, setResettingId] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/players");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load roster.");
      setPlayers(data.players);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(p) {
    setMessage(null);
    setResettingId(null);
    setEditingId(p._id);
    setEditForm({ fullName: p.fullName || "", phone: p.phone || "" });
  }

  async function saveEdit(id) {
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setEditingId(null);
      setPlayers((ps) => ps.map((p) => (p._id === id ? data.player : p)));
      setMessage({ type: "success", text: "Saved." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  async function toggleActive(p) {
    const deactivating = p.isActive;
    if (deactivating && !confirm(`Deactivate ${p.fullName || p.username}? They won't be able to log in.`)) {
      return;
    }
    setBusyId(p._id);
    setMessage(null);
    try {
      const res = await fetch(`/api/players/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setPlayers((ps) => ps.map((x) => (x._id === p._id ? data.player : x)));
      setMessage({
        type: "success",
        text: deactivating ? "Player deactivated." : "Player reactivated.",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  async function changeRole(p) {
    const promoting = p.role === "player";
    const nextRole = promoting ? "admin" : "player";
    const isSelf = p._id === currentAdminId;
    const label = p.fullName || p.username;
    const confirmText = promoting
      ? `Make ${label} an admin? They'll be able to manage the club.`
      : isSelf
        ? `Demote yourself to player? You'll lose admin access immediately.`
        : `Demote ${label} to player?`;
    if (!confirm(confirmText)) return;

    setBusyId(p._id);
    setMessage(null);
    try {
      const res = await fetch(`/api/players/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: nextRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      if (isSelf && nextRole === "player") {
        router.replace("/");
        return;
      }
      setPlayers((ps) => ps.map((x) => (x._id === p._id ? data.player : x)));
      setMessage({
        type: "success",
        text: promoting ? "Promoted to admin." : "Demoted to player.",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  function startReset(p) {
    setMessage(null);
    setEditingId(null);
    setResettingId(p._id);
    setResetPassword("");
  }

  async function submitReset(id) {
    setBusyId(id);
    setMessage(null);
    try {
      const res = await fetch(`/api/players/${id}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed.");
      setResettingId(null);
      setMessage({ type: "success", text: "Password reset. Share the new password with the player." });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setBusyId(null);
    }
  }

  const filtered = players.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.fullName || "").toLowerCase().includes(q) ||
      (p.username || "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <input
        className="input mb-4"
        placeholder="Search players…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {message && (
        <p
          className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
            message.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-brand-100 bg-brand-50 text-brand-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading roster…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No players found.</p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((p) => {
            const isSelf = p._id === currentAdminId;
            const busy = busyId === p._id;
            return (
              <div key={p._id} className={`card p-4 ${!p.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-3">
                  <Avatar name={p.fullName || p.username} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-gray-900">
                      <span className="truncate">{p.fullName || p.username}</span>
                      {isSelf && <span className="text-xs font-normal text-gray-400">(you)</span>}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      @{p.username}
                      {p.phone ? ` · ${p.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className={p.role === "admin" ? "badge-green" : "badge-gray"}>
                      {p.role === "admin" ? "Admin" : "Player"}
                    </span>
                    {!p.isActive && <span className="badge-red">Inactive</span>}
                  </div>
                </div>

                {editingId === p._id ? (
                  <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                    <div>
                      <label className="label">Name</label>
                      <input
                        className="input"
                        maxLength={80}
                        value={editForm.fullName}
                        onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input
                        className="input"
                        maxLength={30}
                        value={editForm.phone}
                        onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary btn-sm" onClick={() => saveEdit(p._id)} disabled={busy}>
                        {busy ? "Saving…" : "Save"}
                      </button>
                      <button className="btn-secondary btn-sm" onClick={() => setEditingId(null)} disabled={busy}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : resettingId === p._id ? (
                  <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                    <div>
                      <label className="label">New password for @{p.username}</label>
                      <input
                        type="text"
                        className="input"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary btn-sm" onClick={() => submitReset(p._id)} disabled={busy}>
                        {busy ? "Resetting…" : "Set password"}
                      </button>
                      <button className="btn-secondary btn-sm" onClick={() => setResettingId(null)} disabled={busy}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-1 border-t border-gray-100 pt-3">
                    <button className="btn-ghost btn-sm" onClick={() => startEdit(p)} disabled={busy}>
                      Edit
                    </button>
                    <button className="btn-ghost btn-sm" onClick={() => startReset(p)} disabled={busy}>
                      Reset password
                    </button>
                    <button className="btn-ghost btn-sm" onClick={() => changeRole(p)} disabled={busy}>
                      {p.role === "admin" ? "Demote" : "Promote"}
                    </button>
                    <button
                      className={p.isActive ? "btn-danger btn-sm" : "btn-ghost btn-sm"}
                      onClick={() => toggleActive(p)}
                      disabled={busy}
                    >
                      {p.isActive ? "Deactivate" : "Reactivate"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
