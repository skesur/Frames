// Product Data
const products = {
    'top-sellers': [
        { name: 'Silver Gold Vintage', category: 'Round', price: 2499, rating: 5, badge: 'Topseller', image: 'image/t_s_1.png' },
        { name: 'Premium Clubmaster', category: 'Square', price: 2799, rating: 5, badge: 'Topseller', image: 'image/t_s_2.png' },
        { name: 'Classic Browline', category: 'Square', price: 2499, rating: 4, badge: 'Topseller', image: 'image/t_s_3.png' },
        { name: 'Vibrant Green', category: 'Round', price: 2999, rating: 4, badge: 'Topseller', image: 'image/t_s_4.png' },
        { name: 'Crystal Clear', category: 'Round', price: 3299, rating: 5, badge: 'Topseller', image: 'image/t_s_5.png' }
    ],
    'new-arrivals': [
        { name: 'Crystal Clear', category: 'Square', price: 3299, rating: 5, badge: 'New', image: 'image/n_a_1.png' },
        { name: 'Midnight Black', category: 'Round', price: 2599, rating: 4, badge: 'New', image: 'image/n_a_2.png' },
        { name: 'Ocean Blue', category: 'Round', price: 2899, rating: 4, badge: 'New', image: 'image/n_a_3.png' },
        { name: 'Sunset Orange', category: 'Square', price: 2599, rating: 5, badge: 'New', image: 'image/n_a_4.png' },
        { name: 'Pearl Purple', category: 'Round', price: 2399, rating: 4, badge: 'New', image: 'image/n_a_5.png' }
    ],
    'round-frames': [
        { name: 'Silver Gold Vintage', category: 'Round', price: 2499, rating: 5, badge: 'Vintage', image: 'image/t_s_1.png' },
        { name: 'Vibrant Green', category: 'Round', price: 2199, rating: 4, badge: 'Bold', image: 'image/t_s_4.png' },
        { name: 'Sunbright Yellow', category: 'Round', price: 2299, rating: 5, badge: 'Modern', image: 'image/r_f_3.png' },
        { name: 'Blood Red', category: 'Round', price: 2099, rating: 4, badge: 'Modern', image: 'image/r_f_4.png' },
        { name: 'Pearl Purple', category: 'Round', price: 2399, rating: 5, badge: 'Bold', image: 'image/n_a_5.png' }
    ],
    'square-frames': [
        { name: 'Premium Clubmaster', category: 'Square', price: 2799, rating: 5, badge: 'Premium', image: 'image/t_s_2.png' },
        { name: 'Classic Browline', category: 'Square', price: 2499, rating: 4, badge: 'Classic', image: 'image/t_s_3.png' },
        { name: 'Pearl Purple', category: 'Square', price: 2399, rating: 5, badge: 'Bold', image: 'image/s_f_3.png' },
        { name: 'Vibrant Green', category: 'Square', price: 2999, rating: 4, badge: 'Vintage', image: 'image/s_f_4.png' },
        { name: 'Blood Red', category: 'Square', price: 3899, rating: 5, badge: 'Modern', image: 'image/s_f_5.png' }
    ],
    'sunglasses': [
        { name: 'Crystal Clear', category: 'Sunglasses', price: 3299, rating: 5, badge: 'Premium', image: 'image/t_s_5.png' },
        { name: 'Classic Black', category: 'Sunglasses', price: 3499, rating: 5, badge: 'Classic', image: 'image/sun_1.png' },
        { name: 'Bold Brown', category: 'Sunglasses', price: 3499, rating: 4, badge: 'Bold', image: 'image/sun_2.png' },
        { name: 'Premium Brown', category: 'Sunglasses', price: 3299, rating: 5, badge: 'Bold', image: 'image/sun_3.png' },
        { name: 'Clear Tint', category: 'Sunglasses', price: 2799, rating: 4, badge: 'Modern', image: 'image/sun_4.png' }
    ]
};

// Generate Product Cards
function generateProductCards() {
    Object.keys(products).forEach(section => {
        const wrapper = document.getElementById(`${section}-wrapper`);
        products[section].forEach((product, index) => {
            const card = `
                <div class="product-card">
                    <div class="product-badge">${product.badge}</div>
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <div class="product-price">₹${product.price.toLocaleString()}</div>
                        <button class="add-to-cart-btn" onclick='addToCart(${JSON.stringify(product)})'>
                            <i class="bi bi-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            wrapper.innerHTML += card;
        });
    });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
    }
    return stars;
}

// Scroll Products
function scrollProducts(section, direction) {
    const wrapper = document.getElementById(`${section}-wrapper`);
    const scrollAmount = 350;
    wrapper.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Add to Cart - Updated with proper localStorage handling
function addToCart(product) {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    if (!currentUser) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }
    
    // Create user-specific cart key
    const cartKey = `framesCart_${currentUser.email}`;
    
    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => 
        item.name === product.name && item.category === product.category
    );
    
    if (existingIndex !== -1) {
        showCartMessage(`${product.name} is already in your cart!`, 'info');
        return;
    }
    
    // Add product to cart
    cart.push({
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        addedAt: new Date().toISOString()
    });
    
    // Save cart to localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Show success message
    showCartMessage(`${product.name} added to cart!`, 'success');
    
    // Update cart count if there's a cart button
    updateCartCount();
}

// Show cart message
function showCartMessage(message, type) {
    // Remove existing message if any
    const existingMsg = document.querySelector('.cart-notification');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(238, 128, 28, 0.2)'};
        border: 2px solid ${type === 'success' ? '#51cf66' : '#EE801C'};
        border-radius: 12px;
        color: ${type === 'success' ? '#51cf66' : '#EE801C'};
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'info-circle-fill'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Update cart count (if you want to show count on cart button)
function updateCartCount() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    if (!currentUser) return;
    
    const cartKey = `framesCart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // You can add a badge to cart button showing count
    const cartButtons = document.querySelectorAll('#cart, #cartMobile');
    cartButtons.forEach(btn => {
        // Remove existing badge if any
        const existingBadge = btn.querySelector('.cart-count-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add new badge if cart has items
        if (cart.length > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-count-badge';
            badge.textContent = cart.length;
            badge.style.cssText = `
                position: absolute;
                top: -5px;
                right: -5px;
                background-color: #ff6b6b;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.7rem;
                font-weight: 700;
            `;
            btn.style.position = 'relative';
            btn.appendChild(badge);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateProductCards();
    updateCartCount(); // Show cart count on page load

    // GSAP Animations
    gsap.registerPlugin(ScrollTrigger);

    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1
            },
            opacity: 0,
            y: 50,
            duration: 1
        });
    });

    // Animate product cards on scroll
    gsap.utils.toArray('.product-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 1
            },
            opacity: 0,
            scale: 0.8,
            duration: 0.5
        });
    });
    
    // Make cart buttons redirect to cart page
    const cartButtons = document.querySelectorAll('#cart, #cartMobile');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    });
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);