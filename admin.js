
// Admin JavaScript for managing the website

document.addEventListener('DOMContentLoaded', function() {
    // Admin login
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // In a real app, this would check against your database
            if (username === 'admin' && password === 'sambusa123') {
                // Store login state (in a real app, use proper session management)
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }
    
    // Check if admin is logged in for protected pages
    const protectedPages = ['dashboard.html', 'manage-items.html', 'manage-prices.html', 'manage-addresses.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'login.html';
        });
    }
    
    // Manage Items functionality
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const itemData = {
                name: document.getElementById('item-name').value,
                category: document.getElementById('item-category').value,
                price: document.getElementById('item-price').value,
                image: document.getElementById('item-image').value,
                description: document.getElementById('item-description').value
            };
            
            // In a real app, this would send to your server
            console.log('Adding new item:', itemData);
            alert('Item added successfully!');
            addItemForm.reset();
            
            // Here you would refresh the item list from the server
        });
    }
    
    // Update prices functionality
    const updatePricesBtn = document.getElementById('updatePricesBtn');
    if (updatePricesBtn) {
        updatePricesBtn.addEventListener('click', function() {
            const priceInputs = document.querySelectorAll('.price-input');
            const updatedPrices = {};
            
            priceInputs.forEach(input => {
                const itemName = input.closest('tr').querySelector('td:first-child').textContent;
                updatedPrices[itemName] = input.value;
            });
            
            // In a real app, this would send to your server
            console.log('Updated prices:', updatedPrices);
            alert('Prices updated successfully!');
            
            // Here you would refresh the prices from the server
        });
    }
    
    // Manage Addresses functionality
    const businessAddressForm = document.getElementById('businessAddressForm');
    if (businessAddressForm) {
        businessAddressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const addressData = {
                line1: document.getElementById('address-line1').value,
                line2: document.getElementById('address-line2').value,
                city: document.getElementById('city').value,
                phone: document.getElementById('phone').value
            };
            
            // In a real app, this would send to your server
            console.log('Updating business address:', addressData);
            alert('Business address updated successfully!');
        });
    }
    
    const addAreaForm = document.getElementById('addAreaForm');
    if (addAreaForm) {
        addAreaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const areaName = document.getElementById('new-area').value;
            const deliveryFee = document.getElementById('delivery-fee').value;
            
            // In a real app, this would send to your server
            console.log('Adding new delivery area:', { name: areaName, fee: deliveryFee });
            alert('Delivery area added successfully!');
            addAreaForm.reset();
            
            // Here you would refresh the area list from the server
        });
    }
});