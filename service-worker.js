"use strict";var precacheConfig=[["/mindlogger-app-admin-panel/index.html","d902b21a9418647f191357f4f3ca7b57"],["/mindlogger-app-admin-panel/static/css/main.12873a1a.css","e513602c6c431e0a62020bbf621b575f"],["/mindlogger-app-admin-panel/static/js/main.293489a6.js","5050c3491711a983060a29dfb3d278ca"],["/mindlogger-app-admin-panel/static/media/glyphicons-halflings-regular.448c34a5.woff2","448c34a56d699c29117adc64c43affeb"],["/mindlogger-app-admin-panel/static/media/glyphicons-halflings-regular.89889688.svg","89889688147bd7575d6327160d64e760"],["/mindlogger-app-admin-panel/static/media/glyphicons-halflings-regular.e18bbf61.ttf","e18bbf611f2a2e43afc071aa2f4e1512"],["/mindlogger-app-admin-panel/static/media/glyphicons-halflings-regular.f4769f9b.eot","f4769f9bdb7466be65088239c12046d1"],["/mindlogger-app-admin-panel/static/media/glyphicons-halflings-regular.fa277232.woff","fa2772327f55d8198301fdb8bcfc8158"],["/mindlogger-app-admin-panel/static/media/plus.b3438a6f.svg","b3438a6fc99ca91952f28bc0eac9582a"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=n),a.toString()},cleanResponse=function(n){return n.redirected?("body"in n?Promise.resolve(n.body):n.blob()).then(function(e){return new Response(e,{headers:n.headers,status:n.status,statusText:n.statusText})}):Promise.resolve(n)},createCacheKey=function(e,n,a,t){var r=new URL(e);return t&&r.pathname.match(t)||(r.search+=(r.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var a=new URL(n).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(n){return a.every(function(e){return!e.test(n[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],a=e[1],t=new URL(n,self.location),r=createCacheKey(t,hashParamName,a,/\.\w{8}\./);return[t.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(t){return setOfCachedUrls(t).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!a.has(n)){var e=new Request(n,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+n+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return t.put(n,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(n){return n.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return n.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(n){if("GET"===n.request.method){var e,a=stripIgnoredUrlParameters(n.request.url,ignoreUrlParametersMatching),t="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,t),e=urlsToCacheKeys.has(a));var r="/mindlogger-app-admin-panel/index.html";!e&&"navigate"===n.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],n.request.url)&&(a=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&n.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',n.request.url,e),fetch(n.request)}))}});