self.addEventListener("install",function(e){

e.waitUntil(

caches.open("vegan-app").then(function(cache){

return cache.addAll(["/"])

})

)

})