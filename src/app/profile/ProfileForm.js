"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initial }) {
  const router = useRouter();

  const [info, setInfo] = useState({ fullName: initial.fullName, phone: initial.phone });
  const [infoMsg, setInfoMsg] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [savingPw, setSavingPw] = useState(false);

  const initial_ = (initial.fullName || initial.username || "?").trim().charAt(0).toUpperCase();

  async function saveInfo(e) {
    e.preventDefault();
    setInfoMsg(null);
    setSavingInfo(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setInfoMsg({ type: "success", text: "Profile saved." });
      router.refresh();
    } catch (err) {
      setInfoMsg({ type: "error", text: err.message });
    } finally {
      setSavingInfo(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.newPassword !== pw.confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords don't match." });
      return;
    }
    setSavingPw(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password change failed.");
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMsg({ type: "success", text: "Password updated." });
    } catch (err) {
      setPwMsg({ type: "error", text: err.message });
    } finally {
      setSavingPw(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Details */}
      <form onSubmit={saveInfo} className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
            {initial_}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-gray-900">{initial.fullName || initial.username}</p>
            <p className="truncate text-sm text-gray-500">@{initial.username}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <label className="label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            className="input"
            maxLength={80}
            value={info.fullName}
            onChange={(e) => setInfo((f) => ({ ...f, fullName: e.target.value }))}
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            className="input"
            maxLength={30}
            value={info.phone}
            onChange={(e) => setInfo((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        {infoMsg && (
          <p className={`text-sm font-medium ${infoMsg.type === "error" ? "text-red-600" : "text-brand-700"}`}>
            {infoMsg.text}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={savingInfo}>
          {savingInfo ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={savePassword} className="card space-y-4">
        <h2 className="font-semibold text-gray-900">Change password</h2>

        <div>
          <label className="label" htmlFor="currentPassword">Current password</label>
          <input
            id="currentPassword"
            type="password"
            className="input"
            value={pw.currentPassword}
            onChange={(e) => setPw((f) => ({ ...f, currentPassword: e.target.value }))}
            autoComplete="current-password"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            className="input"
            value={pw.newPassword}
            onChange={(e) => setPw((f) => ({ ...f, newPassword: e.target.value }))}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">Confirm new password</label>
          <input
            id="confirmPassword"
            type="password"
            className="input"
            value={pw.confirmPassword}
            onChange={(e) => setPw((f) => ({ ...f, confirmPassword: e.target.value }))}
            autoComplete="new-password"
            required
          />
        </div>

        {pwMsg && (
          <p className={`text-sm font-medium ${pwMsg.type === "error" ? "text-red-600" : "text-brand-700"}`}>
            {pwMsg.text}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={savingPw}>
          {savingPw ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
