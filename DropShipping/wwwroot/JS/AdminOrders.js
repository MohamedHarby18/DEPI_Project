const API_ORDERS = "https://localhost:7000/api/order"; // your endpoint
const tbody = document.getElementById('tbody');
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('pagination');

const overlayView = document.getElementById('viewOverlay');
const overlayDelete = document.getElementById('deleteOverlay');

const viewName = document.getElementById('viewName');
const closeViewBtn = document.getElementById('closeView');

const deleteMsg = document.getElementById('deleteMsg');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');

let deleteId = null;
let currentPage = 1;
const pageSize = 10;
let allOrders = [];

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"'`=\/]/g, s => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;", "`": "&#x60;", "=": "&#x3D;"
    }[s]));
}

// Render single order row
function renderRow(order, index) {
    const productNames = order.Items?.length > 0
        ? order.Items.map(item => item.ProductName || "Unnamed").join(", ")
        : "No products";

    const shippedDate = order.ShippedDate ? new Date(order.ShippedDate).toLocaleDateString() : "Not shipped";

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${escapeHtml(productNames)}</td>
        <td>${escapeHtml(order.DropshipperName || "Unknown")}</td>
        <td>${escapeHtml(order.CustomerName || "Unknown")}</td>
        <td>${escapeHtml(order.CustomerAddress || "Unknown")}</td>
        <td>${order.OrderPrice?.toFixed(2) || "0.00"}</td>
        <td>${order.OrderDiscount?.toFixed(2) || "0.00"}</td>
        <td>${escapeHtml(order.OrderStatus || "Pending")}</td>
        <td>${shippedDate}</td>
        <td style="text-align:right">
            <button class="btn viewBtn" data-id="${order.Id}">👁️</button>
            <button class="btn editBtn" data-id="${order.Id}">✏️</button>
            <button class="btn delBtn" data-id="${order.Id}">🗑️</button>
        </td>
    `;
    return tr;
}

// Render table rows
function renderTable(orders) {
    tbody.innerHTML = '';
    if (!orders.length) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:gray;padding:20px;">No orders found.</td></tr>`;
        return;
    }
    orders.forEach((order, index) => tbody.appendChild(renderRow(order, index)));
    attachRowEvents();
}

// Attach row button events
function attachRowEvents() {
    tbody.querySelectorAll(".viewBtn").forEach(btn => {
        btn.addEventListener('click', () => openViewModal(btn.dataset.id));
    });
    tbody.querySelectorAll(".editBtn").forEach(btn => {
        btn.addEventListener('click', () => alert("Edit order: " + btn.dataset.id));
    });
    tbody.querySelectorAll(".delBtn").forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
}

// Fetch orders from API
async function fetchOrders(page = 1) {
    try {
        const res = await fetch(`${API_ORDERS}?page=${page}&pageSize=${pageSize}`);
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        allOrders = data.result || [];
        renderTable(allOrders);
        renderPagination(data.pageIndex, data.totalCount, data.pageSize);
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:red;padding:20px;">Failed to load orders.</td></tr>`;
    }
}

// Render pagination buttons
function renderPagination(pageIndex, totalCount, pageSize) {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(totalCount / pageSize);

    if (totalPages <= 1) return;

    const createButton = (text, page) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = page === pageIndex ? 'active btn-page' : 'btn-page';
        btn.addEventListener('click', () => {
            currentPage = page;
            fetchOrders(page);
        });
        return btn;
    };

    // Previous
    if (pageIndex > 1) paginationContainer.appendChild(createButton('⟨', pageIndex - 1));

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationContainer.appendChild(createButton(i, i));
    }

    // Next
    if (pageIndex < totalPages) paginationContainer.appendChild(createButton('⟩', pageIndex + 1));
}

// --- View Modal ---
function openViewModal(id) {
    const row = Array.from(tbody.children).find(tr => tr.querySelector(`[data-id="${id}"]`));
    if (!row) return;
    viewName.textContent = row.children[1].textContent;
    overlayView.classList.add('show');
}

// --- Delete Modal ---
function openDeleteModal(id) {
    deleteId = id;
    deleteMsg.textContent = 'Are you sure you want to delete this order?';
    overlayDelete.classList.add('show');
}

confirmDeleteBtn.addEventListener('click', async () => {
    if (!deleteId) return;
    try {
        const res = await fetch(`${API_ORDERS}/${deleteId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Failed to delete order");
        overlayDelete.classList.remove('show');
        deleteId = null;
        fetchOrders(currentPage);
    } catch (err) {
        console.error(err);
        alert('Failed to delete order.');
    }
});

// --- Close modals ---
[closeViewBtn, cancelDeleteBtn].forEach(btn => {
    btn.addEventListener('click', () => {
        overlayView.classList.remove('show');
        overlayDelete.classList.remove('show');
    });
});

// --- Click outside modal closes it ---
[overlayView, overlayDelete].forEach(ov =>
    ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('show'); })
);

// --- Search ---
searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    Array.from(tbody.children).forEach(tr => {
        const text = tr.children[1].textContent.toLowerCase();
        tr.style.display = text.includes(term) ? '' : 'none';
    });
});

// --- Initial fetch ---
fetchOrders(currentPage);
