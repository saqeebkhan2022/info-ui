import React, { useEffect, useRef, useState } from "react";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ modules, user, logout }) {
  const [desktop, setDesktop] = useState(() => matchMedia("(min-width: 768px)").matches);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef(null);
  const open = desktop ? desktopOpen : mobileOpen;
  const setOpen = desktop ? setDesktopOpen : setMobileOpen;
  useEffect(() => {
    const media = matchMedia("(min-width: 768px)");
    function resize() { setDesktop(media.matches); setMobileOpen(false); }
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  useEffect(() => {
    if (!open) return;
    function escape(e) {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, setOpen]);
  function close() { setOpen(false); toggleRef.current?.focus(); }
  return <>
    <Header user={user} logout={logout} open={open} toggleRef={toggleRef} toggle={() => setOpen(!open)} />
    <Sidebar modules={modules} userIsAdmin={user.profile === "Administrator"} open={open}
      mobile={!desktop} close={close} />
    <main className={'workspace-content ' + (desktop ? (open ? 'with-navigation' : 'with-icons') : '')}>
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 p-4 text-slate-900 md:p-7 dark:bg-slate-950 dark:text-slate-100"><Outlet/></div>
    </main>
  </>;
}
