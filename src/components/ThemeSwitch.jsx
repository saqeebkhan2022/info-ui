import React,{useState} from 'react';
import {Moon,Sun} from 'lucide-react';
export default function ThemeSwitch(){
 const [dark,setDark]=useState(()=>document.documentElement.dataset.theme==="dark");
 function toggle(){
  const theme=dark?"light":"dark";
  document.documentElement.dataset.theme=theme;
  try{localStorage.setItem("info-theme",theme)}catch{}
  setDark(!dark);
 }
 return <button type="button" className="theme-switch" aria-label="Dark theme" aria-pressed={dark} title={dark?"Use light theme":"Use dark theme"} onClick={toggle}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button>
}
