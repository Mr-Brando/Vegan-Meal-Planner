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

saveMealPlan();

}
