import React, { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ modules, user, logout }) {
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef(null);
  const location = useLocation();
  const open = desktop ? desktopOpen : mobileOpen;
  const setOpen = desktop ? setDesktopOpen : setMobileOpen;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const resize = () => { setDesktop(media.matches); setMobileOpen(false); };
    resize();
    media.addEventListener("change", resize);
    return () => media.removeEventListener("change", resize);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const escape = e => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open, setOpen]);
  useEffect(() => {
    if (desktop || !mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [desktop, mobileOpen]);
  const close = () => { setOpen(false); toggleRef.current?.focus(); };

  return <>
    <Header user={user} logout={logout} open={open} toggleRef={toggleRef} toggle={() => setOpen(!open)} />
    <Sidebar modules={modules} userIsAdmin={user.profile === "Administrator"} open={open} mobile={!desktop} close={close} />
    <main id="main-content" className={'workspace-content ' + (desktop ? (open ? 'with-navigation' : 'with-icons') : '')}>
      <div className="workspace-inner"><Outlet /></div>
    </main>
  </>;
}
