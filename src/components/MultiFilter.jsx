import React,{useState,useRef,useEffect,useId} from 'react';
import {ChevronDown} from 'lucide-react';
export default function MultiFilter({title,value,onChange,options}){
 const [open,setOpen]=useState(false),root=useRef(null),trigger=useRef(null),id=useId();
 const selected=String(value||'').split(',').filter(Boolean);
 useEffect(()=>{if(!open)return;function outside(e){if(!root.current.contains(e.target))setOpen(false)}document.addEventListener('pointerdown',outside);return ()=>document.removeEventListener('pointerdown',outside)},[open]);
 return <div className="multi" ref={root} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false)}} onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);trigger.current.focus()}}}><span id={id}>{title}</span><button ref={trigger} type="button" aria-expanded={open} aria-labelledby={id+' '+id+'-value'} onClick={()=>setOpen(!open)}><span id={id+'-value'}>{selected.length===0?'All':selected.length===1?options.find(x=>String(x.id)===selected[0])?.name||'1 selected':selected.length+' selected'}</span><ChevronDown size={15}/></button>{open&&<div className="choice-list" role="group" aria-label={title}>{options.map(o=>{const v=String(o.id);return <label key={v}><input type="checkbox" checked={selected.includes(v)} onChange={e=>onChange((e.target.checked?[...selected,v]:selected.filter(x=>x!==v)).join(','))}/>{o.name}</label>})}{!options.length&&<small>No options available</small>}</div>}</div>
}
