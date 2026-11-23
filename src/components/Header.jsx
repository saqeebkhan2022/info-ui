import {panelSurface} from "../themeClasses";
import ThemeSwitch from "./ThemeSwitch";
import React from "react";
import {LogOut, Menu} from "lucide-react";
import { api } from "../services/api";
export default function Header({ user, toggle, logout, open, toggleRef }) {
  return (
    <header
  className={
    "workspace-header box-border !h-16 !border-b !border-slate-300 dark:!border-slate-700 " +
    panelSurface +
    (open ? " rail-open" : "")
  }
>
      <button
        className="navigation-toggle" ref={toggleRef} type="button" aria-controls="workspace-sidebar" aria-expanded={open}
        onClick={toggle}
        aria-label={open ? "Close navigation" : "Open navigation"}
      >
        <Menu size={24}/>
      </button>
      <b className="header-brand"></b>
      <ThemeSwitch/>
      <div className="header-person">
        <strong>{user.name}</strong>
        <small>{user.role}</small>
      </div>
      <button
        className="signout" onClick={async () => {
          try {
            await api("logout", "POST", {});
            logout();
          } catch (e) {
            alert(e.message);
          }
        }}
      >
        <LogOut size={15}/> Sign out
      </button>
    </header>
  );
}
