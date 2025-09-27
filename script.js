// ✅ Interactive Recipe Finder Script
const apiKey = "5868b456c0124243bc8c1e648af032b7"; // <-- Your Spoonacular API key

const searchBtn = document.getElementById("searchBtn");
const ingredientInput = document.getElementById("ingredientInput");
const cuisineSelect = document.getElementById("cuisineSelect"); 
const recipeContainer = document.getElementById("recipeContainer");

// ✅ Favorites
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const favoritesContainer = document.getElementById("favoritesContainer");

// ✅ Event listener for search
searchBtn.addEventListener("click", () => {
  const ingredients = ingredientInput.value.trim();
  const cuisine = cuisineSelect.value;

  if (!ingredients) {
    alert("⚠️ Please enter at least one ingredient!");
    return;
  }
  fetchRecipes(ingredients, cuisine);
});

// ✅ Fetch Recipes by Ingredients + Cuisine
async function fetchRecipes(ingredients, cuisine = "") {
  recipeContainer.innerHTML = "<p style='color:white;'>🔄 Loading recipes...</p>";

  try {
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${ingredients}&number=8&cuisine=${cuisine}&addRecipeInformation=true`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    recipeContainer.innerHTML = "";

    if (data.results.length === 0) {
      recipeContainer.innerHTML = "<p style='color:white;'>❌ No recipes found. Try different ingredients or cuisines.</p>";
      return;
    }

    renderRecipeCards(data.results);

  } catch (error) {
    recipeContainer.innerHTML = "<p style='color:white;'>⚠️ Error fetching recipes. Check your API key or try again later.</p>";
    console.error("Error fetching recipes:", error);
  }
}

// ✅ Render Recipe Cards (used for both search + categories)
function renderRecipeCards(recipes) {
  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.classList.add("recipe-card");
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>⏱ ${recipe.readyInMinutes || "N/A"} mins | 🍴 Serves ${recipe.servings || "?"}</p>
      <button onclick="window.open('https://spoonacular.com/recipes/${recipe.title.replace(/ /g,'-')}-${recipe.id}','_blank')">
        View Recipe
      </button>
      <button onclick="addToFavorites(${recipe.id}, '${recipe.title}', '${recipe.image}')">❤️ Add to Favorites</button>
      <p class="login-note">Login to Spoonacular to view full instructions</p>
    `;
    recipeContainer.appendChild(card);
  });
}

// ✅ Fetch Recipes by Category (when clicking popular category images)
async function fetchRecipesByCategory(category) {
  recipeContainer.innerHTML = "<p style='color:white;'>🔄 Loading recipes...</p>";

  // ✅ Map category names to Spoonacular's supported types
  const categoryMap = {
    lunch: "main course",
    dinner: "main course",
    snacks: "snack",
    drinks: "drink"
  };

  const apiCategory = categoryMap[category] || category;

  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&type=${apiCategory}&number=8&addRecipeInformation=true`
    );
    const data = await response.json();
    recipeContainer.innerHTML = "";

    if (data.results.length === 0) {
      recipeContainer.innerHTML = "<p style='color:white;'>❌ No recipes found for this category.</p>";
      return;
    }

    renderRecipeCards(data.results);

  } catch (error) {
    recipeContainer.innerHTML = "<p style='color:white;'>⚠️ Error fetching category recipes.</p>";
    console.error("Error fetching category recipes:", error);
  }
}

// ✅ Add event listener for category clicks
document.querySelectorAll(".category-card").forEach(card => {
  card.addEventListener("click", () => {
    const category = card.getAttribute("data-category");
    fetchRecipesByCategory(category);
  });
});

// ✅ Add to Favorites
function addToFavorites(id, title, image) {
  if (favorites.some(fav => fav.id === id)) {
    alert("✅ Already in favorites!");
    return;
  }
  favorites.push({ id, title, image });
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// ✅ Remove from Favorites
function removeFromFavorites(id) {
  favorites = favorites.filter(fav => fav.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// ✅ Render Favorites
function renderFavorites() {
  favoritesContainer.innerHTML = "";
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = "<p style='color:white;'>No favorites yet. Add some ❤️</p>";
    return;
  }
  favorites.forEach(fav => {
    const favCard = document.createElement("div");
    favCard.classList.add("favorite-card");
    favCard.innerHTML = `
      <img src="${fav.image}" alt="${fav.title}">
      <h3>${fav.title}</h3>
      <button onclick="window.open('https://spoonacular.com/recipes/${fav.title.replace(/ /g,'-')}-${fav.id}','_blank')">
        View Recipe
      </button>
      <button onclick="removeFromFavorites(${fav.id})">🗑 Remove</button>
    `;
    favoritesContainer.appendChild(favCard);
  });
}

// ✅ Initial load favorites
renderFavorites();
