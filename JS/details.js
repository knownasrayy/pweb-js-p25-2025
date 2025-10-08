document.addEventListener("DOMContentLoaded", () => {
    const recipeDetailContainer = document.getElementById("recipe-detail-container");
    const loader = document.getElementById("loader");

    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");

    if (!recipeId) {
        recipeDetailContainer.innerHTML = "<p>Resep tidak ditemukan. Silakan kembali ke halaman utama.</p>";
        return;
    }

    const fetchRecipeDetails = async () => {
        loader.style.display = "block";
        try {
            const response = await fetch(`https://dummyjson.com/recipes/${recipeId}`);
            if (!response.ok) {
                throw new Error("Gagal mengambil data resep.");
            }
            const recipe = await response.json();
            displayRecipeDetails(recipe);
        } catch (error) {
            console.error("Error:", error);
            recipeDetailContainer.innerHTML = `<p>${error.message}</p>`;
        } finally {
            loader.style.display = "none";
        }
    };

    const displayRecipeDetails = (recipe) => {
        recipeDetailContainer.innerHTML = `
            <div class="recipe-image-section">
                <img src="${recipe.image}" alt="${recipe.name}">
            </div>
            <div class="recipe-info-section">
                <h1>${recipe.name}</h1>
                <div class="recipe-meta">
                    <span><b>Penyajian:</b> ${recipe.servings} porsi</span>
                    <span><b>Waktu Persiapan:</b> ${recipe.prepTimeMinutes} min</span>
                    <span><b>Waktu Memasak:</b> ${recipe.cookTimeMinutes} min</span>
                </div>
                
                <h2 class="section-title">Bahan-Bahan</h2>
                <div id="recipe-ingredients">
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                </div>
                
                <h2 class="section-title">Instruksi</h2>
                <div id="recipe-instructions">
                    <ol>
                        ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                </div>
            </div>
        `;
    };

    fetchRecipeDetails();
});
