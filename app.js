// app.js

// Global Variables
let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || [];

// ----------------------------
// Show Sections
// ----------------------------
function show(section) {
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  const el = document.getElementById(section);
  if (!el) return;
  el.style.display = "block";

  if (section === "recipes") renderRecipes();
  if (section === "plan") loadPlan();
  if (section === "grocery") generateGrocery();
  if (section === "prep") generateMealPrep();
}

// ----------------------------
// Fraction helper
// ----------------------------
function toFraction(num) {
  let fractions = [
    { decimal: 0.25, fraction: "¼" },
    { decimal: 0.5, fraction: "½" },
    { decimal: 0.75, fraction: "¾" }
  ];
  let whole = Math.floor(num);
  let decimal = num - whole;
  let closest = "";
  fractions.forEach(f => {
    if (Math.abs(decimal - f.decimal) < 0.13) closest = f.fraction;
  });
  if (closest === "") return Math.round(num);
  return whole === 0 ? closest : whole + " " + closest;
}

// ----------------------------
// Render Recipes
// ----------------------------
function renderRecipes() {
  const recipeDiv = document.getElementById("recipes");
  recipeDiv.innerHTML = "";
  const servingsInput = parseInt(document.getElementById("servings").value) || 1;

  recipes.forEach((recipe, index) => {
    let ingredientsHTML = "";
    recipe.ingredients.forEach(i => {
      const scaledAmount = i.amount * (servingsInput / recipe.servings);
      ingredientsHTML += `<li>${toFraction(scaledAmount)} ${i.unit} ${i.name}</li>`;
    });

    let stepsHTML = "";
    recipe.steps.forEach(s => stepsHTML += `<li>${s}</li>`);

    recipeDiv.innerHTML += `
      <div class="recipeCard">
        <h2>${recipe.name}</h2>
        <p>Servings: ${servingsInput}</p>
        <h4>Ingredients</h4><ul>${ingredientsHTML}</ul>
        <h4>Steps</h4><ol>${stepsHTML}</ol>
        <button onclick="openMealSelector(${index})">Add To Meal Plan</button>
      </div>
    `;
  });
}

// ----------------------------
// Meal Selector UI
// ----------------------------
let selectedRecipeIndex = null;
let selectedDay = null;
let selectedMealType = null;

function openMealSelector(recipeIndex) {
  selectedRecipeIndex = recipeIndex;
  document.getElementById("mealSelector").style.display = "block";

  const dayButtonsDiv = document.getElementById("dayButtons");
  dayButtonsDiv.innerHTML = "";
  const length = parseInt(document.getElementById("planLength").value) || 30;

  for (let i = 1; i <= length; i++) {
    const btn = document.createElement("button");
    btn.textContent = "Day " + i;
    btn.onclick = () => selectDay(i);
    dayButtonsDiv.appendChild(btn);
  }
}

function selectDay(day) { selectedDay = day; }
function selectMealType(type) {
  selectedMealType = type;
  if (selectedDay === null || selectedRecipeIndex === null) {
    alert("Please select a day first!");
    return;
  }
  if (!mealPlan[selectedDay - 1]) mealPlan[selectedDay - 1] = { day: selectedDay, breakfast: null, lunch: null, dinner: null };
  mealPlan[selectedDay - 1][selectedMealType] = { name: recipes[selectedRecipeIndex].name };
  saveMealPlan();
  closeMealSelector();
  loadPlan();
}

function closeMealSelector() {
  selectedRecipeIndex = null;
  selectedDay = null;
  selectedMealType = null;
  document.getElementById("mealSelector").style.display = "none";
}

// ----------------------------
// Save Meal Plan
// ----------------------------
function saveMealPlan() {
  localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
}

// ----------------------------
// Load Meal Plan
// ----------------------------
function loadPlan() {
  const planDiv = document.getElementById("plan");
  planDiv.innerHTML = "";
  if (!mealPlan || mealPlan.length === 0) { planDiv.innerHTML = "<p>No meals added yet.</p>"; return; }
  const length = parseInt(document.getElementById("planLength").value) || 30;

  for (let i = 0; i < length; i++) {
    const day = mealPlan[i];
    if (!day) continue;
    planDiv.innerHTML += `
      <h3>Day ${day.day}</h3>
      Breakfast: ${day.breakfast ? day.breakfast.name : ""} <br>
      Lunch: ${day.lunch ? day.lunch.name : ""} <br>
      Dinner: ${day.dinner ? day.dinner.name : ""} <br><br>
    `;
  }
}

// ----------------------------
// Generate Grocery List
// ----------------------------
function generateGrocery() {
  let list = {};
  mealPlan.forEach(day => {
    ["breakfast","lunch","dinner"].forEach(mealType=>{
      let meal = day[mealType]; if(!meal) return;
      let recipe = recipes.find(r => r.name === meal.name); if(!recipe) return;
      const servingsInput = parseInt(document.getElementById("servings").value) || recipe.servings;
      recipe.ingredients.forEach(i=>{
        let scaledAmount = i.amount * (servingsInput / recipe.servings);
        if(!list[i.name]) list[i.name] = {amount:0, unit:i.unit};
        list[i.name].amount += scaledAmount;
      });
    });
  });

  function roundToStoreSize(amount, unit, name) {
    const bulkItems = ["beans","chickpeas","lentils","rice","quinoa","oats"];
    if(bulkItems.some(b => name.toLowerCase().includes(b))) return Math.ceil(amount/1000)+" kg";
    if(unit==="g") return Math.ceil(amount/1000)+" kg";
    if(unit==="ml") return Math.ceil(amount/1000)+" L";
    if(unit==="tsp") return Math.ceil(amount/3)+" tbsp";
    if(unit==="tbsp") return Math.ceil(amount/16)+" cup";
    if(unit==="cups") return Math.ceil(amount/4)+" cups";
    if(unit==="") return Math.ceil(amount)+" pcs";
    return Math.ceil(amount)+" "+unit;
  }

  let html = "<ul>";
  for(let item in list){
    const info = list[item];
    html += `<li>${roundToStoreSize(info.amount, info.unit, item)} ${item}</li>`;
  }
  html += "</ul>";
  document.getElementById("grocery").innerHTML = html;
}

// ----------------------------
// Generate Meal Prep
// ----------------------------
function generateMealPrep() {
  const prepDiv = document.getElementById("prep");
  prepDiv.innerHTML = "<h2>Weekly Meal Prep</h2>";
  if(!mealPlan || mealPlan.length === 0){ prepDiv.innerHTML += "<p>No meals added yet.</p>"; return; }

  let list = {};
  mealPlan.forEach(day => {
    ["breakfast","lunch","dinner"].forEach(mealType=>{
      let meal = day[mealType]; if(!meal) return;
      let recipe = recipes.find(r => r.name === meal.name); if(!recipe) return;
      const servingsInput = parseInt(document.getElementById("servings").value) || recipe.servings;
      recipe.ingredients.forEach(i=>{
        let scaledAmount = i.amount * (servingsInput / recipe.servings);
        if(!list[i.name]) list[i.name] = {amount:0, unit:i.unit};
        list[i.name].amount += scaledAmount;
      });
    });
  });

  let html = "<ul>";
  for(let item in list){
    const info = list[item];
    html += `<li>${toFraction(info.amount)} ${info.unit} ${item}</li>`;
  }
  html += "</ul>";
  prepDiv.innerHTML += html;
}
