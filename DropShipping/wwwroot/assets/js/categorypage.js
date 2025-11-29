class CategoryPage {
    constructor() {
        this.products = [];        // Loaded from API
        this.filteredProducts = [];
        this.currentPage = 1;
        this.perPage = 9;
        this.activeBrands = new Set();
        this.cartItems = this.loadCartItems();
        this.productCardImages = new Map();

        // DOM elements
        this.productsGrid = document.getElementById('categoryProducts');
        this.pagination = document.getElementById('pagination');
        this.brandFiltersContainer = document.getElementById('brandFilters');
        this.resultsCount = document.getElementById('resultsCount');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.cartCountElement = document.getElementById('cartCount');

        this.init();
    }

    async init() {
        if (!this.productsGrid) return;

        // If a search query (q) exists in the URL, use it to pre-populate the search input
        this.searchInput = document.querySelector('.search-bar input');
        const urlParams = new URLSearchParams(window.location.search);
        const initialQuery = (urlParams.get('q') || '').trim();
        if (this.searchInput && initialQuery) this.searchInput.value = initialQuery;

        await this.loadProductsFromApi(initialQuery);
        await this.renderBrandFilters();
        this.attachEvents();
        this.applyFilters();
        this.updateCartCount();
    }

    /*-----------------------------------------------------------
     |  LOAD PRODUCTS FROM API
     -----------------------------------------------------------*/
    async loadProductsFromApi(searchTerm = '') {
        try {
            // build url with optional search term
            const q = (searchTerm || '').trim();
            let url = '/api/Products';
            if (q) url += `?SearchTerm=${encodeURIComponent(q)}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to load products. Status: ${response.status}`);
            }

            const data = await response.json();
            const apiProducts = data.result;

            this.products = apiProducts.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                brand: { name: p.brandName },
                category: { name: p.categoryName },
                images: p.images.map(img => ({ image: img })),
                modelYear: p.modelYear || "N/A",
                description: ""
            }));

            this.filteredProducts = [...this.products];

            localStorage.setItem('productCatalog', JSON.stringify(this.products));

        } catch (error) {
            console.error("Error loading products:", error);
            this.showMessage("Failed loading products from server", "error");
        }
    }

    /*-----------------------------------------------------------
     | BRAND FILTERS (FROM API)
     -----------------------------------------------------------*/
    async renderBrandFilters() {
        if (!this.brandFiltersContainer) return;

        try {
            const response = await fetch('/api/Brands');
            if (!response.ok) throw new Error("Failed to load brands");

            const brands = await response.json();

            const sortedBrands = brands.sort((a, b) => a.name.localeCompare(b.name));

            this.brandFiltersContainer.innerHTML = sortedBrands
                .map(brand => `
                    <label class="filter-option">
                        <input type="checkbox" value="${brand.name}" data-brand-id="${brand.id}">
                        <span>${brand.name}</span>
                    </label>
                `)
                .join('');

            this.brandFiltersContainer.querySelectorAll("input").forEach(cb => {
                cb.addEventListener("change", (e) => {
                    const { value, checked } = e.target;
                    if (checked) this.activeBrands.add(value);
                    else this.activeBrands.delete(value);

                    this.applyFilters();
                });
            });

        } catch (error) {
            console.error("Brand load failed. Using fallback:", error);
            this.renderBrandFiltersFromProducts();
        }
    }

    renderBrandFiltersFromProducts() {
        const uniqueBrands = [...new Set(this.products.map(p => p.brand.name))].sort();

        this.brandFiltersContainer.innerHTML = uniqueBrands
            .map(brand => `
                <label class="filter-option">
                    <input type="checkbox" value="${brand}">
                    <span>${brand}</span>
                </label>
            `)
            .join('');

        this.brandFiltersContainer.querySelectorAll("input").forEach(cb => {
            cb.addEventListener("change", e => {
                const { value, checked } = e.target;
                checked ? this.activeBrands.add(value) : this.activeBrands.delete(value);
                this.applyFilters();
            });
        });
    }

    /*-----------------------------------------------------------
     | FILTER + PAGINATION
     -----------------------------------------------------------*/
    applyFilters() {
        const useBrand = this.activeBrands.size > 0;

        this.filteredProducts = useBrand
            ? this.products.filter(p => this.activeBrands.has(p.brand.name))
            : [...this.products];

        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
        this.updateResultsCount();
    }

    renderProducts() {
        const start = (this.currentPage - 1) * this.perPage;
        const items = this.filteredProducts.slice(start, start + this.perPage);

        this.productsGrid.innerHTML = "";

        if (items.length === 0) {
            this.productsGrid.innerHTML = `<p>No products found.</p>`;
            return;
        }

        items.forEach(product => {
            const card = this.createProductCard(product);
            this.productsGrid.appendChild(card);
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.perPage);
        this.pagination.innerHTML = "";

        const addBtn = (label, page, disabled = false) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.disabled = disabled;
            if (page === this.currentPage) btn.classList.add("active");

            btn.addEventListener("click", () => {
                this.currentPage = page;
                this.renderProducts();
                this.renderPagination();
                this.updateResultsCount();
            });

            this.pagination.appendChild(btn);
        };

        addBtn("‹", Math.max(1, this.currentPage - 1), this.currentPage === 1);

        for (let i = 1; i <= totalPages; i++) addBtn(i, i);

        addBtn("›", Math.min(totalPages, this.currentPage + 1), this.currentPage === totalPages);
    }

    updateResultsCount() {
        const total = this.filteredProducts.length;
        if (total === 0) {
            this.resultsCount.textContent = "No results";
            return;
        }

        const start = (this.currentPage - 1) * this.perPage + 1;
        const end = Math.min(start + this.perPage - 1, total);

        this.resultsCount.textContent = `Showing ${start}-${end} of ${total} products`;
    }

    /*-----------------------------------------------------------
     | PRODUCT CARD
     -----------------------------------------------------------*/
    createProductCard(product) {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.productId = product.id;

        this.productCardImages.set(product.id, 0);

        const firstImg = product.images?.[0]?.image || "https://via.placeholder.com/300";
        const hasMultiple = product.images.length > 1;

        card.innerHTML = `
            <div class="product-card-image">
                <img src="${firstImg}" alt="${product.name}">
                <button class="card-action-button" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>

                ${hasMultiple ? `
                    <button class="card-arrow card-arrow-left" data-direction="-1"><i class="fas fa-chevron-left"></i></button>
                    <button class="card-arrow card-arrow-right" data-direction="1"><i class="fas fa-chevron-right"></i></button>
                ` : ""}
            </div>

            <div class="product-card-info">
                <h3>${product.name}</h3>
                <div>${product.brand.name}</div>
                <div class="product-card-price">$${product.price}</div>
            </div>
        `;

        this.setupCardArrows(card, product);
        this.setupCardActionButton(card, product);

        card.addEventListener("click", (e) => {
            if (e.target.closest("button")) return;
            this.viewProduct(product.id);
        });

        return card;
    }

    setupCardArrows(card, product) {
        if (product.images.length <= 1) return;
        const imgEl = card.querySelector("img");

        card.querySelectorAll(".card-arrow").forEach(btn => {
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const direction = parseInt(btn.dataset.direction);
                this.navigateCardImage(product.id, direction, imgEl, product);
            });
        });
    }

    navigateCardImage(productId, direction, imgEl, product) {
        const total = product.images.length;
        let index = this.productCardImages.get(productId) || 0;

        index = (index + direction + total) % total;
        this.productCardImages.set(productId, index);

        imgEl.src = product.images[index].image;
    }

    setupCardActionButton(card, product) {
        const btn = card.querySelector(".card-action-button");
        btn.addEventListener("click", e => {
            e.stopPropagation();
            this.addToCart(product);
        });
    }

    /*-----------------------------------------------------------
     | CART LOGIC
     -----------------------------------------------------------*/
    addToCart(product) {
        const existing = this.cartItems.find(i => i.id === product.id);

        if (existing) existing.quantity++;
        else {
            this.cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]?.image,
                quantity: 1
            });
        }

        this.persistCartItems();
        this.updateCartCount();
        this.showMessage(`${product.name} added to cart!`, "success");
    }

    updateCartCount() {
        const count = this.cartItems.reduce((s, i) => s + i.quantity, 0);
        this.cartCountElement.textContent = count;
    }

    persistCartItems() {
        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    }

    loadCartItems() {
        return JSON.parse(localStorage.getItem("cartItems") || "[]");
    }

    /*-----------------------------------------------------------
     | PRODUCT VIEW PAGE
     -----------------------------------------------------------*/
    viewProduct(productId) {
        const item = this.products.find(p => p.id === productId);
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "productpage.html";
    }

    /*-----------------------------------------------------------
     | UI MESSAGE
     -----------------------------------------------------------*/
    showMessage(text, type) {
        const msg = document.createElement("div");
        msg.className = "toast";
        msg.textContent = text;

        document.body.appendChild(msg);

        setTimeout(() => msg.remove(), 3000);
    }

    attachEvents() {
        this.clearFiltersBtn.addEventListener("click", () => {
            this.activeBrands.clear();
            this.brandFiltersContainer.querySelectorAll("input").forEach(cb => cb.checked = false);
            this.applyFilters();
        });
        // wire up search input (debounced)
        if (this.searchInput) {
            let timer = null;
            const doSearch = () => {
                const term = (this.searchInput.value || '').trim();
                // update URL param without reloading
                const params = new URLSearchParams(window.location.search);
                if (term) params.set('q', term); else params.delete('q');
                history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);

                // reload products from server using new term
                clearTimeout(timer);
                timer = setTimeout(async () => {
                    await this.loadProductsFromApi(term);
                    this.applyFilters();
                }, 350);
            };

            this.searchInput.addEventListener('input', doSearch);
            // also support pressing Enter
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') doSearch();
            });
        }
    }
}

document.addEventListener("DOMContentLoaded", () => new CategoryPage());
