// Load user profile on page load
window.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadOrderHistory();
});

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    // If no user is logged in, redirect to login
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Populate profile header
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    // Populate profile details
    document.getElementById('detailUsername').textContent = currentUser.username;
    document.getElementById('detailEmail').textContent = currentUser.email;
    document.getElementById('detailPhone').textContent = currentUser.phone;
    document.getElementById('detailCountry').textContent = currentUser.country;
    document.getElementById('detailAddress').textContent = currentUser.address;
    document.getElementById('detailPincode').textContent = currentUser.pincode;
    
    // Format and display creation date
    if (currentUser.createdAt) {
        const date = new Date(currentUser.createdAt);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('detailCreated').textContent = formattedDate;
    }
}

// Load order history
function loadOrderHistory() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    if (!currentUser) return;
    
    // Get all orders
    const allOrders = JSON.parse(localStorage.getItem('framesOrders')) || [];
    
    // Filter orders for current user
    const userOrders = allOrders.filter(order => order.userId === currentUser.email);
    
    const emptyOrders = document.getElementById('emptyOrders');
    const ordersGrid = document.getElementById('ordersGrid');
    
    if (userOrders.length === 0) {
        emptyOrders.style.display = 'block';
        ordersGrid.style.display = 'none';
    } else {
        emptyOrders.style.display = 'none';
        ordersGrid.style.display = 'grid';
        displayOrders(userOrders);
    }
}

// Display orders
function displayOrders(orders) {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';
    
    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    orders.forEach((order, index) => {
        const orderDate = new Date(order.orderDate);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const statusClass = `status-${order.status.toLowerCase()}`;
        
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.onclick = () => showOrderDetails(order);
        
        orderCard.innerHTML = `
            <div class="order-card-header">
                <span class="order-id">${order.orderId}</span>
                <span class="order-status ${statusClass}">${order.status}</span>
            </div>
            <div class="order-card-body">
                <div class="order-product-image">
                    <img src="${order.product.image}" alt="${order.product.name}">
                </div>
                <div class="order-product-info">
                    <h3>${order.product.name}</h3>
                    <p class="order-product-category">${order.product.category}</p>
                    <div class="order-product-price">${order.totalAmount}</div>
                </div>
            </div>
            <div class="order-card-footer">
                <span class="order-date">
                    <i class="bi bi-calendar3"></i> ${formattedDate}
                </span>
                <button class="view-details-btn" onclick="event.stopPropagation(); showOrderDetails(${JSON.stringify(order).replace(/"/g, '&quot;')})">
                    View Details <i class="bi bi-arrow-right"></i>
                </button>
            </div>
        `;
        
        ordersGrid.appendChild(orderCard);
    });
}

