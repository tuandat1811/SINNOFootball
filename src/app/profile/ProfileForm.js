"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initial }) {
  const router = useRouter();

  // Profile info section
  const [info, setInfo] = useState({ fullName: initial.fullName, phone: initial.phone });
  const [infoMsg, setInfoMsg] = useState(null);
  const [savingInfo, setSavingInfo] = useState(false);

  // Password section
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [savingPw, setSavingPw] = useState(false);

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
      router.refresh(); // reflect the new name in the dashboard header
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
        body: JSON.stringify({
          currentPassword: pw.currentPassword,
          newPassword: pw.newPassword,
        }),
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
    <div className="space-y-6">
      {/* Profile info */}
      <form onSubmit={saveInfo} className="card space-y-4">
        <h2 className="font-semibold text-gray-900">Details</h2>

        <div>
          <label className="label">Username</label>
          <input className="input bg-gray-100 text-gray-500" value={initial.username} disabled />
          <p className="mt-1 text-xs text-gray-400">Username cannot be changed.</p>
        </div>
        <div>
          <label className="label" htmlFor="fullName">Name</label>
          <input
            id="fullName"
            className="input"
            value={info.fullName}
            onChange={(e) => setInfo((f) => ({ ...f, fullName: e.target.value }))}
            maxLength={80}
          />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            className="input"
            value={info.phone}
            onChange={(e) => setInfo((f) => ({ ...f, phone: e.target.value }))}
            maxLength={30}
          />
        </div>

        {infoMsg && (
          <p className={`text-sm ${infoMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
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
          <p className={`text-sm ${pwMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
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
