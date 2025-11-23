// API endpoints
const API_BASE = 'https://localhost:7000/api/Products';
const CAT_API = 'https://localhost:7000/api/Category';
const BRAND_API = 'https://localhost:7000/api/Brands';
const ORDERS_API = 'https://localhost:7000/orders';

// Global variables
let products = [];
let categories = [];
let brands = [];
let orders = [];
let filteredProducts = [];
let filteredCategories = [];
let filteredBrands = [];
let filteredOrders = [];

// DOM Elements
const productsCount = document.getElementById('products-count');
const categoriesCount = document.getElementById('categories-count');
const brandsCount = document.getElementById('brands-count');
const ordersCount = document.getElementById('orders-count');

// Charts
let salesChart, productChart;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCategories();
    loadBrands();
    loadOrders();
    setupTabs();
    setupEventListeners();
    initializeCharts();
});

// Setup tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.getElementById('categories-tab').style.display = 'none';
            document.getElementById('brands-tab').style.display = 'none';

            const tabName = tab.getAttribute('data-tab');
            document.getElementById(`${tabName}-tab`).style.display = 'block';
        });
    });
}

// Event listeners
function setupEventListeners() {
    // Search inputs
    document.getElementById('product-search').addEventListener('input', filterProducts);
    document.getElementById('category-search').addEventListener('input', filterCategories);
    document.getElementById('brand-search').addEventListener('input', filterBrands);
    document.getElementById('order-search').addEventListener('input', filterOrders);

    // Sorting & filtering
    document.getElementById('product-sort').addEventListener('change', sortProducts);
    document.getElementById('order-status-filter').addEventListener('change', filterOrdersByStatus);

    // Modals
    document.getElementById('add-product-btn')?.addEventListener('click', () => openModal('product-modal'));
    document.getElementById('add-category-btn')?.addEventListener('click', () => openModal('category-modal'));
    document.getElementById('add-brand-btn')?.addEventListener('click', () => openModal('brand-modal'));

    document.querySelectorAll('.close').forEach(btn => btn.addEventListener('click', closeModals));
    document.getElementById('cancel-product').addEventListener('click', closeModals);
    document.getElementById('save-product').addEventListener('click', saveProduct);

    document.getElementById('chart-period').addEventListener('change', updateCharts);

    // Refresh on card click
    document.getElementById('products-card').addEventListener('click', () => loadProducts(true));
    document.getElementById('categories-card').addEventListener('click', () => loadCategories(true));
    document.getElementById('brands-card').addEventListener('click', () => loadBrands(true));
    document.getElementById('orders-card').addEventListener('click', () => loadOrders(true));
}

