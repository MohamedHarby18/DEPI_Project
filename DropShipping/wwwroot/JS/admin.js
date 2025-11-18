document.getElementById('saveAdminBtn').addEventListener('click', () => {
    const name = document.getElementById('adminName').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Demo: log the values (replace with server request for real app)
    console.log('Admin Data Updated:', { name, email, password });

    alert('Admin info updated successfully!');
});
