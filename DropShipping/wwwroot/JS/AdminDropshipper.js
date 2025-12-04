/** ============================
 *  CONFIG
 * ============================ */
const API_BASE = "https://localhost:7000/api/Dropshipper";

/** ============================
 *  DOM References
 * ============================ */
const tbody = document.querySelector("#tbody");

const overlayAddEdit = document.querySelector("#modalOverlay");
const overlayView = document.querySelector("#viewOverlay");
const overlayDelete = document.querySelector("#deleteOverlay");

const modalTitle = document.querySelector("#modalTitle");
const modalForm = document.querySelector("#modalForm");

const customerIdInput = document.querySelector("#productId"); // hidden input
const userNameInput = document.querySelector("#userName");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phoneNumber");
const passwordInput = document.querySelector("#password");

const streetInput = document.querySelector("#street");
const cityInput = document.querySelector("#city");
const countryInput = document.querySelector("#country");

const cancelModalBtn = document.querySelector("#cancelModal");
const cancelDeleteBtn = document.querySelector("#cancelDelete");
const confirmDeleteBtn = document.querySelector("#confirmDelete");

let editId = null;
let deleteId = null;

/** ============================
 *  UTILS
 * ============================ */
const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"'`=/]/g, s => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "/": "&#x2F;"
    }[s]));

/** ============================
 *  RENDER ROWS
 * ============================ */
function renderRow(d) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${escapeHtml(d.name)}</td>
        <td>${escapeHtml(d.email)}</td>
        <td>${escapeHtml(d.phone)}</td>
        <td>${escapeHtml(d.address)}</td>
        <td style="text-align:right">
            <button class="btn viewBtn" data-id="${d.id}">👁</button>
            <button class="btn editBtn" data-id="${d.id}">✏️</button>
            <button class="btn delBtn" data-id="${d.id}">🗑️</button>
        </td>
    `;
    return tr;
}

function renderTable(list) {
    tbody.innerHTML = "";

    if (!list.length) {
        tbody.innerHTML = `
            <tr>
              <td colspan="5" style="text-align:center;color:gray;padding:20px">
                No dropshippers found
              </td>
            </tr>`;
        return;
    }

    list.forEach(item => tbody.appendChild(renderRow(item)));
    attachRowEvents();
}

/** ============================
 *  SEARCH
 * ============================ */
let globalData = [];

function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function filterData(keyword) {
    keyword = keyword.toLowerCase();

    const filtered = globalData.filter(x =>
        x.name.toLowerCase().includes(keyword) ||
        x.email.toLowerCase().includes(keyword) ||
        x.phone.toLowerCase().includes(keyword) ||
        x.address.toLowerCase().includes(keyword)
    );

    renderTable(filtered);
}

const searchInput = document.querySelector("#searchInput");
const handleSearch = debounce(() => {
    filterData(searchInput.value.trim());
}, 300);

if (searchInput) searchInput.addEventListener("input", handleSearch);

/** ============================
 *  FETCH & LOAD
 * ============================ */
async function fetchAndRender() {
    try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error("Failed to load dropshippers");

        const json = await res.json();

        globalData = json.map(x => ({
            id: x.id,
            name: x.userName,
            email: x.email,
            phone: x.phoneNumber,
            address: `${x.address?.street ?? ""}, ${x.address?.city ?? ""}, ${x.address?.country ?? ""}`
        }));

        renderTable(globalData);

    } catch (err) {
        console.error(err);
        renderTable([]);
    }
}

/** ============================
 *  MODAL HANDLING
 * ============================ */
function openAddModal() {
    modalTitle.textContent = "Add Dropshipper";
    modalForm.reset();
    editId = null;
    overlayAddEdit.style.display = "flex";
}

async function openEditModal(id) {
    try {
        modalTitle.textContent = "Edit Dropshipper";
        editId = id;
        overlayAddEdit.style.display = "flex";

        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error();

        const d = await res.json();

        customerIdInput.value = d.id;
        userNameInput.value = d.userName;
        emailInput.value = d.email;
        phoneInput.value = d.phoneNumber;
        passwordInput.value = d.password ?? "";

        streetInput.value = d.address?.street ?? "";
        cityInput.value = d.address?.city ?? "";
        countryInput.value = d.address?.country ?? "";

    } catch {
        alert("Failed to load dropshipper");
    }
}

async function openViewModal(id) {
    try {
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error();

        const d = await res.json();

        document.getElementById("viewTitle").textContent = "Dropshipper Details";
        document.getElementById("viewName").textContent = "Name: " + (d.userName ?? "");
        document.getElementById("viewDescription").textContent = "Email: " + (d.email ?? "");
        document.getElementById("viewPrice").textContent = "Phone: " + (d.phoneNumber ?? "");
        document.getElementById("viewBrand").textContent = "Street: " + (d.address?.street ?? "");
        document.getElementById("viewCategory").textContent = "City: " + (d.address?.city ?? "");
        document.getElementById("viewYear").textContent = "Country: " + (d.address?.country ?? "");

        // Hide image section (not used for dropshippers)
        const imgSection = document.querySelector(".image-section");
        if (imgSection) imgSection.style.display = "none";

        overlayView.style.display = "flex";

    } catch {
        alert("Failed to load details");
    }
}

function openDeleteModal(id) {
    deleteId = id;
    overlayDelete.style.display = "flex";
}

/** ============================
 *  ROW EVENTS
 * ============================ */
function attachRowEvents() {
    document.querySelectorAll(".viewBtn").forEach(btn =>
        btn.onclick = () => openViewModal(btn.dataset.id)
    );
    document.querySelectorAll(".editBtn").forEach(btn =>
        btn.onclick = () => openEditModal(btn.dataset.id)
    );
    document.querySelectorAll(".delBtn").forEach(btn =>
        btn.onclick = () => openDeleteModal(btn.dataset.id)
    );
}

/** ============================
 *  SAVE & DELETE
 * ============================ */
modalForm.onsubmit = async e => {
    e.preventDefault();

    const payload = {
        id: editId,
        userName: userNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        phoneNumber: phoneInput.value,
        address: {
            street: streetInput.value,
            city: cityInput.value,
            country: countryInput.value
        }
    };

    try {
        const res = await fetch(
            API_BASE + (editId ? `/${editId}` : ""),
            {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        );

        if (!res.ok) throw new Error();

        overlayAddEdit.style.display = "none";
        fetchAndRender();
    } catch {
        alert("Failed to save dropshipper");
    }
};

confirmDeleteBtn.onclick = async () => {
    try {
        const res = await fetch(`${API_BASE}/${deleteId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();

        overlayDelete.style.display = "none";
        fetchAndRender();
    } catch {
        alert("Failed to delete");
    }
};

/** ============================
 *  CLOSE MODALS
 * ============================ */
[overlayAddEdit, overlayDelete, overlayView].forEach(ov => {
    ov.addEventListener("click", e => {
        if (e.target === ov) ov.style.display = "none";
    });
});

[cancelModalBtn, cancelDeleteBtn].forEach(btn =>
    btn.onclick = () => {
        overlayAddEdit.style.display = "none";
        overlayDelete.style.display = "none";
    }
);

document.getElementById("closeView").onclick = () =>
    overlayView.style.display = "none";

/** ============================
 *  INIT
 * ============================ */
document.getElementById("addProductBtn").onclick = openAddModal;
fetchAndRender();
