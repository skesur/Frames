// Update navbar based on authentication status
window.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    setupCartButtons();
});

function updateNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    
    // Get all login buttons (desktop and mobile)
    const loginBtn = document.getElementById('login');
    const loginMobileBtn = document.getElementById('loginMobile');
    
    // Get all user buttons (desktop and mobile)
    const userBtn = document.getElementById('user');
    const userMobileBtn = document.getElementById('userMobile');
    
    if (currentUser) {
        // User is logged in - Update Login buttons to Logout
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.onclick = handleLogout;
        }
        if (loginMobileBtn) {
            loginMobileBtn.textContent = 'Logout';
            loginMobileBtn.onclick = handleLogout;
        }
        
        // Make user buttons clickable to go to profile
        if (userBtn) {
            userBtn.onclick = () => {
                window.location.href = 'profile.html';
            };
            userBtn.style.cursor = 'pointer';
        }
        if (userMobileBtn) {
            userMobileBtn.onclick = () => {
                window.location.href = 'profile.html';
            };
            userMobileBtn.style.cursor = 'pointer';
        }
    } else {
        // User is not logged in - Update buttons to go to login
        if (loginBtn) {
            loginBtn.textContent = 'LogIn';
            loginBtn.onclick = () => {
                window.location.href = 'login.html';
            };
        }
        if (loginMobileBtn) {
            loginMobileBtn.textContent = 'LogIn';
            loginMobileBtn.onclick = () => {
                window.location.href = 'login.html';
            };
        }
        
        // Make user buttons go to login page
        if (userBtn) {
            userBtn.onclick = () => {
                window.location.href = 'login.html';
            };
            userBtn.style.cursor = 'pointer';
        }
        if (userMobileBtn) {
            userMobileBtn.onclick = () => {
                window.location.href = 'login.html';
            };
            userMobileBtn.style.cursor = 'pointer';
        }
    }
}

// Setup cart buttons to redirect to cart page
function setupCartButtons() {
    const cartButtons = document.querySelectorAll('#cart, #cartMobile');
    
    cartButtons.forEach(btn => {
        btn.onclick = () => {
            const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
            
            if (!currentUser) {
                alert('Please login to view your cart');
                window.location.href = 'login.html';
            } else {
                window.location.href = 'cart.html';
            }
        };
        btn.style.cursor = 'pointer';
    });
    
    // Update cart count badge
    updateCartCount();
}

// Update cart count badge
function updateCartCount() {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    if (!currentUser) return;
    
    const cartKey = `framesCart_${currentUser.email}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    const cartButtons = document.querySelectorAll('#cart, #cartMobile');
    cartButtons.forEach(btn => {
        // Remove existing badge
        const existingBadge = btn.querySelector('.cart-count-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add badge if cart has items
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
                border: 2px solid var(--primary-background);
            `;
            btn.style.position = 'relative';
            btn.appendChild(badge);
        }
    });
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('framesCurrentUser');
        window.location.href = 'index.html';
    }
}