// Show order details in modal
function showOrderDetails(order) {
    const orderDate = new Date(order.orderDate);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Get coating name
    const coatingNames = {
        'standard': 'Standard',
        'anti-glare': 'Anti-Glare',
        'blue-light': 'Blue Light Filter',
        'photochromic': 'Photochromic'
    };
    
    // Get delivery method name
    const deliveryNames = {
        'standard': 'Standard Delivery (5-7 days)',
        'express': 'Express Delivery (2-3 days)',
        'overnight': 'Overnight Delivery (1 day)'
    };
    
    // Get payment method name
    const paymentNames = {
        'cod': 'Cash on Delivery',
        'card': 'Credit/Debit Card',
        'upi': 'UPI Payment',
        'netbanking': 'Net Banking'
    };
    
    const statusClass = `status-${order.status.toLowerCase()}`;
    
    const detailsHTML = `
        <!-- Product Info -->
        <div class="order-detail-section">
            <h4><i class="bi bi-box-seam"></i> Product Details</h4>
            <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1rem;">
                <div class="order-product-image" style="width: 120px; height: 100px;">
                    <img src="${order.product.image}" alt="${order.product.name}">
                </div>
                <div>
                    <h3 style="font-size: 1.5rem; margin-bottom: 0.3rem;">${order.product.name}</h3>
                    <p style="color: var(--secondary-text); margin-bottom: 0.3rem;">${order.product.category}</p>
                    <p style="color: var(--component-color-2); font-size: 1.3rem; font-weight: 700;">₹${order.product.price.toLocaleString()}</p>
                </div>
            </div>
        </div>
        
        <!-- Order Info -->
        <div class="order-detail-section">
            <h4><i class="bi bi-info-circle"></i> Order Information</h4>
            <div class="order-detail-row">
                <span class="order-detail-label">Order ID:</span>
                <span class="order-detail-value">${order.orderId}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Order Date:</span>
                <span class="order-detail-value">${formattedDate}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Status:</span>
                <span class="order-detail-value">
                    <span class="order-status ${statusClass}" style="display: inline-block;">${order.status}</span>
                </span>
            </div>
        </div>
        
        <!-- Lens Details -->
        <div class="order-detail-section">
            <h4><i class="bi bi-eyeglasses"></i> Lens Specifications</h4>
            <div class="order-detail-row">
                <span class="order-detail-label">Lens Type:</span>
                <span class="order-detail-value">${order.lensType === 'power' ? 'Power Lenses' : 'Powerless Lenses'}</span>
            </div>
            ${order.lensType === 'power' ? `
                <div class="order-detail-row">
                    <span class="order-detail-label">Left Eye Power:</span>
                    <span class="order-detail-value">${order.prescription.leftEyePower}</span>
                </div>
                <div class="order-detail-row">
                    <span class="order-detail-label">Right Eye Power:</span>
                    <span class="order-detail-value">${order.prescription.rightEyePower}</span>
                </div>
                ${order.prescription.leftEyeCylinder !== 'N/A' ? `
                    <div class="order-detail-row">
                        <span class="order-detail-label">Left Eye Cylinder:</span>
                        <span class="order-detail-value">${order.prescription.leftEyeCylinder}</span>
                    </div>
                ` : ''}
                ${order.prescription.rightEyeCylinder !== 'N/A' ? `
                    <div class="order-detail-row">
                        <span class="order-detail-label">Right Eye Cylinder:</span>
                        <span class="order-detail-value">${order.prescription.rightEyeCylinder}</span>
                    </div>
                ` : ''}
            ` : ''}
            <div class="order-detail-row">
                <span class="order-detail-label">Lens Coating:</span>
                <span class="order-detail-value">${coatingNames[order.lensCoating]}</span>
            </div>
        </div>
        
        <!-- Delivery Details -->
        <div class="order-detail-section">
            <h4><i class="bi bi-truck"></i> Delivery Information</h4>
            <div class="order-detail-row">
                <span class="order-detail-label">Address:</span>
                <span class="order-detail-value">${order.delivery.address}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Pincode:</span>
                <span class="order-detail-value">${order.delivery.pincode}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Phone:</span>
                <span class="order-detail-value">${order.delivery.phone}</span>
            </div>
            <div class="order-detail-row">
                <span class="order-detail-label">Delivery Method:</span>
                <span class="order-detail-value">${deliveryNames[order.delivery.method]}</span>
            </div>
        </div>
        
        <!-- Payment Details -->
        <div class="order-detail-section">
            <h4><i class="bi bi-credit-card"></i> Payment Information</h4>
            <div class="order-detail-row">
                <span class="order-detail-label">Payment Method:</span>
                <span class="order-detail-value">${paymentNames[order.paymentMethod]}</span>
            </div>
            <div class="order-total-row">
                <span class="order-detail-label">Total Amount:</span>
                <span class="order-detail-value">${order.totalAmount}</span>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsContent').innerHTML = detailsHTML;
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    modal.show();
}

// Open edit profile modal
function openEditModal() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    if (!currentUser) return;
    
    // Pre-fill form with current user data
    document.getElementById('editUsername').value = currentUser.username;
    document.getElementById('editEmail').value = currentUser.email;
    document.getElementById('editPhone').value = currentUser.phone;
    document.getElementById('editCountry').value = currentUser.country;
    document.getElementById('editAddress').value = currentUser.address;
    document.getElementById('editPincode').value = currentUser.pincode;
    
    // Clear password fields
    document.getElementById('editCurrentPassword').value = '';
    document.getElementById('editNewPassword').value = '';
    document.getElementById('editConfirmPassword').value = '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

// Save profile changes
function saveProfileChanges() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    if (!currentUser) return;
    
    // Get form values
    const newUsername = document.getElementById('editUsername').value.trim();
    const newPhone = document.getElementById('editPhone').value.trim();
    const newCountry = document.getElementById('editCountry').value.trim();
    const newAddress = document.getElementById('editAddress').value.trim();
    const newPincode = document.getElementById('editPincode').value.trim();
    
    // Validate required fields
    if (!newUsername || !newPhone || !newCountry || !newAddress || !newPincode) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(newPhone)) {
        showMessage('Phone number must be exactly 10 digits', 'error');
        return;
    }
    
    // Validate pincode (6 digits)
    if (!/^\d{6}$/.test(newPincode)) {
        showMessage('Pincode must be exactly 6 digits', 'error');
        return;
    }
    
    // Handle password change if provided
    const currentPassword = document.getElementById('editCurrentPassword').value;
    const newPassword = document.getElementById('editNewPassword').value;
    const confirmPassword = document.getElementById('editConfirmPassword').value;
    
    let updatedPassword = currentUser.password;
    
    if (currentPassword || newPassword || confirmPassword) {
        // Verify current password
        if (currentPassword !== currentUser.password) {
            showMessage('Current password is incorrect', 'error');
            return;
        }
        
        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            showMessage('New password must be at least 8 characters', 'error');
            return;
        }
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            showMessage('New passwords do not match', 'error');
            return;
        }
        
        updatedPassword = newPassword;
    }
    
    // Update user object
    const updatedUser = {
        ...currentUser,
        username: newUsername,
        phone: newPhone,
        country: newCountry,
        address: newAddress,
        pincode: newPincode,
        password: updatedPassword
    };
    
    // Update in users array
    let users = JSON.parse(localStorage.getItem('framesUsers')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('framesUsers', JSON.stringify(users));
    }
    
    // Update current user
    localStorage.setItem('framesCurrentUser', JSON.stringify(updatedUser));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
    
    // Show success message
    showMessage('Profile updated successfully!', 'success');
    
    // Reload profile display
    loadUserProfile();
}

// Show message
function showMessage(message, type) {
    // Remove existing messages
    const existingMsg = document.querySelector('.success-msg, .error-msg');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-msg' : 'error-msg';
    const icon = type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill';
    messageDiv.innerHTML = `<i class="bi bi-${icon}"></i> ${message}`;
    
    // Insert at top of modal body or profile container
    const modalBody = document.querySelector('#editProfileModal .modal-body');
    if (modalBody && modalBody.offsetParent !== null) {
        modalBody.insertBefore(messageDiv, modalBody.firstChild);
    } else {
        const profileContainer = document.querySelector('.profile-container');
        profileContainer.insertBefore(messageDiv, profileContainer.firstChild);
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('framesCurrentUser');
        window.location.href = 'home.html';
    }
}

// Handle account deletion
function handleDeleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
        const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
        let users = JSON.parse(localStorage.getItem('framesUsers')) || [];
        
        // Remove user from users array
        users = users.filter(u => u.email !== currentUser.email);
        
        // Remove user's cart
        const cartKey = `framesCart_${currentUser.email}`;
        localStorage.removeItem(cartKey);
        
        // Update localStorage
        localStorage.setItem('framesUsers', JSON.stringify(users));
        localStorage.removeItem('framesCurrentUser');
        
        alert('Account deleted successfully!');
        window.location.href = 'index.html';
    }
}