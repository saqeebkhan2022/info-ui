import {panelSurface} from "../themeClasses";
import React,{useEffect,useState} from 'react';
import {api} from '../services/api';
import {incomeRange} from '../services/period';
import {dollars} from '../services/modules';
const compact=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1});
export default function MonthlyIncome(){
 const [preset,setPreset]=useState("6");
 const [custom,setCustom]=useState(()=>incomeRange("6"));
 const [rows,setRows]=useState(null),[error,setError]=useState("");
 const {from,to}=preset==="custom"?custom:incomeRange(preset);
 const invalid=!from||!to||from>to;
 useEffect(()=>{
   let active=true;
   setRows(null);setError("");
   if(!invalid)api("dashboard/income?"+new URLSearchParams({from,to}))
     .then(values=>{if(active)setRows(values)})
     .catch(e=>{if(active)setError(e.message)});
   return ()=>{active=false};
 },[from,to,invalid]);
 const max=Math.max(1,...(rows||[]).map(row=>Number(row.deposits)));
 return <section className={"panel income-chart "+panelSurface}><div className="income-heading"><div><h2>Monthly deposit income</h2><p>First deposits and re-deposits · USD{!invalid && " · "+from+" to "+to}</p></div>
 <div className="income-controls"><label>Chart period<select value={preset} onChange={e=>{if(e.target.value==="custom")setCustom({from,to});setPreset(e.target.value)}}>{[["3","Last 3 months"],["6","Last 6 months"],["year","This year"],["12","Last 1 year"],["custom","Custom"]].map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>
 {preset==="custom"&&["from","to"].map(key=><label key={key}>{key==="from"?"From date":"To date"}<input type="date" value={custom[key]} onChange={e=>setCustom({...custom,[key]:e.target.value})}/></label>)}</div></div>
 {invalid?<p role="alert">Choose a date range with the start on or before the end.</p>:error?<p role="alert">{error}</p>:!rows?<p role="status">Loading chart…</p>:!rows.some(row=>Number(row.deposits)>0)?<div className="income-empty">No deposits recorded for this period.</div>:<div className="income-scroll"><div className="chart-plot" style={{gridTemplateColumns:`repeat(${rows.length},minmax(0,1fr))`,minWidth:rows.length*49}}>{rows.map(({month,deposits})=>{
  const name=new Date(month+'-01T00:00:00Z').toLocaleDateString('en-US',{month:'short',year:'2-digit',timeZone:'UTC'});
  return <div className="chart-column" key={month} tabIndex={0} aria-label={name+', '+dollars(deposits)}>
   <div className="bar-space"><div className="income-bar" style={{height:(100*Number(deposits)/max)+'%'}}><span>{compact.format(deposits)}</span></div></div><small>{name}</small><output>{dollars(deposits)}</output></div>
 })}</div></div>}</section>
}
