export function dubaiMonth(date=new Date()){
 const parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',timeZone:'Asia/Dubai'}).formatToParts(date);
 return parts.find(p=>p.type==='year').value+'-'+parts.find(p=>p.type==='month').value;
}
export function monthRange(month){
 const [year,num]=month.split('-').map(Number);
 return {from:month+'-01',to:month+'-'+new Date(Date.UTC(year,num,0)).getUTCDate()};
}

export function incomeRange(preset, now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone:"Asia/Dubai", year:"numeric", month:"2-digit", day:"2-digit"
  }).formatToParts(now).map(part => [part.type, part.value]));
  const to = [parts.year, parts.month, parts.day].join("-");
  const start = new Date(to + "T00:00:00Z");
  start.setUTCDate(1);
  if (preset === "year") start.setUTCMonth(0);
  else start.setUTCMonth(start.getUTCMonth() - (Number(preset) - 1));
  return {from:start.toISOString().slice(0,10), to};
}
