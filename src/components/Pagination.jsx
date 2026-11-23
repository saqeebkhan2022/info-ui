import React from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
export default function Pagination({page,limit,total,change,resize}){
 const pages=Math.max(1,Math.ceil(total/limit));
 const visible=[...new Set([1,page-1,page,page+1,pages])].filter(n=>n>=1&&n<=pages).sort((a,b)=>a-b);
 return <footer><label className="flex items-center gap-2">Rows per page<select value={limit} onChange={e=>resize(Number(e.target.value))}>{[10,25,50,100].map(n=><option key={n}>{n}</option>)}</select></label><span>{total?(page-1)*limit+1:0}–{Math.min(total,page*limit)} of {total}</span><div className="pager"><button aria-label="Previous page" disabled={page===1} onClick={()=>change(page-1)}><ChevronLeft/></button>{visible.map((n,i)=><React.Fragment key={n}>{n-visible[i-1]>1&&<span>…</span>}<button aria-label={'Page '+n} aria-current={page===n?'page':undefined} onClick={()=>change(n)}>{n}</button></React.Fragment>)}<button aria-label="Next page" disabled={page===pages} onClick={()=>change(page+1)}><ChevronRight/></button></div></footer>
}
