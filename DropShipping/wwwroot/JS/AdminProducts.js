// Delete Product Row
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this product?')) {
            const row = this.closest('tr');
            row.remove();
        }
    });
});

// Edit Product Row
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        const row = this.closest('tr');
        const name = row.children[1].innerText;
        const category = row.children[2].innerText;
        const price = row.children[3].innerText;
        const stock = row.children[4].innerText;

        const newName = prompt('Edit Product Name:', name);
        const newCategory = prompt('Edit Category:', category);
        const newPrice = prompt('Edit Price:', price);
        const newStock = prompt('Edit Stock:', stock);

        if (newName) row.children[1].innerText = newName;
        if (newCategory) row.children[2].innerText = newCategory;
        if (newPrice) row.children[3].innerText = newPrice;
        if (newStock) row.children[4].innerText = newStock;
    });
});
