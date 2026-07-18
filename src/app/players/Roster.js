"use client";

import { useEffect, useState, useCallback } from "react";

export default function Roster({ currentAdminId }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: "error"|"success", text }

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

  if (loading) return <p className="text-sm text-gray-500">Loading roster…</p>;

  return (
    <div className="space-y-3">
      {message && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            message.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {players.map((p) => {
        const isSelf = p._id === currentAdminId;
        const busy = busyId === p._id;
        return (
          <div key={p._id} className={`card ${!p.isActive ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {p.fullName || p.username}
                  {isSelf && <span className="ml-1 text-xs text-gray-400">(you)</span>}
                </p>
                <p className="truncate text-sm text-gray-500">@{p.username}</p>
                {p.phone && <p className="text-sm text-gray-500">{p.phone}</p>}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.role === "admin"
                      ? "bg-pitch/10 text-pitch-dark"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {p.role === "admin" ? "Admin" : "Player"}
                </span>
                {!p.isActive && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {editingId === p._id ? (
              <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                <div>
                  <label className="label">Name</label>
                  <input
                    className="input"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
                    maxLength={80}
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    maxLength={30}
                  />
                </div>
                <div className="flex gap-2">
                  <button className="btn-primary" onClick={() => saveEdit(p._id)} disabled={busy}>
                    {busy ? "Saving…" : "Save"}
                  </button>
                  <button className="btn-secondary" onClick={() => setEditingId(null)} disabled={busy}>
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
                  <button className="btn-primary" onClick={() => submitReset(p._id)} disabled={busy}>
                    {busy ? "Resetting…" : "Set password"}
                  </button>
                  <button className="btn-secondary" onClick={() => setResettingId(null)} disabled={busy}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <button className="btn-secondary" onClick={() => startEdit(p)} disabled={busy}>
                  Edit
                </button>
                <button className="btn-secondary" onClick={() => startReset(p)} disabled={busy}>
                  Reset password
                </button>
                <button
                  className="btn-secondary"
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
  );
}
