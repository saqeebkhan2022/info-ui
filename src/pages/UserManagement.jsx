import {panelSurface} from "../themeClasses";
import React, {useState} from "react";
import {Users, ShieldCheck} from "lucide-react";
import ChangePassword from "../components/ChangePassword";
import RecordsPage from "./RecordsPage";

export default function UserManagement({user,logout}) {
  const admin = user.profile === "Administrator";
  const [revision,refresh] = useState(0);
  const changed = () => refresh(n => n + 1);
  if(user.profile==="Retainer") return <section className="account-panel"><h1>My account</h1><p>{user.name} · {user.email}</p><ChangePassword logout={logout}/></section>;
  return <>
    <div className="toolbar"><h1>{admin ? "Users & roles" : "User management"}</h1><ChangePassword logout={logout}/></div>
    <div className={admin ? "management-grid" : ""}>
      {(admin ? ["users","roles"] : ["users"]).map(kind => (
        <section className={"management-card "+panelSurface} key={kind} aria-label={kind}>
          <RecordsPage kind={kind} user={user} revision={revision} onChanged={changed}
            cardTitle={kind==="users" ? <><Users size={19}/>Users</> : <><ShieldCheck size={19}/>Roles</>}/>
        </section>
      ))}
    </div>
  </>;
}
