// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    loadCartItems();
    setupEventListeners();
});

// Check if user is logged in
function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    if (!currentUser) {
        alert('Please login to view your cart');
        window.location.href = 'login.html';
    }
}

// Load cart items from localStorage
function loadCartItems() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    const cartKey = `framesCart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const emptyCart = document.getElementById('emptyCart');
    const cartItemsGrid = document.getElementById('cartItemsGrid');
    const cartSummary = document.getElementById('cartSummary');
    const cartItemCount = document.getElementById('cartItemCount');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsGrid.style.display = 'none';
        cartSummary.style.display = 'none';
        cartItemCount.textContent = 'No items in cart';
    } else {
        emptyCart.style.display = 'none';
        cartItemsGrid.style.display = 'grid';
        cartSummary.style.display = 'block';
        cartItemCount.textContent = `${cart.length} item${cart.length > 1 ? 's' : ''} in your cart`;
        
        displayCartItems(cart);
        updateCartSummary(cart);
    }
}

// Display cart items
function displayCartItems(cart) {
    const cartItemsGrid = document.getElementById('cartItemsGrid');
    cartItemsGrid.innerHTML = '';
    
    cart.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'cart-item-card';
        card.innerHTML = `
            <button class="remove-item-btn" onclick="removeFromCart(${index})">
                <i class="bi bi-x"></i>
            </button>
            <div class="cart-product-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-product-info">
                <h3 class="cart-product-name">${item.name}</h3>
                <p class="cart-product-category">${item.category}</p>
                <div class="cart-product-price">₹${item.price.toLocaleString()}</div>
                <button class="order-now-btn" onclick="openOrderModal(${index})">
                    <i class="bi bi-bag-check-fill"></i> Order Now
                </button>
            </div>
        `;
        cartItemsGrid.appendChild(card);
    });
}

// Update cart summary
function updateCartSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
}

// Remove item from cart
function removeFromCart(index) {
    if (confirm('Remove this item from cart?')) {
        const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
        const cartKey = `framesCart_${currentUser.email}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        
        cart.splice(index, 1);
        localStorage.setItem(cartKey, JSON.stringify(cart));
        
        loadCartItems();
        
        // Show success message
        showMessage('Item removed from cart', 'success');
    }
}

// Open order modal with product details
let currentOrderIndex = null;

function openOrderModal(index) {
    currentOrderIndex = index;
    
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    const cartKey = `framesCart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const product = cart[index];
    
    // Populate modal with product info
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductPrice').textContent = `₹${product.price.toLocaleString()}`;
    document.getElementById('orderProductPrice').textContent = `₹${product.price.toLocaleString()}`;
    
    // Pre-fill user data if available
    if (currentUser.address) {
        document.getElementById('deliveryAddress').value = currentUser.address;
    }
    if (currentUser.pincode) {
        document.getElementById('deliveryPincode').value = currentUser.pincode;
    }
    if (currentUser.phone) {
        document.getElementById('deliveryPhone').value = currentUser.phone;
    }
    
    // Reset form
    document.getElementById('orderForm').reset();
    document.getElementById('powerFields').style.display = 'none';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();
    
    // Update total
    updateOrderTotal();
}

// Toggle power fields
function togglePowerFields() {
    const powerRadio = document.getElementById('power');
    const powerFields = document.getElementById('powerFields');
    
    if (powerRadio.checked) {
        powerFields.style.display = 'block';
        document.getElementById('leftEyePower').required = true;
        document.getElementById('rightEyePower').required = true;
    } else {
        powerFields.style.display = 'none';
        document.getElementById('leftEyePower').required = false;
        document.getElementById('rightEyePower').required = false;
    }
}

// Setup event listeners for price updates
function setupEventListeners() {
    document.getElementById('lensCoating')?.addEventListener('change', updateOrderTotal);
    document.getElementById('deliveryMethod')?.addEventListener('change', updateOrderTotal);
}

// Update order total
function updateOrderTotal() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    const cartKey = `framesCart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    if (currentOrderIndex === null || !cart[currentOrderIndex]) return;
    
    const product = cart[currentOrderIndex];
    let productPrice = product.price;
    
    // Calculate lens coating price
    const coatingSelect = document.getElementById('lensCoating');
    let coatingPrice = 0;
    if (coatingSelect.value === 'anti-glare') coatingPrice = 500;
    else if (coatingSelect.value === 'blue-light') coatingPrice = 800;
    else if (coatingSelect.value === 'photochromic') coatingPrice = 1500;
    
    // Calculate delivery price
    const deliverySelect = document.getElementById('deliveryMethod');
    let deliveryPrice = 0;
    if (deliverySelect.value === 'standard') deliveryPrice = 600;
    else if (deliverySelect.value === 'express') deliveryPrice = 1300;
    else if (deliverySelect.value === 'overnight') deliveryPrice = 2500;
    
    // Update display
    document.getElementById('orderProductPrice').textContent = `₹${productPrice.toLocaleString()}`;
    document.getElementById('orderCoatingPrice').textContent = `₹${coatingPrice.toLocaleString()}`;
    document.getElementById('orderDeliveryPrice').textContent = `₹${deliveryPrice.toLocaleString()}`;
    
    const total = productPrice + coatingPrice + deliveryPrice;
    document.getElementById('orderTotalPrice').textContent = `₹${total.toLocaleString()}`;
}

