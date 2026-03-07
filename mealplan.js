// =======================
// mealplan.js
// Handles the meal plan logic
// =======================

// Initialize meal plan array (30 days)
let mealPlan = [];

function initMealPlan() {
  mealPlan = [];
  for (let i = 0; i < 30; i++) {
    mealPlan[i] = { day: i+1, breakfast: "", lunch: "", dinner: "" };
  }
}
initMealPlan();

// Get plan length from dropdown
function getPlanLength() {
  const sel = document.getElementById("planLength");
  if (!sel) return 30;
  const val = parseInt(sel.value);
  return [7, 14, 30].includes(val) ? val : 30;
}

// Add recipe to meal plan
function addToPlan(recipeName) {
  const day = parseInt(prompt("Add to which day? (1-" + getPlanLength() + ")"));
  if (isNaN(day) || day < 1 || day > getPlanLength()) return alert("Invalid day!");

  let mealType = prompt("Breakfast, lunch, or dinner?").toLowerCase();
  if (!["breakfast","lunch","dinner"].includes(mealType)) return alert("Invalid meal type!");

  if (!mealPlan[day-1]) mealPlan[day-1] = { day: day, breakfast:"", lunch:"", dinner:"" };
  mealPlan[day-1][mealType] = recipeName;

  loadPlan();
}

// Remove a meal
function removeMeal(day, mealType) {
  if (mealPlan[day]) {
    mealPlan[day][mealType] = "";
    loadPlan();
  }
}

// Load Plan section
function loadPlan() {
  const length = getPlanLength();
  let html = "";

  for (let i = 0; i < length; i++) {
    const day = mealPlan[i];
    if (!day) continue;

    html += "<h3>Day "+day.day+"</h3>";
    html += "Breakfast: " + (day.breakfast || "(empty)") +
            ' <button onclick="removeMeal('+i+',\'breakfast\')">Remove</button><br>';
    html += "Lunch: " + (day.lunch || "(empty)") +
            ' <button onclick="removeMeal('+i+',\'lunch\')">Remove</button><br>';
    html += "Dinner: " + (day.dinner || "(empty)") +
            ' <button onclick="removeMeal('+i+',\'dinner\')">Remove</button><br><br>';
  }

  const planDiv = document.getElementById("plan");
  if (planDiv) planDiv.innerHTML = html;
}
