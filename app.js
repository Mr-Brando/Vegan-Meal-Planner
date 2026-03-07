function getServings(){
return document.getElementById("servings").value
}

function scale(qty,base){
return (qty*(getServings()/base)).toFixed(1)
}

function show(section){

document.querySelectorAll(".section").forEach(s=>s.style.display="none")

document.getElementById(section).style.display="block"

if(section==="recipes") loadRecipes()
if(section==="plan") loadPlan()
if(section==="grocery") generateGrocery()

}

function loadRecipes(){

let html=""

recipes.forEach(r=>{

html+="<h3>"+r.name+"</h3>"
html+="<b>Ingredients</b><ul>"

r.ingredients.forEach(i=>{
html+="<li>"+scale(i.qty,r.servings)+" "+i.name+"</li>"
})

html+="</ul><b>Steps</b><ol>"

r.steps.forEach(s=>{
html+="<li>"+s+"</li>"
})

html+="</ol>"

})

document.getElementById("recipes").innerHTML=html
}

function loadPlan(){

let html=""

mealPlan.forEach(d=>{

html+="<h3>Day "+d.day+"</h3>"
html+="Breakfast: "+d.breakfast+"<br>"
html+="Lunch: "+d.lunch+"<br>"
html+="Dinner: "+d.dinner+"<br><br>"

})

document.getElementById("plan").innerHTML=html
}

function generateGrocery(){

let list={}

recipes.forEach(r=>{

r.ingredients.forEach(i=>{

let amount=parseFloat(scale(i.qty,r.servings))

if(!list[i.name]) list[i.name]=0

list[i.name]+=amount

})

})

let html="<ul>"

for(let item in list){
html+="<li>"+list[item].toFixed(1)+" "+item+"</li>"
}

html+="</ul>"

document.getElementById("grocery").innerHTML=html

}
