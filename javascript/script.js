document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // 1. MOBILE NAVIGATION TOGGLE LOGIC
    // ===========================================
    
    // Get all elements needed for the menu interaction
    const navCheck = document.getElementById('nav-check');
    const navCloseBtn = document.querySelector('.nav-close');
    const navLinks = document.querySelectorAll('.nav-links');

    /**
     * Closes the sidebar navigation menu by unchecking the hidden checkbox.
     */
    const closeNav = () => {
        if (navCheck) {
            navCheck.checked = false;
        }
    };

    // Close the menu when the close icon is clicked
    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', closeNav);
    }

    // Close the menu when any link inside it is clicked (better user experience)
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // ===========================================
    // 2. CONTACT FORM VALIDATION LOGIC
    // ===========================================

    // Select the contact form element
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Stop the form from submitting normally until validation passes
            event.preventDefault(); 
            
            let isValid = true;
            const formControls = this.querySelectorAll('.form-control');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation

            formControls.forEach(input => {
                // Clear any previous error states and messages
                input.classList.remove('error');
                
                const inputValue = input.value.trim();
                
                // --- Simple Required Field Check ---
                // NOTE: All fields with class 'form-control' are treated as required here.
                if (inputValue === '') {
                    // Alert or display a simple error message
                    alert(`The ${input.name || input.id || 'required'} field cannot be empty.`);
                    input.classList.add('error');
                    isValid = false;
                } 
                
                // --- Email Format Check ---
                else if (input.name === 'email' && !emailRegex.test(inputValue)) {
                    alert('Please enter a valid email address.');
                    input.classList.add('error');
                    isValid = false;
                }
            });

            // If all checks pass, proceed with submission
            if (isValid) {
                // In a real application, you would use 'fetch' to send data to a server.
                // For demonstration, we'll alert success and reset the form.

                alert('Thank you for your message! We will get back to you soon.');
                
                // If you were using a simple server endpoint, you'd call:
                // this.submit(); 
                
                this.reset(); // Clear form fields after "successful" submission
            }
        });
    }
});