// Confirm and place order
function confirmOrder() {
    const form = document.getElementById('orderForm');
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Check power fields if power lenses selected
    const powerRadio = document.getElementById('power');
    if (powerRadio.checked) {
        const leftPower = document.getElementById('leftEyePower').value;
        const rightPower = document.getElementById('rightEyePower').value;
        
        if (!leftPower || !rightPower) {
            alert('Please enter power for both eyes');
            return;
        }
    }
    
    // Get form data
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    const cartKey = `framesCart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const product = cart[currentOrderIndex];
    
    const orderData = {
        orderId: 'ORD' + Date.now(),
        userId: currentUser.email,
        userName: currentUser.username,
        product: {
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image
        },
        lensType: document.querySelector('input[name="lensType"]:checked').value,
        prescription: {
            leftEyePower: document.getElementById('leftEyePower').value || 'N/A',
            rightEyePower: document.getElementById('rightEyePower').value || 'N/A',
            leftEyeCylinder: document.getElementById('leftEyeCylinder').value || 'N/A',
            rightEyeCylinder: document.getElementById('rightEyeCylinder').value || 'N/A'
        },
        lensCoating: document.getElementById('lensCoating').value,
        delivery: {
            address: document.getElementById('deliveryAddress').value,
            pincode: document.getElementById('deliveryPincode').value,
            phone: document.getElementById('deliveryPhone').value,
            method: document.getElementById('deliveryMethod').value
        },
        paymentMethod: document.getElementById('paymentMethod').value,
        totalAmount: document.getElementById('orderTotalPrice').textContent,
        orderDate: new Date().toISOString(),
        status: 'Pending'
    };
    
    // Save order
    let orders = JSON.parse(localStorage.getItem('framesOrders')) || [];
    orders.push(orderData);
    localStorage.setItem('framesOrders', JSON.stringify(orders));
    
    // Remove item from cart
    cart.splice(currentOrderIndex, 1);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'));
    modal.hide();
    
    // Show success message and reload
    alert(`Order placed successfully!\nOrder ID: ${orderData.orderId}\n\nYour order will be processed within 1-2 business days.`);
    
    // Reload cart
    loadCartItems();
    currentOrderIndex = null;
}

// Show message
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-msg' : 'error-msg';
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '100px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '10000';
    messageDiv.style.padding = '1rem 2rem';
    messageDiv.style.borderRadius = '10px';
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}