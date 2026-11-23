import {brandSurface,primaryButton} from "../themeClasses";
import ThemeSwitch from "../components/ThemeSwitch";
import React, { useState } from "react";
import { api } from "../services/api";
export default function Login({ done }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("login", "POST", Object.fromEntries(new FormData(e.target)));
      done(await api("me"));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-split"><section className={"login-intro "+brandSurface}><div className="brand">Info Panel</div><div><h2>Client operations <br/>workspace</h2><p>Manage client accounts, record deposits and withdrawals, and review monthly performance across pools and brokers.</p></div></section><div className="login-body !bg-slate-50 dark:!bg-slate-950"><ThemeSwitch/>
      <form className="w-full max-w-sm" onSubmit={submit}>
        
        <h1>Sign in</h1>
        <label className="mt-6">
          Work email
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label className="mt-4">
          Password
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy} className={"primary mt-6 w-full "+primaryButton}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div></main>
  );
}
