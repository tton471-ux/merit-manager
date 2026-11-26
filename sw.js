const CACHE='merit-manager-v7';
const SHELL=['./','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 const url=new URL(e.request.url);
 if(e.request.mode==='navigate'||url.pathname.endsWith('.html')){
  e.respondWith(fetch(e.request).then(response=>{if(response.ok)caches.open(CACHE).then(c=>c.put(e.request,response.clone()));return response;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));
 }else{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(response=>{if(response.ok)caches.open(CACHE).then(c=>c.put(e.request,response.clone()));return response;})));
 }
});