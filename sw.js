const CACHE="videokeph-redesign-v8";
const ASSETS=["/","/index.html","/manifest.webmanifest","/icon.svg","/verified-codes.js","/sorting-priority.js","/redesign.css","/redesign.js"];

self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

async function injectProductionAssets(request){
  const response=await fetch(request,{cache:"no-store"});
  if(!response.ok)return response;
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  let html=await response.text();
  if(!html.includes("/redesign.css")) html=html.replace("</head>",'<link rel="stylesheet" href="/redesign.css"></head>');
  const scripts=[];
  if(!html.includes("/sorting-priority.js")) scripts.push('<script src="/sorting-priority.js"></script>');
  if(!html.includes("/redesign.js")) scripts.push('<script src="/redesign.js"></script>');
  if(scripts.length) html=html.replace("</body>",scripts.join("")+"</body>");
  const headers=new Headers(response.headers);
  headers.set("cache-control","no-store, max-age=0");
  headers.delete("content-length");
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const isPage=event.request.mode==="navigate";
  if(isPage){
    event.respondWith(injectProductionAssets(event.request).catch(()=>caches.match("/index.html")));
    return;
  }
  event.respondWith(fetch(event.request,{cache:"no-store"}).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request)));
});