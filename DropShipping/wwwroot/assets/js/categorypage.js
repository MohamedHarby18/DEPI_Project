class CategoryPage {
    constructor() {
        this.products = this.getMockProducts();
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.perPage = 9;
        this.activeBrands = new Set();

        this.productsGrid = document.getElementById('categoryProducts');
        this.pagination = document.getElementById('pagination');
        this.brandFiltersContainer = document.getElementById('brandFilters');
        this.resultsCount = document.getElementById('resultsCount');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.cartCountElement = document.getElementById('cartCount');
        this.toastContainer = document.getElementById('toastContainer');

        // Internal flag to attach grid-level events once
        this._cardEventsAttached = false;

        this.init();
    }

    init() {
        if (!this.productsGrid) return;
        this.renderBrandFilters();
        this.attachEvents();
        this.renderProducts();
        this.renderPagination();
        this.updateResultsCount();
        this.updateCartCount(); // update cart count on load
    }

    attachEvents() {
        if (this.clearFiltersBtn) {
            this.clearFiltersBtn.addEventListener('click', () => {
                this.activeBrands.clear();
                this.brandFiltersContainer
                    .querySelectorAll('input[type="checkbox"]')
                    .forEach((checkbox) => (checkbox.checked = false));
                this.applyFilters();
            });
        }

        if (this.productsGrid && !this._cardEventsAttached) {
            // Delegated click handler for:
            // - card action button (add to cart)
            // - card arrows (image navigation)
            this.productsGrid.addEventListener('click', (event) => {
                // Add to cart button
                const addBtn = event.target.closest('.card-action-button');
                if (addBtn) {
                    const productId = addBtn.dataset.productId;
                    const product = this.products.find((p) => p.id === productId);
                    if (product) this.addToCart(product);
                    return;
                }

                // Arrow buttons
                const arrow = event.target.closest('.card-arrow');
                if (arrow) {
                    event.stopPropagation();
                    const container = arrow.closest('.product-card-image');
                    if (!container) return;
                    const images = JSON.parse(container.dataset.images || '[]');
                    if (!images || images.length <= 1) return;

                    let idx = parseInt(container.dataset.currentIndex || '0', 10);
                    const isLeft = arrow.classList.contains('card-arrow-left');
                    idx = (idx + (isLeft ? -1 : 1) + images.length) % images.length;
                    container.dataset.currentIndex = idx;

                    // Update image element and counter
                    const img = container.querySelector('img');
                    if (img) img.src = images[idx].image;

                    const currentSpan = container.querySelector('.current-image');
                    if (currentSpan) currentSpan.textContent = idx + 1;
                    return;
                }
            });

            this._cardEventsAttached = true;
        }
    }

    renderBrandFilters() {
        if (!this.brandFiltersContainer) return;
        const brands = [...new Set(this.products.map((product) => product.brand.name))].sort();

        this.brandFiltersContainer.innerHTML = brands
            .map(
                (brand) => `
                <label class="filter-option">
                    <input type="checkbox" value="${brand}">
                    <span>${brand}</span>
                </label>
            `
            )
            .join('');

        this.brandFiltersContainer.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.addEventListener('change', (event) => {
                const { value, checked } = event.target;
                if (checked) {
                    this.activeBrands.add(value);
                } else {
                    this.activeBrands.delete(value);
                }
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        const hasBrandFilters = this.activeBrands.size > 0;

        this.filteredProducts = hasBrandFilters
            ? this.products.filter((product) => this.activeBrands.has(product.brand.name))
            : [...this.products];

        this.currentPage = 1;
        this.renderProducts();
        this.renderPagination();
        this.updateResultsCount();
    }

    renderProducts() {
        if (!this.productsGrid) return;

        const start = (this.currentPage - 1) * this.perPage;
        const paginatedProducts = this.filteredProducts.slice(start, start + this.perPage);

        if (paginatedProducts.length === 0) {
            this.productsGrid.innerHTML = '<div class="loading">No products found for the selected filters.</div>';
            return;
        }

        this.productsGrid.innerHTML = paginatedProducts.map((product) => this.createProductCard(product)).join('');

        // After DOM insertion, initialize per-card currentIndex and counters
        this.setupCardInitialState();
    }

    // New card markup matching product.css design (arrows, counter, action)
    createProductCard(product) {
        const images = product.images ?? [];
        const firstImg = images.length > 0 ? images[0].image : 'https://via.placeholder.com/320x240?text=No+Image';
        const imagesData = JSON.stringify(images);

        // If product has more than 1 image, include arrows and counter
        const hasMany = images.length > 1;
        const totalImages = images.length;

        return `
            <article class="product-card">
                <div class="product-card-image" data-images='${imagesData}' data-current-index="0">
                    <img src="${firstImg}" alt="${product.name}">

                    ${hasMany ? `
                        <button class="card-arrow card-arrow-left" type="button" aria-label="Previous image">
                            <i class="fa fa-chevron-left"></i>
                        </button>
                        <button class="card-arrow card-arrow-right" type="button" aria-label="Next image">
                            <i class="fa fa-chevron-right"></i>
                        </button>

                        <div class="image-counter">
                            <span class="current-image">1</span> / <span class="total-images">${totalImages}</span>
                        </div>
                    ` : ''}

                    <button class="card-action-button" type="button" data-product-id="${product.id}" aria-label="Add to cart">
                        <i class="fa fa-shopping-cart"></i>
                    </button>
                </div>

                <div class="product-card-info">
                    <h3 class="product-card-name">${product.name}</h3>
                    <div class="product-card-brand">${product.brand.name}</div>
                    <div class="product-card-price">$${product.price.toFixed(2)}</div>
                    <div class="product-card-year">Model Year: ${product.modelYear}</div>
                </div>
            </article>
        `;
    }

    // Initialize counters / currentIndex values after render
    setupCardInitialState() {
        const containers = this.productsGrid.querySelectorAll('.product-card-image');
        containers.forEach((container) => {
            const images = JSON.parse(container.dataset.images || '[]');
            container.dataset.currentIndex = '0';
            const currentSpan = container.querySelector('.current-image');
            const totalSpan = container.querySelector('.total-images');
            if (currentSpan) currentSpan.textContent = images.length > 0 ? '1' : '0';
            if (totalSpan) totalSpan.textContent = images.length;
        });
    }

    renderPagination() {
        if (!this.pagination) return;

        const totalPages = Math.max(1, Math.ceil(this.filteredProducts.length / this.perPage));
        this.pagination.innerHTML = '';

        const createButton = (label, page, disabled = false) => {
            const button = document.createElement('button');
            button.textContent = label;
            button.disabled = disabled;

            if (page === this.currentPage && !isNaN(page)) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                if (page === this.currentPage || disabled) return;
                this.currentPage = page;
                this.renderProducts();
                this.renderPagination();
            });

            return button;
        };

        // Previous button
        this.pagination.appendChild(
            createButton('‹', Math.max(1, this.currentPage - 1), this.currentPage === 1)
        );

        for (let page = 1; page <= totalPages; page++) {
            this.pagination.appendChild(createButton(page.toString(), page));
        }

        // Next button
        this.pagination.appendChild(
            createButton('›', Math.min(totalPages, this.currentPage + 1), this.currentPage === totalPages)
        );
    }

    updateResultsCount() {
        if (!this.resultsCount) return;

        const total = this.filteredProducts.length;
        const start = (this.currentPage - 1) * this.perPage + 1;
        const end = Math.min(start + this.perPage - 1, total);

        if (total === 0) {
            this.resultsCount.textContent = 'No results';
            return;
        }

        this.resultsCount.textContent = `Showing ${start}-${end} of ${total} products`;
    }

    /** ------------------------------------------------------------------
     *  🛒 REAL CART SYSTEM (LocalStorage)
     *  ------------------------------------------------------------------ */
    addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.image || '',
                quantity: 1,
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showToast(`${product.name} added to cart`);
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (this.cartCountElement) {
            this.cartCountElement.textContent = totalQuantity;
        }
    }

    showToast(message) {
        if (!this.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /** ------------------------------------------------------------------
     *  Mock Products
     *  ------------------------------------------------------------------ */
    getMockProducts() {
        return [
            {
                id: 'prd-001',
                name: 'Wireless Noise-Canceling Headphones',
                brand: { name: 'AudioTech' },
                price: 299.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-002',
                name: 'Portable Bluetooth Speaker Pro',
                brand: { name: 'SoundWave' },
                price: 189.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-003',
                name: 'Studio Monitor Headphones',
                brand: { name: 'Pulse' },
                price: 219.99,
                modelYear: 2023,
                images: [{ image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-004',
                name: 'Gaming Headset X-Force',
                brand: { name: 'NovaSound' },
                price: 149.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-005',
                name: 'Wireless Earbuds Elite',
                brand: { name: 'AudioTech' },
                price: 179.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-006',
                name: 'Smart Home Speaker Mini',
                brand: { name: 'SoundWave' },
                price: 129.99,
                modelYear: 2023,
                images: [{ image: 'https://images.unsplash.com/photo-1484708482671-9111ff987cc4?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-007',
                name: 'Portable DJ Headphones',
                brand: { name: 'Pulse' },
                price: 159.99,
                modelYear: 2022,
                images: [{ image: 'https://images.unsplash.com/photo-1466337105551-aa3ab789093c?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-008',
                name: '360° Surround Speaker',
                brand: { name: 'NovaSound' },
                price: 249.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-009',
                name: 'Wireless Sport Earbuds',
                brand: { name: 'AudioTech' },
                price: 139.99,
                modelYear: 2023,
                images: [{ image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-010',
                name: 'Smart Soundbar Premium',
                brand: { name: 'SoundWave' },
                price: 329.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-011',
                name: 'Classic Vinyl Headphones',
                brand: { name: 'Pulse' },
                price: 199.99,
                modelYear: 2021,
                images: [{ image: 'https://images.unsplash.com/photo-1614851099130-1c94251f2cfe?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-012',
                name: 'Immersive Gaming Soundbar',
                brand: { name: 'NovaSound' },
                price: 279.99,
                modelYear: 2024,
                images: [{ image: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?w=600&h=600&fit=crop' },
                    { image: 'https://images.unsplash.com/photo-1614851099130-1c94251f2cfe?w=600&h=600&fit=crop' }
                ],
            },
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CategoryPage();
});