// Initialize charts
function initializeCharts() {
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Sales',
                data: [12000, 19000, 15000, 25000, 22000, 30000],
                borderColor: '#4361ee',
                backgroundColor: 'rgba(67, 97, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { drawBorder: false } },
                x: { grid: { display: false } }
            }
        }
    });

    const productCtx = document.getElementById('productChart').getContext('2d');
    productChart = new Chart(productCtx, {
        type: 'doughnut',
        data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#ccc'], borderWidth: 0 }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

// Update product chart
function updateProductChart() {
    if (!productChart) return;

    const categoryCounts = {};
    filteredProducts.forEach(p => {
        const catName = p.categoryName || (p.category?.name) || 'Unknown';
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    });

    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#ffba08', '#8ac926', '#1982c4', '#6a4c93'];

    productChart.data.labels = labels.length ? labels : ['No Data'];
    productChart.data.datasets[0].data = data.length ? data : [1];
    productChart.data.datasets[0].backgroundColor = colors.slice(0, labels.length || 1);
    productChart.update();
}

// Update charts on period change
function updateCharts() {
    const period = document.getElementById('chart-period').value;
    showNotification('Charts updated for ' + period, 'success');
    updateProductChart();
}

// Load Products
async function loadProducts(showNotif = false) {
    const loading = document.getElementById('products-loading');
    const table = document.getElementById('products-table');
    const empty = document.getElementById('products-empty');
    try {
        loading.style.display = 'flex';
        table.style.display = 'none';
        empty.style.display = 'none';

        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();

        products = data.result || [];
        filteredProducts = [...products];
        productsCount.textContent = data.totalCount || products.length;

        renderProducts();
        updateProductChart();

        loading.style.display = 'none';
        table.style.display = products.length ? 'table' : 'none';
        empty.style.display = products.length ? 'none' : 'block';
        if (showNotif) showNotification('Products refreshed successfully', 'success');
    } catch (err) {
        console.error('Products error', err);
        loading.style.display = 'none';
        empty.style.display = 'block';
        showNotification('Failed to load products', 'error');
    }
}

// Load Categories
async function loadCategories(showNotif = false) {
    const loading = document.getElementById('categories-loading');
    const table = document.getElementById('categories-table');
    const empty = document.getElementById('categories-empty');
    try {
        loading.style.display = 'flex';
        table.style.display = 'none';
        empty.style.display = 'none';

        const res = await fetch(CAT_API);
        if (!res.ok) throw new Error(res.statusText);
        categories = await res.json();

        filteredCategories = [...categories];
        categoriesCount.textContent = categories.length;

        renderCategories();

        loading.style.display = 'none';
        table.style.display = categories.length ? 'table' : 'none';
        empty.style.display = categories.length ? 'none' : 'block';
        if (showNotif) showNotification('Categories refreshed successfully', 'success');
    } catch (err) {
        console.error('Categories error', err);
        loading.style.display = 'none';
        empty.style.display = 'block';
        showNotification('Failed to load categories', 'error');
    }
}

// Load Brands
async function loadBrands(showNotif = false) {
    const loading = document.getElementById('brands-loading');
    const table = document.getElementById('brands-table');
    const empty = document.getElementById('brands-empty');
    try {
        loading.style.display = 'flex';
        table.style.display = 'none';
        empty.style.display = 'none';

        const res = await fetch(BRAND_API);
        if (!res.ok) throw new Error(res.statusText);
        brands = await res.json();

        filteredBrands = [...brands];
        brandsCount.textContent = brands.length;

        renderBrands();

        loading.style.display = 'none';
        table.style.display = brands.length ? 'table' : 'none';
        empty.style.display = brands.length ? 'none' : 'block';
        if (showNotif) showNotification('Brands refreshed successfully', 'success');
    } catch (err) {
        console.error('Brands error', err);
        loading.style.display = 'none';
        empty.style.display = 'block';
        showNotification('Failed to load brands', 'error');
    }
}

// Load Orders (mock)
async function loadOrders(showNotif = false) {
    const loading = document.getElementById('orders-loading');
    const table = document.getElementById('orders-table');
    const empty = document.getElementById('orders-empty');
    try {
        loading.style.display = 'flex';
        table.style.display = 'none';
        empty.style.display = 'none';

        await new Promise(r => setTimeout(r, 1500));

        orders = [
            { id: "1", shippedDate: "2023-05-15", orderPrice: 1250.5, orderDiscount: 50, orderStatus: "Shipped", dropshipperId: "DS001", dropshipperName: "Global Dropshippers", items: [{ productName: "iPhone 14", quantity: 2, price: 600 }, { productName: "AirPods", quantity: 1, price: 150.5 }] },
            { id: "2", shippedDate: null, orderPrice: 850.75, orderDiscount: 25, orderStatus: "Processing", dropshipperId: "DS002", dropshipperName: "Quick Ship Inc", items: [{ productName: "Samsung TV", quantity: 1, price: 850.75 }] },
            { id: "3", shippedDate: "2023-05-10", orderPrice: 320, orderDiscount: 10, orderStatus: "Delivered", dropshipperId: "DS003", dropshipperName: "Tech Distributors", items: [{ productName: "Wireless Mouse", quantity: 5, price: 64 }] }
        ];

        filteredOrders = [...orders];
        ordersCount.textContent = orders.length;

        renderOrders();

        loading.style.display = 'none';
        table.style.display = orders.length ? 'table' : 'none';
        empty.style.display = orders.length ? 'none' : 'block';
        if (showNotif) showNotification('Orders refreshed successfully', 'success');
    } catch (err) {
        console.error('Orders error', err);
        loading.style.display = 'none';
        empty.style.display = 'block';
        showNotification('Failed to load orders', 'error');
    }
}

// Render functions
function renderProducts() {
    const tbody = document.getElementById('products-body');
    tbody.innerHTML = '';
    if (!filteredProducts.length) return;
    filteredProducts.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id.substring(0, 8)}...</td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${p.categoryName || p.category?.name || 'N/A'}</td>
            <td>${p.brandName || p.brand?.name || 'N/A'}</td>
            <td class="actions">
                <button class="btn btn-outline"><i class="fas fa-edit"></i></button>
                <button class="btn btn-outline"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderCategories() {
    const tbody = document.getElementById('categories-body');
    tbody.innerHTML = '';
    if (!filteredCategories.length) return;
    filteredCategories.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.id.substring(0, 8)}...</td>
            <td>${c.name}</td>
            <td class="actions">
                <button class="btn btn-outline"><i class="fas fa-edit"></i></button>
                <button class="btn btn-outline"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderBrands() {
    const tbody = document.getElementById('brands-body');
    tbody.innerHTML = '';
    if (!filteredBrands.length) return;
    filteredBrands.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${b.id.substring(0, 8)}...</td>
            <td>${b.name}</td>
            <td class="actions">
                <button class="btn btn-outline"><i class="fas fa-edit"></i></button>
                <button class="btn btn-outline"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderOrders() {
    const tbody = document.getElementById('orders-body');
    tbody.innerHTML = '';
    if (!filteredOrders.length) return;
    filteredOrders.forEach(order => {
        let statusClass = '';
        if (order.orderStatus === 'Delivered') statusClass = 'badge-success';
        else if (order.orderStatus === 'Processing') statusClass = 'badge-warning';
        else if (order.orderStatus === 'Shipped') statusClass = 'badge-info';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${order.dropshipperName}</td>
            <td>$${order.orderPrice.toFixed(2)}</td>
            <td>$${order.orderDiscount.toFixed(2)}</td>
            <td><span class="badge ${statusClass}">${order.orderStatus}</span></td>
            <td>${order.shippedDate || 'Not shipped'}</td>
            <td class="actions">
                <button class="btn btn-outline"><i class="fas fa-eye"></i></button>
                <button class="btn btn-outline"><i class="fas fa-edit"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Filters
function filterProducts() {
    const term = document.getElementById('product-search').value.toLowerCase();
    filteredProducts = products.filter(p => p.name.toLowerCase().includes(term));
    renderProducts();
    updateProductChart();
}

function filterCategories() {
    const term = document.getElementById('category-search').value.toLowerCase();
    filteredCategories = categories.filter(c => c.name.toLowerCase().includes(term));
    renderCategories();
}

function filterBrands() {
    const term = document.getElementById('brand-search').value.toLowerCase();
    filteredBrands = brands.filter(b => b.name.toLowerCase().includes(term));
    renderBrands();
}

function filterOrders() {
    const term = document.getElementById('order-search').value.toLowerCase();
    filteredOrders = orders.filter(o =>
        o.dropshipperName.toLowerCase().includes(term) || o.id.toString().includes(term)
    );
    renderOrders();
}

function filterOrdersByStatus() {
    const status = document.getElementById('order-status-filter').value;
    filteredOrders = status === 'all' ? [...orders] : orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
    renderOrders();
}

function sortProducts() {
    const sortBy = document.getElementById('product-sort').value;
    if (sortBy === 'name') filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'date') filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    renderProducts();
}

// Modals
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModals() { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); }

// Save Product (demo)
function saveProduct() {
    showNotification('Product added successfully', 'success');
    closeModals();
    document.getElementById('product-form').reset();
}

// Notifications
function showNotification(msg, type) {
    const notification = document.getElementById('notification');
    document.getElementById('notification-message').textContent = msg;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 3000);
}
