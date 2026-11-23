import {panelSurface} from "../themeClasses";
import React from 'react';
import {ArrowDownLeft,Repeat2,ArrowUpRight} from 'lucide-react';
import {money,label,dollars} from '../services/modules';
const icons=[ArrowDownLeft,Repeat2,ArrowUpRight];
export default function Stats({data}){
 return <div className="stats">{money.map((key,i)=>{const Icon=icons[i];return <section key={key} className={panelSurface}><div className="stat-title"><span>{label(key)}</span><Icon size={19}/></div><strong>{dollars(data[key])}</strong></section>})}</div>
}
