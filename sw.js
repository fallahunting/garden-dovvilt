const VERSION="20261005-2148",CACHE="viltiq-"+VERSION;
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith("viltiq-")&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==="navigate"){e.respondWith(fetch(r,{cache:"no-store"}).then(x=>x).catch(()=>caches.match(r)));return}
 if(/\.(?:js|webmanifest)$/.test(u.pathname)){e.respondWith(fetch(r,{cache:"no-store"}).catch(()=>caches.match(r)));return}
});
