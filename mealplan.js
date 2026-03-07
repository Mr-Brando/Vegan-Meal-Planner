// =======================
// mealPlan.js
// Vegan Meal Planner
// Clean & Functional
// =======================

// Initialize mealPlan array
// 30 days by default (monthly plan)
let mealPlan = [];

// Fill each day with empty meals
for(let i = 0; i < 30; i++){
  mealPlan[i] = {
    day: i + 1,
    breakfast: "",
    lunch: "",
    dinner: ""
  };
}

// =======================
// Helper functions
// =======================

// Get meal plan length from dropdown
function getPlanLength(){
  const length = parseInt(document.getElementById("planLength").value);
  if([7,14,30].includes(length)) return length;
  return 30; // default monthly
}

// =======================
// Optional: function to reset plan
// Clears all meals
function resetMealPlan(){
  for(let i = 0; i < mealPlan.length; i++){
    mealPlan[i].breakfast = "";
    mealPlan[i].lunch = "";
    mealPlan[i].dinner = "";
  }
  loadPlan(); // refresh display
}

// =======================
// Optional: function to get meals for a specific day
function getDayMeals(dayNumber){
  if(dayNumber < 1 || dayNumber > mealPlan.length) return null;
  return mealPlan[dayNumber - 1];
}

// =======================
// Example usage
// mealPlan[0].breakfast = "Apple Cinnamon Oatmeal"
// mealPlan[1].dinner = "Lentil Sweet Potato Stew"
// =======================

// export for modular setups if needed (not required for vanilla JS)
// export { mealPlan, getPlanLength, resetMealPlan, getDayMeals };
