// Navigation Categories Loader
class NavigationCategories {
    constructor() {
        this.apiBaseUrl = '/api/Category';
        this.dropdownMenu = null;
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadCategories());
        } else {
            await this.loadCategories();
        }
    }

    async loadCategories() {
        try {
            // Find the dropdown menu in the navigation
            this.dropdownMenu = document.querySelector('.dropdown-menu');

            if (!this.dropdownMenu) {
                console.warn('Dropdown menu not found in navigation');
                return;
            }

            // Fetch categories from API (include auth token if present)
            const response = await fetch(this.apiBaseUrl, { headers: getAuthHeaders() });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const categories = await response.json();

            // Populate dropdown with categories
            this.populateDropdown(categories);

            console.log('Loaded categories:', categories.length);

        } catch (error) {
            console.error('Error loading categories:', error);
            // Keep the existing hardcoded categories if API fails
        }
    }

    populateDropdown(categories) {
        if (!categories || categories.length === 0) {
            console.warn('No categories received from API');
            return;
        }

        // Clear existing items
        this.dropdownMenu.innerHTML = '';

        // Add each category as a menu item
        categories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            // Set the link to category page with category ID
            a.href = `categorypage.html?categoryId=${category.id}`;
            a.textContent = category.name;

            li.appendChild(a);
            this.dropdownMenu.appendChild(li);
        });
    }
}

// Initialize navigation categories loader
new NavigationCategories();
