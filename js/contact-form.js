// Initialize EmailJS with your credentials
emailjs.init("xCdX4_urk9Ygi4U47"); // Replace with your actual public key from EmailJS dashboard

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const templateParams = {
            from_name: formData.get('firstName') + ' ' + formData.get('lastName'),
            from_email: formData.get('email'),
            phone: formData.get('phone') || 'Not provided',
            company: formData.get('company') || 'Not provided',
            subject: formData.get('subject'),
            message: formData.get('message'),
            to_email: 'serviceofgees@gmail.com',
            reply_to: formData.get('email'), // This sets the reply-to address
            sender_info: `${formData.get('firstName')} ${formData.get('lastName')} <${formData.get('email')}>` // Clear sender identification
        };
        
        // Send email using EmailJS with your Gmail service
        emailjs.send('service_rp2fs9o', 'template_zjsjiur', templateParams)
            .then(function(response) {
                // Success
                showMessage('✅ Message sent successfully to serviceofgees@gmail.com! We\'ll get back to you soon.', 'success');
                form.reset();
            })
            .catch(function(error) {
                // Error - fallback to mailto link
                showMessage('❌ Failed to send message. Opening email client...', 'error');
                console.error('EmailJS error:', error);
                
                // Open default email client as fallback
                setTimeout(() => {
                    const mailtoLink = `mailto:serviceofgees@gmail.com?subject=${encodeURIComponent('Contact Form: ' + templateParams.subject)}&body=${encodeURIComponent(
                        `Name: ${templateParams.from_name}\n` +
                        `Email: ${templateParams.from_email}\n` +
                        `Phone: ${templateParams.phone}\n` +
                        `Company: ${templateParams.company}\n\n` +
                        `Message:\n${templateParams.message}\n\n` +
                        `---\nSent via General Energies Contact Form\nPlease reply to: ${templateParams.from_email}`
                    )}`;
                    window.location.href = mailtoLink;
                }, 2000);
            })
            .finally(function() {
                // Reset button
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                submitBtn.disabled = false;
            });
    });
});

function showMessage(message, type) {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}