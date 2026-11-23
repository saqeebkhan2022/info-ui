import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { api } from "./services/api";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RecordsPage from "./pages/RecordsPage";

export default function App() {
  const [user, setUser] = useState(undefined),
    [error, setError] = useState("");
  useEffect(() => {
    const out = () => setUser(null);
    window.addEventListener("signed-out", out);
    api("me")
      .then(setUser)
      .catch((e) => setError(e.message));
    return () => window.removeEventListener("signed-out", out);
  }, []);
  useEffect(() => {
    if (!user) return;
    const check = () => { if (!document.hidden) api("me").catch(() => {}); };
    const timer = window.setInterval(check, 60000);
    document.addEventListener("visibilitychange", check);
    window.addEventListener("pageshow", check);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
      window.removeEventListener("pageshow", check);
    };
  }, [user]);
  if (user === undefined)
    return <main className="login">{error || "Loading workspace…"}</main>;
  if (!user) return <Routes>
    <Route path="/login" element={<Login done={setUser}/>} />
    <Route path="*" element={<Navigate to="/login" replace/>} />
  </Routes>;
  const modules = ["dashboard", "operations", "clients"];
  if (user.profile !== "Retainer") modules.push("pools", "brokers", "users");

  else modules.push("account");
  return (
    <Routes>
      <Route element={<Layout modules={modules} user={user} logout={() => setUser(null)} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {modules.slice(1).map((k) => (
          <Route
            key={k}
            path={"/" + k}
            element={(k === "users" || k === "account") ? <UserManagement user={user} logout={()=>setUser(null)}/> : <RecordsPage key={k} kind={k} user={user} />}
          />
        ))}
        {user.profile === "Administrator" && <Route path="/roles" element={<Navigate to="/users" replace/>}/>}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
