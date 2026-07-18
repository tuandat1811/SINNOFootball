"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    clubName: "",
    fullName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      // Session cookie is set by the server; go to the dashboard.
      router.replace("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="clubName">Club name</label>
        <input
          id="clubName"
          className="input"
          value={form.clubName}
          onChange={update("clubName")}
          placeholder="SINNO FC"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="fullName">Your name</label>
        <input
          id="fullName"
          className="input"
          value={form.fullName}
          onChange={update("fullName")}
          placeholder="Alex Nguyen"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="username">Username</label>
        <input
          id="username"
          className="input"
          value={form.username}
          onChange={update("username")}
          autoComplete="username"
          required
        />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input"
          value={form.password}
          onChange={update("password")}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? "Creating…" : "Create club & admin"}
      </button>
    </form>
  );
}
