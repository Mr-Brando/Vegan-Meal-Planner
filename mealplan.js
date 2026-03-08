let mealPlan = JSON.parse(localStorage.getItem("mealPlan")) || {};

function saveMealPlan(){
localStorage.setItem("mealPlan", JSON.stringify(mealPlan));
}

function loadPlan(){

const days = parseInt(document.getElementById("planLength").value);
const planDiv = document.getElementById("plan");

planDiv.innerHTML = "";

for(let i=1;i<=days;i++){

if(!mealPlan[i]){
mealPlan[i] = {breakfast:null,lunch:null,dinner:null};
}

const dayBox = document.createElement("div");
dayBox.className = "dayBox";

dayBox.innerHTML = `
<h3>Day ${i}</h3>

<div>
<b>Breakfast:</b>
<span id="day${i}breakfast">${mealPlan[i].breakfast?.name || ""}</span>
</div>

<div>
<b>Lunch:</b>
<span id="day${i}lunch">${mealPlan[i].lunch?.name || ""}</span>
</div>

<div>
<b>Dinner:</b>
<span id="day${i}dinner">${mealPlan[i].dinner?.name || ""}</span>
</div>
`;

planDiv.appendChild(dayBox);

}

function generateGrocery() {

  let list = {};

  // Combine all meals in the plan
  mealPlan.forEach(day => {
    ["breakfast", "lunch", "dinner"].forEach(mealType => {
      let meal = day[mealType];
      if (!meal) return;

      // Find recipe object
      let recipe = recipes.find(r => r.name === meal.name);
      if (!recipe) return;

      // Get current servings input
      const servingsInput = parseInt(document.getElementById("servings").value) || recipe.servings;

      recipe.ingredients.forEach(i => {
        // Scale ingredient based on servings
        let scaledAmount = i.amount * (servingsInput / recipe.servings);

        if (!list[i.name]) {
          list[i.name] = { amount: 0, unit: i.unit };
        }

        list[i.name].amount += scaledAmount;
      });
    });
  });

  // Function to round amounts to store-friendly sizes
  function roundToStoreSize(amount, unit, name) {

    // Treat common bulk items in kg
    const bulkItems = ["beans", "chickpeas", "lentils", "rice", "quinoa", "oats"];
    if (bulkItems.some(b => name.toLowerCase().includes(b))) {
      return Math.ceil(amount / 1000) + " kg"; // assuming amount is in grams
    }

    // Unit conversions
    if (unit === "g") return Math.ceil(amount / 1000) + " kg";
    if (unit === "ml") return Math.ceil(amount / 1000) + " L";
    if (unit === "tsp") return Math.ceil(amount / 3) + " tbsp";   // 3 tsp ≈ 1 tbsp
    if (unit === "tbsp") return Math.ceil(amount / 16) + " cup";  // 16 tbsp ≈ 1 cup
    if (unit === "cups") return Math.ceil(amount / 4) + " cups";  // round up batch
    if (unit === "") return Math.ceil(amount) + " pcs";           // countable items

    // fallback
    return Math.ceil(amount) + " " + unit;
  }

  // Build the HTML list
  let html = "<ul>";

  for (let item in list) {
    const info = list[item];
    html += `<li>${roundToStoreSize(info.amount, info.unit, item)} ${item}</li>`;
  }

  html += "</ul>";

  document.getElementById("grocery").innerHTML = html;

}

saveMealPlan();

}

