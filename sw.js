const CACHE="videokeph-v4-verified-codes";
const ASSETS=["/","/index.html","/manifest.webmanifest","/icon.svg","/verified-codes.js"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

async function htmlWithVerifiedCodes(request){
  const response=await fetch(request,{cache:"no-store"});
  if(!response.ok)return response;
  const type=response.headers.get("content-type")||"";
  if(!type.includes("text/html"))return response;
  let html=await response.text();
  if(!html.includes("/verified-codes.js")){
    html=html.replace("</body>",'<script src="/verified-codes.js"></script></body>');
  }
  const headers=new Headers(response.headers);
  headers.set("cache-control","no-store, max-age=0");
  headers.delete("content-length");
  return new Response(html,{status:response.status,statusText:response.statusText,headers});
}

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  const isNavigation=event.request.mode==="navigate"||url.pathname==="/"||url.pathname==="/index.html";
  if(isNavigation){
    event.respondWith(
      htmlWithVerifiedCodes(event.request).catch(()=>
        caches.match("/index.html").then(async hit=>{
          if(!hit)return new Response("Offline",{status:503});
          let html=await hit.text();
          if(!html.includes("/verified-codes.js")){
            html=html.replace("</body>",'<script src="/verified-codes.js"></script></body>');
          }
          return new Response(html,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
        })
      )
    );
    return;
  }
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(()=>caches.match(event.request))
  );
});
