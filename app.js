// =======================
// app.js
// Recipes, Sections, Grocery, Meal Prep
// =======================

// Get servings
function getServings(){ return parseInt(document.getElementById("servings").value); }

// Convert decimal to fractions
function toFraction(num){
  let whole = Math.floor(num);
  let decimal = num - whole;
  let fraction = "";
  if(decimal < 0.125) fraction = "";
  else if(decimal < 0.375) fraction = "¼";
  else if(decimal < 0.625) fraction = "½";
  else if(decimal < 0.875) fraction = "¾";
  else { whole += 1; fraction = ""; }
  if(fraction === "") return whole;
  if(whole === 0) return fraction;
  return whole + " " + fraction;
}

// Scale ingredient
function scale(qty, base){
  let result = qty * (getServings() / base);
  return toFraction(result);
}

// Show a section
function show(section){
  document.querySelectorAll(".section").forEach(s=>s.style.display="none");
  document.getElementById(section).style.display="block";

  if(section==="recipes") loadRecipes();
  if(section==="plan") loadPlan();
  if(section==="grocery") generateGrocery();
  if(section==="prep") generateMealPrep();
}

// Load recipes
function loadRecipes() {
  let html = "";
  recipes.forEach(r=>{
    html += "<h3>"+r.name+"</h3>";
    html += '<button onclick="addToPlan(\''+r.name+'\')">Add to Meal Plan</button>';
    html += "<b>Ingredients</b><ul>";
    r.ingredients.forEach(i=>{
      html += "<li>"+scale(i.qty,r.servings)+" "+i.name+"</li>";
    });
    html += "</ul><b>Steps</b><ol>";
    r.steps.forEach(s=>{ html += "<li>"+s+"</li>"; });
    html += "</ol>";
  });
  document.getElementById("recipes").innerHTML = html;
}

// Generate Grocery List
function generateGrocery() {
  let list = {};
  mealPlan.forEach(day=>{
    if(!day) return;
    let meals = [day.breakfast, day.lunch, day.dinner];
    meals.forEach(mealName=>{
      if(!mealName) return;
      let recipe = recipes.find(r=>r.name===mealName);
      if(recipe){
        recipe.ingredients.forEach(i=>{
          let amount = i.qty * (getServings()/recipe.servings);
          if(!list[i.name]) list[i.name]=0;
          list[i.name]+=amount;
        });
      }
    });
  });
  let html="<ul>";
  for(let item in list) html+="<li>"+toFraction(list[item])+" "+item+"</li>";
  html+="</ul>";
  document.getElementById("grocery").innerHTML = html;
}

// =======================
// Dynamic Weekly Meal Prep
// =======================
function generateMealPrep(){
  let list = {};

  mealPlan.forEach(day => {
    if(!day) return;
    let meals = [day.breakfast, day.lunch, day.dinner];

    meals.forEach(mealName => {
      if(!mealName) return;
      let recipe = recipes.find(r => r.name === mealName);
      if(recipe){
        recipe.ingredients.forEach(i=>{
          let amount = i.qty * (getServings()/recipe.servings);
          if(!list[i.name]) list[i.name]=0;
          list[i.name]+=amount;
        });
      }
    });
  });

  let html = "<h2>Weekly Meal Prep</h2><ul>";
  for(let item in list){
    html += "<li>" + toFraction(list[item]) + " " + item + "</li>";
  }
  html += "</ul>";

  document.getElementById("prep").innerHTML = html;
}

// =======================
// Better Meal Selector UI
// =======================

let selectedRecipe = "";
let selectedDay = null;

// Open selector
function openMealSelector(recipeName){

  selectedRecipe = recipeName;

  let length = getPlanLength();

  let html="";

  for(let i=1;i<=length;i++){

    html += `<button onclick="selectDay(${i})">${i}</button> `;

  }

  document.getElementById("dayButtons").innerHTML = html;

  document.getElementById("mealSelector").style.display="block";

}

// Select day
function selectDay(day){

  selectedDay = day;

}

// Select meal type
function selectMealType(mealType){

  if(!selectedDay){
    alert("Select a day first");
    return;
  }

  mealPlan[selectedDay-1][mealType] = selectedRecipe;

  saveMealPlan();

  closeMealSelector();

  loadPlan();

}

// Close selector
function closeMealSelector(){

  document.getElementById("mealSelector").style.display="none";

  selectedDay=null;

}
