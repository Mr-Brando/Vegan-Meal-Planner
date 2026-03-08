// =======================
// Meal Plan Storage + Logic
// =======================

let mealPlan = [];

// ---------- Load saved plan ----------
function loadSavedMealPlan(){

  let saved = localStorage.getItem("veganMealPlan");

  if(saved){
    mealPlan = JSON.parse(saved);
  }else{
    initMealPlan();
  }

}

// ---------- Create empty plan ----------
function initMealPlan(){

  mealPlan = [];

  for(let i=0;i<30;i++){
    mealPlan[i] = {
      day:i+1,
      breakfast:"",
      lunch:"",
      dinner:""
    };
  }

}

// ---------- Save plan ----------
function saveMealPlan(){
  localStorage.setItem("veganMealPlan", JSON.stringify(mealPlan));
}

// ---------- Plan length ----------
function getPlanLength(){

  let val = parseInt(document.getElementById("planLength").value);

  if([7,14,30].includes(val)) return val;

  return 30;

}

// ---------- Remove meal ----------
function removeMeal(day,mealType){

  mealPlan[day][mealType] = "";

  saveMealPlan();

  loadPlan();

}

// ---------- Load plan display ----------
function loadPlan(){

  let length = getPlanLength();

  let html="";

  for(let i=0;i<length;i++){

    let d = mealPlan[i];

    html+="<h3>Day "+d.day+"</h3>";

    html+="Breakfast: "+(d.breakfast||"(empty)")+
    ' <button onclick="removeMeal('+i+',\'breakfast\')">Remove</button><br>';

    html+="Lunch: "+(d.lunch||"(empty)")+
    ' <button onclick="removeMeal('+i+',\'lunch\')">Remove</button><br>';

    html+="Dinner: "+(d.dinner||"(empty)")+
    ' <button onclick="removeMeal('+i+',\'dinner\')">Remove</button><br><br>';

  }

  document.getElementById("plan").innerHTML = html;

}

// Load saved plan on startup
loadSavedMealPlan();
