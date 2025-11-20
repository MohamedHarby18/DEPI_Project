class CategoryPage {
    constructor() {
        this.products = this.getMockProducts();
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.perPage = 9;
        this.activeBrands = new Set();
        this.cartItems = this.loadCartItems();

        this.productsGrid = document.getElementById('categoryProducts');
        this.pagination = document.getElementById('pagination');
        this.brandFiltersContainer = document.getElementById('brandFilters');
        this.resultsCount = document.getElementById('resultsCount');
        this.clearFiltersBtn = document.getElementById('clearFilters');
        this.cartCountElement = document.getElementById('cartCount');
        this.toastContainer = document.getElementById('toastContainer');

        this.persistProductCatalog();
        this.init();
    }

    init() {
        if (!this.productsGrid) return;
        this.renderBrandFilters();
        this.attachEvents();
        this.renderProducts();
        this.renderPagination();
        this.updateResultsCount();
        this.updateCartCount();
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

        if (this.productsGrid) {
            this.productsGrid.addEventListener('click', (event) => {
                const button = event.target.closest('.card-action-button');
                if (button) {
                    event.stopPropagation();
                    const productId = button.dataset.productId;
                    const product = this.products.find((item) => item.id === productId);
                    if (!product) return;
                    this.addToCart(product);
                    return;
                }

                const card = event.target.closest('.product-card');
                if (!card) return;

                const productId = card.dataset.productId;
                this.viewProduct(productId);
            });
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
    }

    createProductCard(product) {
        const imageSrc =
            product.images && product.images.length > 0
                ? product.images[0].image
                : 'https://via.placeholder.com/320x240?text=No+Image';

        return `
            <article class="product-card" data-product-id="${product.id}">
                <div class="product-card-image">
                    <img src="${imageSrc}" alt="${product.name}">
                    <button class="card-action-button" type="button" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
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

    addToCart(product) {
        const existing = this.cartItems.find((item) => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.image || '',
                quantity: 1,
            });
        }

        this.persistCartItems();
        this.updateCartCount();
        this.showToast(`${product.name} added to cart`);
    }

    viewProduct(productId) {
        const product = this.products.find((item) => item.id === productId);
        if (!product) return;

        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'productpage.html';
    }

    loadCartItems() {
        try {
            const stored = localStorage.getItem('cartItems');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load cart items', error);
            return [];
        }
    }

    persistCartItems() {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    persistProductCatalog() {
        localStorage.setItem('productCatalog', JSON.stringify(this.products));
    }

    updateCartCount() {
        if (!this.cartCountElement) return;
        const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        this.cartCountElement.textContent = count;
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

    getMockProducts() {
        return [
            {
                id: 'prd-001',
                name: 'Wireless Noise-Canceling Headphones',
                brand: { name: 'AudioTech' },
                price: 299.99,
                modelYear: 2024,
                category: { name: 'Audio Equipment' },
                description: 'Experience immersive sound with adaptive noise cancelation and 30-hour battery life.',
                images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-002',
                name: 'Portable Bluetooth Speaker Pro',
                brand: { name: 'SoundWave' },
                price: 189.99,
                modelYear: 2024,
                category: { name: 'Audio Equipment' },
                description: 'Compact yet powerful speaker with 360° audio and splash resistance.',
                images: [{ image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-003',
                name: 'Studio Monitor Headphones',
                brand: { name: 'Pulse' },
                price: 219.99,
                modelYear: 2023,
                category: { name: 'Audio Equipment' },
                description: 'Balanced studio monitors designed for mixing and long sessions.',
                images: [{ image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop' },
                    { image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop' }
                ],
            },
            {
                id: 'prd-004',
                name: 'Gaming Headset X-Force',
                brand: { name: 'NovaSound' },
                price: 149.99,
                modelYear: 2024,
                category: { name: 'Gaming' },
                description: 'Surround-sound gaming headset with noise-canceling mic.',
                images: [{ image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-005',
                name: 'Wireless Earbuds Elite',
                brand: { name: 'AudioTech' },
                price: 179.99,
                modelYear: 2024,
                category: { name: 'Audio Equipment' },
                description: 'True wireless earbuds with ANC and wireless charging case.',
                images: [{ image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-006',
                name: 'Smart Home Speaker Mini',
                brand: { name: 'SoundWave' },
                price: 129.99,
                modelYear: 2023,
                category: { name: 'Smart Home' },
                description: 'Voice assistant speaker with room-filling sound.',
                images: [{ image: 'https://images.unsplash.com/photo-1484708482671-9111ff987cc4?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-007',
                name: 'Portable DJ Headphones',
                brand: { name: 'Pulse' },
                price: 159.99,
                modelYear: 2022,
                category: { name: 'Audio Equipment' },
                description: 'Foldable DJ headphones with rotating cups and deep bass.',
                images: [{ image: 'https://images.unsplash.com/photo-1466337105551-aa3ab789093c?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-008',
                name: '360° Surround Speaker',
                brand: { name: 'NovaSound' },
                price: 249.99,
                modelYear: 2024,
                category: { name: 'Smart Home' },
                description: 'Premium surround speaker with adaptive EQ.',
                images: [{ image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-009',
                name: 'Wireless Sport Earbuds',
                brand: { name: 'AudioTech' },
                price: 139.99,
                modelYear: 2023,
                category: { name: 'Audio Equipment' },
                description: 'Sweat-resistant earbuds with secure fit for workouts.',
                images: [{ image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-010',
                name: 'Smart Soundbar Premium',
                brand: { name: 'SoundWave' },
                price: 329.99,
                modelYear: 2024,
                category: { name: 'Home Theater' },
                description: 'Dolby Atmos soundbar with wireless subwoofer.',
                images: [{ image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-011',
                name: 'Classic Vinyl Headphones',
                brand: { name: 'Pulse' },
                price: 199.99,
                modelYear: 2021,
                category: { name: 'Audio Equipment' },
                description: 'Retro-inspired headphones with warm analog tuning.',
                images: [{ image: 'https://images.unsplash.com/photo-1614851099130-1c94251f2cfe?w=600&h=600&fit=crop' }],
            },
            {
                id: 'prd-012',
                name: 'Immersive Gaming Soundbar',
                brand: { name: 'NovaSound' },
                price: 279.99,
                modelYear: 2024,
                category: { name: 'Gaming' },
                description: 'RGB-enabled gaming soundbar with virtual surround.',
                images: [{ image: 'https://images.unsplash.com/photo-1472437774355-71ab6752b434?w=600&h=600&fit=crop' }],
            },
        ];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CategoryPage();
});

