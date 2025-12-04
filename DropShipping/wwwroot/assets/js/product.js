// Product Page JavaScript
class ProductPage {
    constructor() {
        this.currentProduct = null;
        this.relatedProducts = [];
        this.currentMainImageIndex = 0;
        this.productCardImages = new Map(); // Store current image index for each product card
        this.productCatalog = this.loadProductCatalog();
        this.init();
    }

    init() {
        this.loadProductData();
        this.setupEventListeners();
    }

    // Load product data
    async loadProductData() {
        try {
            const selectedProduct = this.loadSelectedProduct();
            if (selectedProduct) {
                this.currentProduct = selectedProduct;
                this.renderMainProduct();

                // Fetch related products from API
                await this.fetchRelatedProducts(selectedProduct.categoryId);
                return;
            }

            // Fallback if no product selected (e.g. direct link)
            this.showError('No product selected');
        } catch (error) {
            console.error('Error loading product data:', error);
            this.showError('Failed to load product data');
        }
    }

    async fetchRelatedProducts(categoryId) {
        try {
            // Update the "See More" button link
            const seeMoreBtn = document.getElementById('seeMoreBtn');
            if (seeMoreBtn && categoryId) {
                seeMoreBtn.href = `CategoryPage.html?categoryId=${categoryId}`;
            }

        return {
            mainProduct: {
                id: "550e8400-e29b-41d4-a716-446655440000",
                name: "Premium Wireless Headphones",
                description: "Experience crystal-clear audio with our premium wireless headphones featuring advanced noise cancellation, 30-hour battery life, and superior comfort. Perfect for music lovers and professionals alike.",
                categoryId: "550e8400-e29b-41d4-a716-446655440001",
                category: { name: "Audio Equipment" },
                brandId: "550e8400-e29b-41d4-a716-446655440002",
                brand: { name: "AudioTech" },
                price: 299.99,
                modelYear: 2024,
                images: [
                    { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
                    { image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop" }
                ]
            },
            relatedProducts: [
                {
                    id: "550e8400-e29b-41d4-a716-446655440003",
                    name: "Bluetooth Speaker Pro",
                    description: "Portable Bluetooth speaker with exceptional sound quality",
                    categoryId: "550e8400-e29b-41d4-a716-446655440001",
                    category: { name: "Audio Equipment" },
                    brandId: "550e8400-e29b-41d4-a716-446655440002",
                    brand: { name: "AudioTech" },
                    price: 149.99,
                    modelYear: 2024,
                    images: [
                        { image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop" }
                    ]
                },
                {
                    id: "550e8400-e29b-41d4-a716-446655440004",
                    name: "Studio Monitor Headphones",
                    description: "Professional studio monitor headphones for audio production",
                    categoryId: "550e8400-e29b-41d4-a716-446655440001",
                    category: { name: "Audio Equipment" },
                    brandId: "550e8400-e29b-41d4-a716-446655440002",
                    brand: { name: "AudioTech" },
                    price: 199.99,
                    modelYear: 2024,
                    images: [
                        { image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop" }
                    ]
                },
                {
                    id: "550e8400-e29b-41d4-a716-446655440005",
                    name: "Wireless Earbuds",
                    description: "True wireless earbuds with active noise cancellation",
                    categoryId: "550e8400-e29b-41d4-a716-446655440001",
                    category: { name: "Audio Equipment" },
                    brandId: "550e8400-e29b-41d4-a716-446655440002",
                    brand: { name: "AudioTech" },
                    price: 179.99,
                    modelYear: 2024,
                    images: [
                        { image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop" }
                    ]
                },
                {
                    id: "550e8400-e29b-41d4-a716-446655440006",
                    name: "Gaming Headset",
                    description: "High-performance gaming headset with surround sound",
                    categoryId: "550e8400-e29b-41d4-a716-446655440001",
                    category: { name: "Audio Equipment" },
                    brandId: "550e8400-e29b-41d4-a716-446655440002",
                    brand: { name: "AudioTech" },
                    price: 129.99,
                    modelYear: 2024,
                    images: [
                        { image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop" },
                        { image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop" }
                    ]
                }
            ]
        };
    }

    renderMainProduct() {
        if (!this.currentProduct) return;

        const product = this.currentProduct;

        // Update product information
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productBrand').textContent = product.brand.name;
        document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modelYear').textContent = product.modelYear;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productCategory').textContent = product.category.name;
        document.getElementById('productBrandName').textContent = product.brand.name;
        document.getElementById('productModelYear').textContent = product.modelYear;

        // Update main image
        const mainImage = document.getElementById('mainProductImage');
        if (product.images && product.images.length > 0) {
            this.currentMainImageIndex = 0;
            mainImage.src = product.images[0].image;
            mainImage.alt = product.name;
        }

        // Render thumbnails
        this.renderThumbnails(product.images);

        // Setup main gallery arrow events
        this.setupMainGalleryArrows();

        // Setup "See More" button to go to the category page
        try {
            const seeMoreBtn = document.getElementById('seeMoreBtn');
            if (seeMoreBtn) {
                if (product.categoryId) {
                    // Link to category page using categoryId
                    seeMoreBtn.href = `categorypage.html?categoryId=${encodeURIComponent(product.categoryId)}`;
                    seeMoreBtn.style.display = 'inline-flex';
                } else {
                    // If no categoryId is available hide the button
                    seeMoreBtn.href = '#';
                    seeMoreBtn.style.display = 'none';
                }
            }
        } catch (err) {
            console.error('Failed to setup See More button:', err);
        }
    }

    renderThumbnails(images) {
        const thumbnailContainer = document.getElementById('thumbnailImages');
        thumbnailContainer.innerHTML = '';

        if (!images || images.length === 0) return;

        // Initialize thumbnail navigation state
        this.currentThumbnailSet = 0;
        this.thumbnailsPerSet = 4;
        this.totalThumbnailSets = Math.ceil(images.length / this.thumbnailsPerSet);

        // Create thumbnail wrapper
        const thumbnailWrapper = document.createElement('div');
        thumbnailWrapper.className = 'thumbnail-wrapper';
        thumbnailContainer.appendChild(thumbnailWrapper);

        // Render current set of thumbnails
        this.renderCurrentThumbnailSet(images);
    }

    renderCurrentThumbnailSet(images) {
        const thumbnailWrapper = document.querySelector('.thumbnail-wrapper');

        // If this is the first render, create all thumbnails
        if (thumbnailWrapper.children.length === 0) {
            images.forEach((imageData, index) => {
                const img = document.createElement('img');
                img.src = imageData.image;
                img.alt = `Thumbnail ${index + 1}`;
                img.classList.add('thumbnail');
                img.dataset.index = index;

                if (index === this.currentMainImageIndex) {
                    img.classList.add('active');
                }

                img.addEventListener('click', () => {
                    this.switchMainImage(imageData.image);
                    this.setActiveThumbnail(img);
                    this.currentMainImageIndex = index;
                });

                thumbnailWrapper.appendChild(img);
            });
        } else {
            // Update active thumbnail
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach((thumb) => {
                const index = parseInt(thumb.dataset.index);
                thumb.classList.toggle('active', index === this.currentMainImageIndex);
            });
        }

        // Apply sliding effect
        this.applySlidingEffect();
    }

    applySlidingEffect() {
        const thumbnailWrapper = document.querySelector('.thumbnail-wrapper');
        const thumbnails = document.querySelectorAll('.thumbnail');

        if (thumbnails.length <= 4) {
            // If 4 or fewer images, show all and don't slide
            thumbnails.forEach((thumb) => {
                thumb.style.display = 'block';
            });
            return;
        }

        // Calculate which thumbnails should be visible
        // Show 4 images, sliding when main image reaches the last of current set
        let startIndex, endIndex;

        // Calculate the current set based on main image position
        const currentSet = Math.floor(this.currentMainImageIndex / 4);
        startIndex = currentSet * 4;
        endIndex = Math.min(startIndex + 3, thumbnails.length - 1);

        // Show/hide thumbnails based on calculated range
        thumbnails.forEach((thumb, index) => {
            if (index >= startIndex && index <= endIndex) {
                thumb.style.display = 'block';
                thumb.style.order = index - startIndex;
            } else {
                thumb.style.display = 'none';
            }
        });
    }


    switchMainImage(imageSrc) {
        const mainImage = document.getElementById('mainProductImage');
        mainImage.src = imageSrc;
    }

    setActiveThumbnail(activeImg) {
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnail').forEach(img => {
            img.classList.remove('active');
        });

        // Add active class to clicked thumbnail
        activeImg.classList.add('active');
    }

    // Main Gallery Arrow Functions
    setupMainGalleryArrows() {
        const prevArrow = document.getElementById('mainPrevArrow');
        const nextArrow = document.getElementById('mainNextArrow');

        if (!this.currentProduct || !this.currentProduct.images || this.currentProduct.images.length <= 1) {
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            return;
        }

        prevArrow.style.display = 'flex';
        nextArrow.style.display = 'flex';

        prevArrow.addEventListener('click', () => {
            this.navigateMainImage(-1);
        });

        nextArrow.addEventListener('click', () => {
            this.navigateMainImage(1);
        });
    }

    navigateMainImage(direction) {
        if (!this.currentProduct || !this.currentProduct.images) return;

        const totalImages = this.currentProduct.images.length;
        this.currentMainImageIndex = (this.currentMainImageIndex + direction + totalImages) % totalImages;

        const newImageSrc = this.currentProduct.images[this.currentMainImageIndex].image;
        this.switchMainImage(newImageSrc);

        // Update thumbnails with sliding effect
        this.renderCurrentThumbnailSet(this.currentProduct.images);
    }

    renderRelatedProducts() {
        const grid = document.getElementById('relatedProductsGrid');
        grid.innerHTML = '';

        if (!this.relatedProducts || this.relatedProducts.length === 0) {
            grid.innerHTML = '<div class="loading">No related products found</div>';
            return;
        }

        this.relatedProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Initialize image index for this product
        this.productCardImages.set(product.id, 0);

        const imageSrc = product.images && product.images.length > 0
            ? product.images[0].image
            : 'https://via.placeholder.com/300x200?text=No+Image';

        // Check if product has more than 5 images to show slider
        const hasManyImages = product.images && product.images.length;
        const showSlider = hasManyImages;

        card.innerHTML = `
            <div class="product-card-image">
                <img src="${imageSrc}" alt="${product.name}" />
                <button class="card-action-button" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                ${product.images && product.images.length > 1 ? `
                    <button class="card-arrow card-arrow-left" data-product-id="${product.id}" data-direction="-1">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="card-arrow card-arrow-right" data-product-id="${product.id}" data-direction="1">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                ` : ''}
                ${showSlider ? `
                    <div class="image-counter">
                        <span class="current-image">1</span> / <span class="total-images">${product.images.length}</span>
                    </div>
                ` : ''}
            </div>
            <div class="product-card-info">
                <h3 class="product-card-name">${product.name}</h3>
                <div class="product-card-brand">${product.brand.name}</div>
                <div class="product-card-price">$${product.price.toFixed(2)}</div>
                <div class="product-card-year">Model Year: ${product.modelYear}</div>
            </div>
        `;

        // Setup arrow events for this card
        this.setupCardArrows(card, product);

        // Setup action button event for this card
        this.setupCardActionButton(card, product);

        // Setup click to view product
        card.addEventListener('click', (e) => {
            // Prevent if clicked on buttons
            if (e.target.closest('button')) return;
            this.viewProduct(product.id);
        });

        return card;
    }

    setupCardArrows(card, product) {
        if (!product.images || product.images.length <= 1) return;

        const leftArrow = card.querySelector('.card-arrow-left');
        const rightArrow = card.querySelector('.card-arrow-right');
        const cardImage = card.querySelector('.product-card-image img');

        if (leftArrow) {
            leftArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateCardImage(product.id, -1, cardImage);
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateCardImage(product.id, 1, cardImage);
            });
        }
    }

    navigateCardImage(productId, direction, imageElement) {
        const product = this.relatedProducts.find(p => p.id === productId);
        if (!product || !product.images) return;

        const currentIndex = this.productCardImages.get(productId) || 0;
        const totalImages = product.images.length;
        const newIndex = (currentIndex + direction + totalImages) % totalImages;

        this.productCardImages.set(productId, newIndex);
        imageElement.src = product.images[newIndex].image;

        // Update image counter if it exists
        const card = imageElement.closest('.product-card');
        const currentImageSpan = card?.querySelector('.current-image');
        if (currentImageSpan) {
            currentImageSpan.textContent = newIndex + 1;
        }
    }

    setupCardActionButton(card, product) {
        const actionButton = card.querySelector('.card-action-button');
        if (!actionButton) return;

        actionButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleCardAction(product.id, actionButton);
        });
    }

    toggleCardAction(productId, buttonElement) {
        // Add to cart functionality
        const product = this.relatedProducts.find(p => p.id === productId);
        if (!product) return;

        // Add visual feedback
        buttonElement.classList.add('active');

        // Load existing cart items
        const cartItems = this.loadCartItems();

        // Check if product already exists in cart
        const existingItem = cartItems.find((item) => item.id === product.id);

        if (existingItem) {
            // Increment quantity if already in cart
            existingItem.quantity += 1;
        } else {
            // Add new item to cart
            cartItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0]?.image || '',
                quantity: 1,
            });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update cart count in navbar
        this.updateCartCount();

