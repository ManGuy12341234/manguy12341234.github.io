const V="ev-v9",CDN="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/",
MODEL="https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/1/efficientdet_lite0.tflite";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
const EXT=[CDN+"vision_bundle.mjs",CDN+"wasm/vision_wasm_internal.js",CDN+"wasm/vision_wasm_internal.wasm",CDN+"wasm/vision_wasm_nosimd_internal.js",CDN+"wasm/vision_wasm_nosimd_internal.wasm",MODEL];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(async c=>{await c.addAll(SHELL);await Promise.allSettled(EXT.map(u=>c.add(new Request(u,{mode:"cors"}))))}));self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("ev-v")&&x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
if(!(u.origin===location.origin||u.hostname==="cdn.jsdelivr.net"||u.hostname==="storage.googleapis.com"))return;
e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{const net=fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);return hit||net}))});
