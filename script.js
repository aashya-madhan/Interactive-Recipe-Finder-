// ✅ Interactive Recipe Finder Script
const apiKey = "4f63e579ac954b3a9ce47a0c9f93d391"; // <-- Your Spoonacular API key

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
      card.classList.add("card");
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}">
        <div class="content">
          <h3>${recipe.title}</h3>
          <button onclick="window.open('https://spoonacular.com/recipes/${recipe.title.replace(/ /g,'-')}-${recipe.id}','_blank')">View Recipe</button>
        </div>
      `;
      recipeContainer.appendChild(card);
    });
  } catch (error) {
    recipeContainer.innerHTML = "<p style='color:white;'>⚠️ Error fetching recipes. Check your API key or try again later.</p>";
    console.error("Error fetching recipes:", error);
  }
}