        // Show success message
        this.showMessage(`${product.name} added to cart!`, 'success');

        // Log for debugging
        console.log('Added to cart:', product.name);

        // Remove active state after animation
        setTimeout(() => {
            buttonElement.classList.remove('active');
        }, 1000);
    }


    viewProduct(productId) {
        const product = this.relatedProducts.find((item) => item.id === productId);
        if (!product) return;

        // Save selected product to localStorage
        localStorage.setItem('selectedProduct', JSON.stringify(product));

        // Reload the page to show the new product
        window.location.href = 'productpage.html';
    }

    setupEventListeners() {
        // Add to cart button
        document.getElementById('addToCart').addEventListener('click', () => {
            this.addToCart();
        });

        // Download images button
        document.getElementById('downloadImages').addEventListener('click', () => {
            this.downloadImages();
        });
    }

    addToCart() {
        if (!this.currentProduct) return;

        // Load existing cart items
        const cartItems = this.loadCartItems();

        // Check if product already exists in cart
        const existingItem = cartItems.find((item) => item.id === this.currentProduct.id);

        if (existingItem) {
            // Increment quantity if already in cart
            existingItem.quantity += 1;
        } else {
            // Add new item to cart
            cartItems.push({
                id: this.currentProduct.id,
                name: this.currentProduct.name,
                price: this.currentProduct.price,
                image: this.currentProduct.images?.[0]?.image || '',
                quantity: 1,
            });
        }

        // Save updated cart to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        // Update cart count in navbar
        this.updateCartCount();

        // Show success message
        this.showMessage(`${this.currentProduct.name} added to cart!`, 'success');

        console.log('Product added to cart:', this.currentProduct.name);
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

    updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        if (!cartCountElement) return;

        const cartItems = this.loadCartItems();
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = count;
    }

    async downloadImages() {
        if (!this.currentProduct || !this.currentProduct.images) {
            this.showMessage('No images available to download', 'error');
            return;
        }

        try {
            // Show loading message
            this.showMessage('Preparing images for download...', 'info');

            const productName = this.currentProduct.name.replace(/[^a-zA-Z0-9]/g, '_');
            const images = this.currentProduct.images;

            console.log('Starting download process for:', productName, 'with', images.length, 'images');

            // Check if JSZip is available
            if (typeof JSZip === 'undefined') {
                throw new Error('JSZip library not loaded');
            }

            // Create ZIP file
            const zip = new JSZip();
            const folder = zip.folder(`${productName}_images`);

            let successCount = 0;

            // Add each image to the ZIP
            for (let i = 0; i < images.length; i++) {
                const imageUrl = images[i].image;
                const fileName = `image_${i + 1}.jpg`;

                try {
                    console.log(`Fetching image ${i + 1}:`, imageUrl);
                    const response = await fetch(imageUrl);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const blob = await response.blob();
                    folder.file(fileName, blob);
                    successCount++;
                    console.log(`Successfully added image ${i + 1} to ZIP`);

                } catch (error) {
                    console.error(`Error fetching image ${i + 1}:`, error);
                }
            }

            if (successCount === 0) {
                throw new Error('No images could be downloaded');
            }

            console.log(`Successfully processed ${successCount} out of ${images.length} images`);

            // Generate ZIP file
            this.showMessage('Creating ZIP file...', 'info');
            const zipBlob = await zip.generateAsync({ type: 'blob' });

            console.log('ZIP file created successfully, size:', zipBlob.size, 'bytes');

            // Try to use File System Access API for location selection
            await this.downloadWithLocationChoice(zipBlob, `${productName}_images.zip`);

        } catch (error) {
            console.error('Error in downloadImages:', error);
            this.showMessage(`Failed to download images: ${error.message}`, 'error');
        }
    }

    async downloadWithLocationChoice(blob, filename) {
        try {
            console.log('Attempting to download file:', filename, 'size:', blob.size);

            // Check if File System Access API is supported
            if ('showSaveFilePicker' in window) {
                console.log('Using File System Access API');
                try {
                    // Use File System Access API to let user choose location
                    const fileHandle = await window.showSaveFilePicker({
                        suggestedName: filename,
                        types: [{
                            description: 'ZIP files',
                            accept: {
                                'application/zip': ['.zip']
                            }
                        }]
                    });

                    // Write the file
                    const writable = await fileHandle.createWritable();
                    await writable.write(blob);
                    await writable.close();

                    console.log('File saved successfully using File System Access API');
                    this.showMessage(`ZIP file saved successfully!`, 'success');

                } catch (error) {
                    if (error.name === 'AbortError') {
                        console.log('User cancelled the download');
                        this.showMessage('Download cancelled by user', 'info');
                    } else {
                        console.error('Error with File System Access API:', error);
                        // Fallback to traditional download
                        this.fallbackDownload(blob, filename);
                    }
                }
            } else {
                console.log('File System Access API not supported, using fallback');
                // Fallback for browsers that don't support File System Access API
                this.fallbackDownload(blob, filename);
            }
        } catch (error) {
            console.error('Error in downloadWithLocationChoice:', error);
            this.showMessage(`Download failed: ${error.message}`, 'error');
        }
    }

    fallbackDownload(blob, filename) {
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;

        // Add the link to the document temporarily
        document.body.appendChild(link);

        // Trigger the download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        this.showMessage(`ZIP file "${filename}" is being downloaded to your default download folder!`, 'success');
    }

    loadSelectedProduct() {
        try {
            const stored = localStorage.getItem('selectedProduct');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Failed to parse selected product', error);
            return null;
        }
    }

    loadProductCatalog() {
        try {
            const stored = localStorage.getItem('productCatalog');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to parse product catalog', error);
            return [];
        }
    }

    showMessage(message, type = 'info') {
        // Create and show a temporary message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#61CE70' : '#6EC1E4'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }
}

// Initialize the product page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);