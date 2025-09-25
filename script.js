// ✅ Interactive Recipe Finder Script
const apiKey = "5868b456c0124243bc8c1e648af032b7"; // <-- Your Spoonacular API key

const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");
const cuisineSelect = document.getElementById("cuisineSelect"); // <-- Dropdown for cuisines
const recipeContainer = document.getElementById("recipeContainer");

searchBtn.addEventListener("click", () => {
  const ingredients = ingredientInput.value.trim();
  const cuisine = cuisineSelect.value; // get selected cuisine

  if (!ingredients) {
    alert("⚠️ Please enter at least one ingredient!");
    return;
  }
  fetchRecipes(ingredients, cuisine);
});

async function fetchRecipes(ingredients, cuisine = "") {
  recipeContainer.innerHTML = "<p style='color:white;'>🔄 Loading recipes...</p>";

  try {
    // ✅ Using complexSearch with cuisine filter
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${ingredients}&number=8&cuisine=${cuisine}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    recipeContainer.innerHTML = "";

    if (data.results.length === 0) {
      recipeContainer.innerHTML = "<p style='color:white;'>❌ No recipes found. Try different ingredients or cuisines.</p>";
      return;
    }

    data.results.forEach(recipe => {
  const card = document.createElement("div");
  card.classList.add("recipe-card"); // fixed to use correct CSS class
  card.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}">
    <h3>${recipe.title}</h3>
    <button onclick="window.open('https://spoonacular.com/recipes/${recipe.title.replace(/ /g,'-')}-${recipe.id}','_blank')">
      View Recipe
    </button>
    <p class="login-note">Login to Spoonacular to view full instructions</p>
  `;
  recipeContainer.appendChild(card);
});

  } catch (error) {
    recipeContainer.innerHTML = "<p style='color:white;'>⚠️ Error fetching recipes. Check your API key or try again later.</p>";
    console.error("Error fetching recipes:", error);
  }
}

// ✅ Instructions with fallback
let instructions = "No instructions available.";

if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
  instructions = recipe.analyzedInstructions[0].steps
    .map(step => `<li>${step.step}</li>`)
    .join("");
  instructions = `<ol>${instructions}</ol>`;
} else if (recipe.summary) {
  instructions = `<p>${recipe.summary}</p>`;
} else if (recipe.sourceUrl) {
  instructions = `<p>Instructions not available. 👉 
    <a href="${recipe.sourceUrl}" target="_blank">View full recipe here</a></p>`;
}
