function getServings(){
return document.getElementById("servings").value
}

function toFraction(num){

let fractions = [
{decimal:0.25,fraction:"¼"},
{decimal:0.5,fraction:"½"},
{decimal:0.75,fraction:"¾"}
]

let whole = Math.floor(num)
let decimal = num - whole

let closest = ""

fractions.forEach(f=>{
if(Math.abs(decimal - f.decimal) < 0.13){
closest = f.fraction
}
})

if(closest === ""){
return Math.round(num)
}

if(whole === 0){
return closest
}

return whole + " " + closest

}

function scale(qty,base){

let servings = document.getElementById("servings").value

let result = qty * (servings/base)

return toFraction(result)

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

html+=`<button onclick="addToPlan('${r.name}')">
Add to Meal Plan
</button>`
  
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

let length = document.getElementById("planLength").value

let html=""

for(let i=0;i<length;i++){

let day = mealPlan[i]

if(!day) continue

html+="<h3>Day "+day.day+"</h3>"

html+="Breakfast: "+day.breakfast+
` <button onclick="removeMeal(${i},'breakfast')">Remove</button><br>`

html+="Lunch: "+day.lunch+
` <button onclick="removeMeal(${i},'lunch')">Remove</button><br>`

html+="Dinner: "+day.dinner+
` <button onclick="removeMeal(${i},'dinner')">Remove</button><br><br>`

}

document.getElementById("plan").innerHTML=html

}

function generateGrocery(){

let list = {}

mealPlan.forEach(day=>{

let meals = [day.breakfast, day.lunch, day.dinner]

meals.forEach(mealName=>{

let recipe = recipes.find(r=>r.name === mealName)

if(recipe){

recipe.ingredients.forEach(i=>{

let servings = document.getElementById("servings").value
let amount = i.qty * (servings / recipe.servings)

if(!list[i.name]) list[i.name] = 0

list[i.name] += amount

})

}

})

})

let html = "<ul>"

for(let item in list){

html += "<li>" + toFraction(list[item]) + " " + item + "</li>"

}

html += "</ul>"

document.getElementById("grocery").innerHTML = html

}

let html="<ul>"

for(let item in list){
html+="<li>"+list[item].toFixed(1)+" "+item+"</li>"
}

html+="</ul>"

document.getElementById("grocery").innerHTML=html

}

function addToPlan(recipeName){

let day = prompt("Add to which day? (1-30)")

if(!mealPlan[day-1]){

mealPlan[day-1] = {
day:day,
breakfast:"",
lunch:"",
dinner:""
}

}

let mealType = prompt("Breakfast, lunch, or dinner?")

mealPlan[day-1][mealType] = recipeName

alert("Added to meal plan!")

}

function removeMeal(day, mealType){

mealPlan[day][mealType] = ""

loadPlan()

}




