// Initialize users array from localStorage
let users = JSON.parse(localStorage.getItem('framesUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('framesCurrentUser')) || null;

// Toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
    
    // Clear any error messages
    clearMessages();
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Save current user
        localStorage.setItem('framesCurrentUser', JSON.stringify(user));
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to home page after 1 second
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage('Invalid email or password!', 'error');
    }
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const phone = document.getElementById('signupPhone').value;
    const address = document.getElementById('signupAddress').value;
    const pincode = document.getElementById('signupPincode').value;
    const country = document.getElementById('signupCountry').value;
    
    // Validation
    if (password !== confirmPassword) {
        showMessage('Passwords do not match!', 'error');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showMessage('Email already registered!', 'error');
        return;
    }
    
    // Create new user object
    const newUser = {
        username,
        email,
        password,
        phone,
        address,
        pincode,
        country,
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('framesUsers', JSON.stringify(users));
    localStorage.setItem('framesCurrentUser', JSON.stringify(newUser));
    
    showMessage('Account created successfully! Redirecting...', 'success');
    
    // Redirect to home page after 1 second
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Show message (error or success)
function showMessage(message, type) {
    // Remove any existing messages
    clearMessages();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    const activeForm = document.querySelector('.form-container:not(.hidden)');
    const form = activeForm.querySelector('form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Clear all messages
function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => msg.remove());
}

// Check if user is already logged in (on login page)
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('framesCurrentUser'));
    if (currentUser && window.location.pathname.includes('login.html')) {
        // User is already logged in, redirect to home
        window.location.href = 'index.html';
    }
});