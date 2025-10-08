document.addEventListener("DOMContentLoaded", () => {
    const firstName = localStorage.getItem("firstName");
    const userNameEl = document.getElementById("userName");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!firstName) {
        alert("Anda harus login untuk mengakses halaman ini.");
        window.location.href = "login.html";
        return;
    }

    userNameEl.textContent = `Halo, ${firstName}! 👋`;
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("firstName");
        alert("Kamu telah logout!");
        window.location.href = "login.html";
    });

    const recipeGrid = document.getElementById("recipe-grid");
    const searchInput = document.getElementById("searchInput");
    const cuisineFilter = document.getElementById("cuisineFilter");
    const showMoreBtn = document.getElementById("showMoreBtn");
    const loader = document.getElementById("loader");

    let allRecipes = [];
    let filteredRecipes = [];
    let currentPage = 1;
    const recipesPerPage = 8;

    const fetchRecipes = async () => {
        showLoader(true);
        try {
            const response = await fetch("https://dummyjson.com/recipes");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allRecipes = data.recipes;
            filteredRecipes = [...allRecipes];
            
            populateCuisineFilter(allRecipes);
            renderRecipes();

        } catch (error) {
            console.error("Fetch error:", error);
            recipeGrid.innerHTML = `<p class="error-message">Gagal memuat resep. Silakan coba lagi nanti.</p>`;
        } finally {
            showLoader(false);
        }
    };

    const renderRecipes = () => {
        if (currentPage === 1) {
            recipeGrid.innerHTML = "";
        }

        const startIndex = (currentPage - 1) * recipesPerPage;
        const endIndex = startIndex + recipesPerPage;
        const recipesToRender = filteredRecipes.slice(startIndex, endIndex);

        if (recipesToRender.length === 0 && currentPage === 1) {
            recipeGrid.innerHTML = "<p>Tidak ada resep yang cocok dengan pencarian Anda.</p>";
        }

        recipesToRender.forEach(recipe => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${recipe.image}" alt="${recipe.name}">
                </div>
                <span class="card-cuisine">${recipe.cuisine}</span>
                <div class="card-content">
                    <h3>${recipe.name}</h3>
                    <div class="card-meta">
                        <span>${recipe.cookTimeMinutes} min</span>
                        <span>${recipe.difficulty}</span>
                    </div>
                    <div class="rating">
                        ${generateStars(recipe.rating)}
                        <span>(${recipe.rating.toFixed(1)})</span>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.location.href = `details.html?id=${recipe.id}`;
            });

            recipeGrid.appendChild(card);
        });
        
        updateShowMoreButton();
    };

    const generateStars = (rating) => {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) starsHTML += '<span class="star">★</span>';
        if (halfStar) starsHTML += '<span class="star">★</span>';
        for (let i = 0; i < emptyStars; i++) starsHTML += '<span class="star empty">☆</span>';
        
        return starsHTML;
    };

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCuisine = cuisineFilter.value;

        filteredRecipes = allRecipes.filter(recipe => {
            const matchesCuisine = !selectedCuisine || recipe.cuisine === selectedCuisine;
            
            const matchesSearch = 
                recipe.name.toLowerCase().includes(searchTerm) ||
                recipe.cuisine.toLowerCase().includes(searchTerm) ||
                recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm));
            
            return matchesCuisine && matchesSearch;
        });

        currentPage = 1;
        renderRecipes();
    };

    const populateCuisineFilter = (recipes) => {
        const cuisines = new Set(recipes.map(r => r.cuisine));
        cuisines.forEach(cuisine => {
            const option = document.createElement("option");
            option.value = cuisine;
            option.textContent = cuisine;
            cuisineFilter.appendChild(option);
        });
    };

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    };

    searchInput.addEventListener("input", debounce(applyFilters, 300));
    cuisineFilter.addEventListener("change", applyFilters);
    
    showMoreBtn.addEventListener("click", () => {
        currentPage++;
        renderRecipes();
    });

    const showLoader = (isLoading) => {
        loader.style.display = isLoading ? "block" : "none";
    };
    
    const updateShowMoreButton = () => {
        const totalRendered = currentPage * recipesPerPage;
        if (totalRendered >= filteredRecipes.length) {
            showMoreBtn.classList.add("hidden");
        } else {
            showMoreBtn.classList.remove("hidden");
        }
    };
    
    fetchRecipes();
});