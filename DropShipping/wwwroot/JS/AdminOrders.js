// Delete Order Row
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this order?')) {
            const row = this.closest('tr');
            row.remove();
        }
    });
});

// Edit Order Row
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const row = this.closest('tr');
        const product = row.children[1].innerText;
        const dropshipper = row.children[2].innerText;
        const customer = row.children[3].innerText;
        const address = row.children[4].innerText;

        const newProduct = prompt('Edit Product Name:', product);
        const newDropshipper = prompt('Edit Dropshipper:', dropshipper);
        const newCustomer = prompt('Edit Customer:', customer);
        const newAddress = prompt('Edit Address:', address);

        if (newProduct) row.children[1].innerText = newProduct;
        if (newDropshipper) row.children[2].innerText = newDropshipper;
        if (newCustomer) row.children[3].innerText = newCustomer;
        if (newAddress) row.children[4].innerText = newAddress;
    });
});
