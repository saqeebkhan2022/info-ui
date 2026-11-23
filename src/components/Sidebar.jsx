import React from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  BriefcaseBusiness,
  ContactRound,
  Layers,
  LayoutDashboard,
  PanelsTopLeft,
  ShieldCheck,
  Users,
} from "lucide-react";

import { titles } from "../services/modules";

const icons = {
  dashboard: LayoutDashboard,
  operations: ArrowLeftRight,
  clients: ContactRound,
  pools: Layers,
  brokers: BriefcaseBusiness,
  users: Users,
  account: ShieldCheck,
};

function getLabel(key, userIsAdmin) {
  if (key === "users" && userIsAdmin) return "Users & roles";
  if (key === "account") return "My account";
  return titles[key];
}

export default function Sidebar({
  modules,
  open,
  close,
  mobile,
  userIsAdmin,
}) {
  const groups = [
    {
      name: "Workspace",
      items: modules.filter((key) => key !== "users" && key !== "account"),
    },
    {
      name: "Administration",
      items: modules.filter((key) => key === "users" || key === "account"),
    },
  ];

  const linkLayout = open
    ? "!min-h-10 !flex-row !justify-start !gap-3 !px-4 !py-2 !text-left !text-[13px]"
    : "!min-h-14 !flex-col !justify-center !gap-1 !px-1 !py-2 !text-center !text-[11px]";

  return (
    <>
      {mobile && open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="scrim sidebar-backdrop"
          onClick={close}
        />
      )}

      <aside
        id="workspace-sidebar"
        hidden={mobile && !open}
        className={`${
          open ? "expanded" : "compact"
        } !bg-[#172d40] !px-2 !text-slate-100`}
      >
        <div
          aria-label="Info Panel"
          className="
            brand box-border !-mx-2 !flex !h-16 !w-[calc(100%+1rem)]
            !items-center !justify-center !gap-2 !border-b
            !border-white/10 !py-0 !text-slate-100
          "
        >
          <PanelsTopLeft size={23} strokeWidth={1.4} aria-hidden="true" />

          {open && (
            <span className="text-sm font-semibold">Info Panel</span>
          )}
        </div>

        <nav aria-label="Main navigation" className="!mt-3 !block">
          {groups.map(({ name, items }) => {
            if (!items.length) return null;

            return (
              <section key={name} aria-label={name} className="mb-4">
                {open && (
                  <h2 className="px-4 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200/70">
                    {name}
                  </h2>
                )}

                {items.map((key) => {
                  const Icon = icons[key];
                  const label = getLabel(key, userIsAdmin);

                  return (
                    <NavLink
                      key={key}
                      to={`/${key}`}
                      title={label}
                      onClick={mobile ? close : undefined}
                      className={({ isActive }) =>
                        [
                          "my-1 !flex !items-center !rounded-md !font-normal",
                          "!border-l-0 !shadow-none before:!content-none",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-400",
                          linkLayout,
                          isActive
                            ? "!bg-[#27556b] !text-white"
                            : "!bg-transparent !text-slate-300 hover:!bg-[#24465c] hover:!text-white",
                        ].join(" ")
                      }
                    >
                      <Icon
                        size={open ? 18 : 23}
                        strokeWidth={1.4}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </NavLink>
                  );
                })}
              </section>
            );
          })}
        </nav>
      </aside>
    </>
  );
}