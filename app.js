// app.js

let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || [];

let selectedRecipeIndex = null;
let selectedDay = null;
let selectedMealType = null;

// ----------------------------
// Show sections
// ----------------------------
function show(section) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  const el = document.getElementById(section);
  if (!el) return;
  el.style.display = "block";

  if (section === "recipes") renderRecipes();
  if (section === "plan") renderPlan();
  if (section === "grocery") generateGrocery();
  if (section === "prep") generateMealPrep();
}

// ----------------------------
// Render Recipes
// ----------------------------
function renderRecipes() {
  const div = document.getElementById("recipes");
  div.innerHTML = "";
  const servingsInput = parseInt(document.getElementById("servings").value) || 1;

  recipes.forEach((recipe, index) => {
    let ing = recipe.ingredients.map(i=>{
      const scaled = i.amount * (servingsInput / recipe.servings);
      return `${scaled.toFixed(2)} ${i.unit} ${i.name}`;
    }).join("<br>");
    let steps = recipe.steps.map(s=>`<li>${s}</li>`).join("");
    div.innerHTML += `
      <div class="recipeCard">
        <h2>${recipe.name}</h2>
        <p>Servings: ${servingsInput}</p>
        <b>Ingredients:</b><br>${ing}<br>
        <b>Steps:</b><ol>${steps}</ol>
        <button onclick="openMealSelector(${index})">Add To Meal Plan</button>
      </div>
    `;
  });
}

// ----------------------------
// Meal Selector UI
// ----------------------------
function openMealSelector(recipeIndex){
  selectedRecipeIndex = recipeIndex;
  document.getElementById("mealSelector").style.display = "block";

  const dayButtonsDiv = document.getElementById("dayButtons");
  dayButtonsDiv.innerHTML = "";
  const length = parseInt(document.getElementById("planLength").value) || 30;

  for(let i=1;i<=length;i++){
    const btn = document.createElement("button");
    btn.textContent = "Day " + i;
    btn.onclick = () => selectDay(i);
    dayButtonsDiv.appendChild(btn);
  }
}

function selectDay(day){ selectedDay = day; }

function selectMealType(type){
  selectedMealType = type;
  if(selectedRecipeIndex===null || selectedDay===null){
    alert("Select a recipe and day first!");
    return;
  }
  if(!mealPlan[selectedDay-1]) mealPlan[selectedDay-1] = {day:selectedDay, breakfast:null, lunch:null, dinner:null};
  mealPlan[selectedDay-1][selectedMealType] = {name:recipes[selectedRecipeIndex].name};
  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
  closeMealSelector();
  renderPlan();
}

function closeMealSelector(){
  selectedRecipeIndex = null;
  selectedDay = null;
  selectedMealType = null;
  document.getElementById("mealSelector").style.display = "none";
}

// ----------------------------
// Render Plan
// ----------------------------
function renderPlan(){
  const div = document.getElementById("plan");
  div.innerHTML = "";
  if(!mealPlan.length){ div.innerHTML="<p>No meals yet.</p>"; return; }
  const length = parseInt(document.getElementById("planLength").value) || 30;

  for(let i=0;i<length;i++){
    const day = mealPlan[i];
    if(!day) continue;
    div.innerHTML += `
      <h3>Day ${day.day}</h3>
      Breakfast: ${day.breakfast?day.breakfast.name:""}<br>
      Lunch: ${day.lunch?day.lunch.name:""}<br>
      Dinner: ${day.dinner?day.dinner.name:""}<br><br>
    `;
  }
}

// ----------------------------
// Generate Grocery List
// ----------------------------
function generateGrocery(){
  let list = {};
  const servingsInput = parseInt(document.getElementById("servings").value) || 1;

  mealPlan.forEach(day=>{
    ["breakfast","lunch","dinner"].forEach(mealType=>{
      const meal = day[mealType];
      if(!meal) return;
      const recipe = recipes.find(r=>r.name===meal.name);
      if(!recipe) return;
      recipe.ingredients.forEach(i=>{
        const scaled = i.amount * (servingsInput / recipe.servings);
        if(!list[i.name]) list[i.name] = {amount:0, unit:i.unit};
        list[i.name].amount += scaled;
      });
    });
  });

  function roundStore(amount, unit, name){
    const bulk=["beans","chickpeas","lentils","rice","quinoa","oats"];
    if(bulk.some(b=>name.toLowerCase().includes(b))) return Math.ceil(amount/1000)+" kg";
    if(unit==="g") return Math.ceil(amount/1000)+" kg";
    if(unit==="ml") return Math.ceil(amount/1000)+" L";
    if(unit==="tsp") return Math.ceil(amount/3)+" tbsp";
    if(unit==="tbsp") return Math.ceil(amount/16)+" cup";
    if(unit==="cups") return Math.ceil(amount/4)+" cups";
    if(unit==="") return Math.ceil(amount)+" pcs";
    return Math.ceil(amount)+" "+unit;
  }

  let html="<ul>";
  for(let item in list){
    const info=list[item];
    html+=`<li>${roundStore(info.amount, info.unit, item)} ${item}</li>`;
  }
  html+="</ul>";
  document.getElementById("grocery").innerHTML = html;
}

// ----------------------------
// Meal Prep
// ----------------------------
function generateMealPrep(){
  const prepDiv = document.getElementById("prep");
  prepDiv.innerHTML="<h2>Weekly Meal Prep</h2>";
  let list = {};
  const servingsInput = parseInt(document.getElementById("servings").value) || 1;

  mealPlan.forEach(day=>{
    ["breakfast","lunch","dinner"].forEach(mealType=>{
      const meal = day[mealType];
      if(!meal) return;
      const recipe = recipes.find(r=>r.name===meal.name);
      if(!recipe) return;
      recipe.ingredients.forEach(i=>{
        const scaled = i.amount * (servingsInput / recipe.servings);
        if(!list[i.name]) list[i.name] = {amount:0, unit:i.unit};
        list[i.name].amount += scaled;
      });
    });
  });

  let html="<ul>";
  for(let item in list){
    const info=list[item];
    html+=`<li>${info.amount.toFixed(1)} ${info.unit} ${item}</li>`;
  }
  html+="</ul>";
  prepDiv.innerHTML+=html;
}

// ----------------------------
// Load from localStorage
// ----------------------------
window.onload = ()=>{
  const stored = JSON.parse(localStorage.getItem("mealPlan"));
  if(stored) mealPlan = stored;
};
