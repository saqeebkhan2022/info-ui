import {panelSurface} from "../themeClasses";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {CalendarDays, Layers, BriefcaseBusiness} from "lucide-react";
import {dubaiMonth,monthRange} from "../services/period";
import Field from "../components/Field";
import DataTable from "../components/DataTable";
import MonthlyIncome from "../components/MonthlyIncome";
import Stats from "../components/Stats";
import { money } from "../services/modules";
export default function Dashboard() {
  const [month,setMonth]=useState(dubaiMonth), [custom,setCustom]=useState(false), [range,setRange]=useState(()=>monthRange(dubaiMonth()));
  const filter=React.useMemo(()=>custom?range:monthRange(month),[custom,range,month]);
  const invalid=Boolean(filter.from && filter.to && filter.from>filter.to);
  const
    [data, load] = useState(null),
    [error, err] = useState("");
  useEffect(() => {
    let live = true;
    load(null);
    err("");
    if(invalid){err("End date must follow start date.");return;}
    api("dashboard?" + new URLSearchParams(filter))
      .then((d) => live && load(d))
      .catch((e) => live && err(e.message));
    return () => {
      live = false;
    };
  }, [filter,invalid]);
  return (
    <>
      <div className="period-bar"><div><h1>Dashboard</h1><p className="period-caption">{custom?'Custom reporting period':new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(month+'-01T00:00:00Z'))} · Dubai time</p></div><div className="period-controls"><CalendarDays size={18}/><label>Reporting period<select value={custom?'custom':'month'} onChange={e=>setCustom(e.target.value==='custom')}><option value="month">Monthly</option><option value="custom">Custom dates</option></select></label>{custom?['from','to'].map(k=><Field key={k} name={k} value={range[k]} onChange={v=>setRange({...range,[k]:v})}/>):<label>Month<input type="month" value={month} onChange={e=>{if(e.target.value){setMonth(e.target.value);setRange(monthRange(e.target.value))}}}/></label>}</div></div>
      {error && <p role="alert">{error}</p>}
      {data && <Stats data={data.totals}/>}
      <MonthlyIncome/>
      {data ? (
        <>
          
          <div className="grid xl:grid-cols-2 gap-5">
            {["pools", "brokers"].map((key) => (
              <section key={key} className={"panel overflow-hidden "+panelSurface}>
                <h2 className="breakdown-title">
                  {key === "pools" ? <><Layers size={18}/> Pool breakdown</> : <><BriefcaseBusiness size={18}/> Broker breakdown</>}
                </h2>
                <DataTable columns={["name", ...money]} rows={data[key]} />
              </section>
            ))}
          </div>
        </>
      ) : (
        !error && "Loading…"
      )}
    </>
  );
}
