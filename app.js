let selectedRecipe = null;
let selectedDay = null;

window.onload = function(){

show("plan");
loadPlan();
renderRecipes();
generateDayButtons();

};

function show(section){

document.querySelectorAll(".section").forEach(s=>{
s.style.display="none";
});

document.getElementById(section).style.display="block";

}

function renderRecipes(){

const recipeDiv = document.getElementById("recipes");

recipeDiv.innerHTML="";

recipes.forEach((recipe,index)=>{

const card=document.createElement("div");

card.className="recipeCard";

card.innerHTML=`
<h3>${recipe.name}</h3>
<button onclick="openMealSelector(${index})">
Add To Meal Plan
</button>
`;

recipeDiv.appendChild(card);

});

}

function openMealSelector(recipeIndex){

selectedRecipe = recipes[recipeIndex];

document.getElementById("mealSelector").style.display="block";

}

function generateDayButtons(){

const container=document.getElementById("dayButtons");

container.innerHTML="";

const days=parseInt(document.getElementById("planLength").value);

for(let i=1;i<=days;i++){

const btn=document.createElement("button");

btn.innerText="Day "+i;

btn.onclick=()=>selectDay(i);

container.appendChild(btn);

}

}

function selectDay(day){

selectedDay = day;

}

function selectMealType(type){

if(!selectedDay){
alert("Select a day first");
return;
}

mealPlan[selectedDay][type]=selectedRecipe;

saveMealPlan();

closeMealSelector();

loadPlan();

}

function closeMealSelector(){

document.getElementById("mealSelector").style.display="none";

selectedRecipe=null;
selectedDay=null;

}
