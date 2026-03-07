// =======================
// Vegan Meal Planner App
// Cleaned & Upgraded
// =======================

// Get number of servings
function getServings(){
  return parseInt(document.getElementById("servings").value);
}

// Convert decimal quantities to kitchen-friendly fractions
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

// Scale ingredient quantities for servings
function scale(qty, base){
  let servings = getServings();
  let result = qty * (servings / base);
  return toFraction(result);
}

// Show a section (recipes, plan, grocery)
function show(section){
  document.querySelectorAll(".section").forEach(s => s.style.display = "none");
  document.getElementById(section).style.display = "block";

  if(section === "recipes") loadRecipes();
  if(section === "plan") loadPlan();
  if(section === "grocery") generateGrocery();
}

// =======================
// Load Recipes Section
// =======================
function loadRecipes() {
  let html = "";

  recipes.forEach(function(r){
    html += "<h3>" + r.name + "</h3>";

    // Add to Meal Plan button (safe)
    html += '<button onclick="addToPlan(\'' + r.name + '\')">Add to Meal Plan</button>';

    html += "<b>Ingredients</b><ul>";
    r.ingredients.forEach(function(i){
      html += "<li>" + scale(i.qty, r.servings) + " " + i.name + "</li>";
    });
    html += "</ul><b>Steps</b><ol>";
    r.steps.forEach(function(s){
      html += "<li>" + s + "</li>";
    });
    html += "</ol>";
  });

  document.getElementById("recipes").innerHTML = html;
}

// =======================
// Load Meal Plan Section
// =======================
function loadPlan(){
  let length = parseInt(document.getElementById("planLength").value);
  let html = "";

  for(let i = 0; i < length; i++){
    let day = mealPlan[i];
    if(!day) continue;

    html += "<h3>Day "+day.day+"</h3>";

    html += "Breakfast: " + (day.breakfast || "(empty)") + 
            ' <button onclick="removeMeal('+i+',\'breakfast\')">Remove</button><br>';

    html += "Lunch: " + (day.lunch || "(empty)") + 
            ' <button onclick="removeMeal('+i+',\'lunch\')">Remove</button><br>';

    html += "Dinner: " + (day.dinner || "(empty)") + 
            ' <button onclick="removeMeal('+i+',\'dinner\')">Remove</button><br><br>';
  }

  document.getElementById("plan").innerHTML = html;
}

// =======================
// Generate Grocery List
// =======================
function generateGrocery(){
  let list = {};

  mealPlan.forEach(day => {
    if(!day) return;
    let meals = [day.breakfast, day.lunch, day.dinner];

    meals.forEach(mealName => {
      if(!mealName) return;
      let recipe = recipes.find(r => r.name === mealName);
      if(recipe){
        recipe.ingredients.forEach(i => {
          let amount = i.qty * (getServings() / recipe.servings);
          if(!list[i.name]) list[i.name] = 0;
          list[i.name] += amount;
        });
      }
    });
  });

  let html = "<ul>";
  for(let item in list){
    html += "<li>" + toFraction(list[item]) + " " + item + "</li>";
  }
  html += "</ul>";

  document.getElementById("grocery").innerHTML = html;
}

// =======================
// Add recipe to meal plan
// =======================
function addToPlan(recipeName){
  let day = parseInt(prompt("Add to which day? (1-30)"));
  if(isNaN(day) || day < 1) return alert("Invalid day!");

  if(!mealPlan[day-1]){
    mealPlan[day-1] = { day: day, breakfast: "", lunch: "", dinner: "" };
  }

  let mealType = prompt("Breakfast, lunch, or dinner?").toLowerCase();
  if(!["breakfast","lunch","dinner"].includes(mealType)){
    return alert("Invalid meal type!");
  }

  mealPlan[day-1][mealType] = recipeName;
  loadPlan();
  alert("Added to meal plan!");
}

// =======================
// Remove meal from plan
// =======================
function removeMeal(day, mealType){
  if(mealPlan[day]){
    mealPlan[day][mealType] = "";
    loadPlan();
  }
}
