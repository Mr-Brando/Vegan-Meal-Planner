// =======================
// mealPlan.js
// Fully working for app.js
// =======================

// Initialize meal plan array (30 days max)
let mealPlan = [];

function initMealPlan() {
  mealPlan = [];
  for (let i = 0; i < 30; i++) {
    mealPlan[i] = {
      day: i + 1,
      breakfast: "",
      lunch: "",
      dinner: ""
    };
  }
}

// Call this once when the page loads
initMealPlan();

// Get the number of days to display based on dropdown
function getPlanLength() {
  const lengthSelect = document.getElementById("planLength");
  if (!lengthSelect) return 30; // fallback
  const val = parseInt(lengthSelect.value);
  return [7, 14, 30].includes(val) ? val : 30;
}

// Add recipe to plan
function addToPlan(recipeName) {
  const day = parseInt(prompt("Add to which day? (1-" + getPlanLength() + ")"));
  if (isNaN(day) || day < 1 || day > getPlanLength()) {
    return alert("Invalid day!");
  }

  let mealType = prompt("Breakfast, lunch, or dinner?").toLowerCase();
  if (!["breakfast", "lunch", "dinner"].includes(mealType)) {
    return alert("Invalid meal type!");
  }

  if (!mealPlan[day - 1]) {
    mealPlan[day - 1] = { day: day, breakfast: "", lunch: "", dinner: "" };
  }

  mealPlan[day - 1][mealType] = recipeName;
  loadPlan();
}

// Remove meal
function removeMeal(day, mealType) {
  if (mealPlan[day] && mealType) {
    mealPlan[day][mealType] = "";
    loadPlan();
  }
}

// =======================
// Load the plan display
// This function MUST be in mealPlan.js or app.js
// =======================
function loadPlan() {
  const length = getPlanLength();
  let html = "";

  for (let i = 0; i < length; i++) {
    let day = mealPlan[i];
    if (!day) continue;

    html += "<h3>Day " + day.day + "</h3>";
    html += "Breakfast: " + (day.breakfast || "(empty)") +
            ' <button onclick="removeMeal(' + i + ',\'breakfast\')">Remove</button><br>';
    html += "Lunch: " + (day.lunch || "(empty)") +
            ' <button onclick="removeMeal(' + i + ',\'lunch\')">Remove</button><br>';
    html += "Dinner: " + (day.dinner || "(empty)") +
            ' <button onclick="removeMeal(' + i + ',\'dinner\')">Remove</button><br><br>';
  }

  const planDiv = document.getElementById("plan");
  if (planDiv) planDiv.innerHTML = html;
}
