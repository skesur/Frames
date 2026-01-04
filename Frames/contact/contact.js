// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Create contact object
    const contactData = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Get existing contacts from localStorage
    let contacts = JSON.parse(localStorage.getItem('framesContacts')) || [];
    
    // Add new contact
    contacts.push(contactData);
    
    // Save to localStorage
    localStorage.setItem('framesContacts', JSON.stringify(contacts));
    
    // Show success message
    showContactMessage('Thank you for contacting us! We will get back to you within 24 hours.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Log to console (for demo purposes)
    console.log('Contact form submitted:', contactData);
}

// Show message (success or error)
function showContactMessage(message, type) {
    // Remove any existing messages
    const existingMsg = document.querySelector('.success-msg, .error-msg');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-msg' : 'error-msg';
    messageDiv.textContent = message;
    
    // Insert before form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageDiv, form);
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}