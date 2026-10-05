(()=>{const API="https://djbrmswvlmivvltcsstr.supabase.co/functions/v1/analysis-feed",
esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),
norm=s=>String(s||"Okänd kamera").replace(/^PRO-\s*1\s+/i,"PRO-1 "),
short=s=>norm(s).replace(/^PRO(?:-|\s*)\d+\s*/i,"").replace(/^Molnus\s*\d+\s*/i,""),
CAMERAS=["PRO-1 Ekön","PRO 2 Stugan","PRO 3 Gränsen","PRO-4 Gamla åteln","Molnus 3 Saltsten"];
function clusterEvents(rows,fromMs){
  return (rows||[]).filter(e=>{
    const t=new Date(e.event_end||e.event_start||0).getTime();
    return Number.isFinite(t)&&t>=fromMs;
  }).map(e=>({...e,camera_name:norm(e.camera_name)}));
}
function renderWeek(d){
  const host=document.getElementById("viltiq-report-week");if(!host)return;
  const now=Date.now(),ev=clusterEvents(d.liveEvents,now-7*864e5),by={};
  for(const c of CAMERAS)by[c]=0;
  for(const e of ev)by[e.camera_name]=(by[e.camera_name]||0)+1;
  const rows=Object.entries(by).sort((a,b)=>b[1]-a[1]),max=Math.max(1,...rows.map(x=>x[1]));
  const hids=new Set((d.week||[]).map(a=>a.individual_id).filter(Boolean));
  const gids=new Set((d.week||[]).map(a=>a.group_id).filter(Boolean));
  const active=rows.filter(([,n])=>n>0).length;
  host.innerHTML='<div class="card forecast"><div class="section-label">7 DAGAR · LIVE</div><h2>Aktivitet & rörelse</h2><div class="kpi"><div><b>'+ev.length+'</b><br><span class="muted small">Besök</span></div><div><b>'+hids.size+'</b><br><span class="muted small">H-ID</span></div><div><b>'+gids.size+'</b><br><span class="muted small">G-ID</span></div><div><b>'+active+'</b><br><span class="muted small">Aktiva kameror</span></div></div>'+rows.map(([cam,n])=>'<div class="row"><span>'+esc(short(cam))+'</span><div style="width:45%"><div class="bar"><i style="width:'+Math.round(n/max*100)+'%"></i></div></div><b>'+n+'</b></div>').join("")+'<p class="note">LIVE: bygger på oberoende kamerabesök från analyserade bilder. H-ID/G-ID visas först när permanent individ- och gruppmatchning är aktiverad.</p></div>';
}
function render24(d){
  const host=document.getElementById("viltiq-report-24h");if(!host)return;
  const now=Date.now(),ev=clusterEvents(d.liveEvents,now-864e5),by={};
  for(const e of ev)by[e.camera_name]=(by[e.camera_name]||0)+1;
  const top=Object.entries(by).sort((a,b)=>b[1]-a[1])[0];
  const a24=(d.recent||[]).filter(a=>{
    const t=new Date(a.camera_images?.captured_at||0).getTime();
    return Number.isFinite(t)&&t>=now-864e5;
  });
  const hids=[...new Set(a24.map(a=>a.individual_id).filter(Boolean))];
  const gids=[...new Set(a24.map(a=>a.group_id).filter(Boolean))];
  const idReady=hids.length>0||gids.length>0;
  host.innerHTML='<div class="card"><div class="section-label">SENASTE 24 H · LIVE</div><h2>Unika individer</h2><div class="row"><span>Oberoende besök</span><b>'+ev.length+'</b></div><div class="row"><span>Unika individer</span><b>'+(idReady?Math.max(hids.length,gids.length):'–')+'</b></div><div class="row"><span>H-ID observerade</span><b>'+(hids.length?esc(hids.join(" · ")):'0')+'</b></div><div class="row"><span>G-ID observerade</span><b>'+(gids.length?esc(gids.join(" · ")):'0')+'</b></div><div class="row"><span>Aktivaste kamera</span><b>'+(top?esc(short(top[0]))+' · '+top[1]+' besök':'Ingen aktivitet')+'</b></div><p class="note">'+(idReady?'LIVE-data från senaste dygnet.':'LIVE-data från senaste dygnet. Individräkning visas som – tills permanent H-ID/G-ID-matchning är aktiverad; vi visar inte längre några uppskattade testvärden.')+'</p></div>';
}
async function load(){try{const r=await fetch(API+"?t="+Date.now(),{cache:"no-store"}),d=await r.json();if(!d.ok)throw 0;renderWeek(d);render24(d)}catch(e){for(const id of["viltiq-report-week","viltiq-report-24h"]){const h=document.getElementById(id);if(h)h.innerHTML='<div class="card"><b>Live rapportdata kunde inte hämtas.</b></div>'}}}
document.addEventListener("DOMContentLoaded",load);setInterval(load,60000)})();