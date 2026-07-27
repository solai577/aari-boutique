/* main.js - Global Interactions & Animations */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initContactValidation();
});

// 1. Sticky Header Scroll Effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check immediately on load
}

// 2. Mobile Navigation Toggle
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking links
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// 3. Scroll Reveal Animations (Intersection Observer)
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        reveals.forEach(element => {
            element.classList.add('active');
        });
    }
}

// 4. Contact Form Client-side Validation
function initContactValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const fields = {
        name: {
            input: document.getElementById('formName'),
            validate: value => value.trim().length >= 3,
            errorMsg: 'Name must be at least 3 characters long.'
        },
        phone: {
            input: document.getElementById('formPhone'),
            validate: value => {
                // Accepts basic 10-digit Indian phone numbers with/without spaces/dashes
                const phoneRegex = /^[6-9]\d{9}$/;
                return phoneRegex.test(value.trim().replace(/[-\s]/g, ''));
            },
            errorMsg: 'Please enter a valid 10-digit mobile number.'
        },
        message: {
            input: document.getElementById('formMessage'),
            validate: value => value.trim().length >= 10,
            errorMsg: 'Message must be at least 10 characters long.'
        }
    };

    // Helper functions to show/hide errors
    const showError = (fieldKey, message) => {
        const fieldGroup = fields[fieldKey].input.parentElement;
        fieldGroup.classList.add('has-error');
        let errorEl = fieldGroup.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            fieldGroup.appendChild(errorEl);
        }
        errorEl.textContent = message;
    };

    const clearError = (fieldKey) => {
        const fieldGroup = fields[fieldKey].input.parentElement;
        fieldGroup.classList.remove('has-error');
    };

    // Real-time validation on blur/input
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        field.input.addEventListener('blur', () => {
            if (!field.validate(field.input.value)) {
                showError(key, field.errorMsg);
            } else {
                clearError(key);
            }
        });

        field.input.addEventListener('input', () => {
            if (field.validate(field.input.value)) {
                clearError(key);
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        Object.keys(fields).forEach(key => {
            const field = fields[key];
            if (!field.validate(field.input.value)) {
                showError(key, field.errorMsg);
                isValid = false;
            } else {
                clearError(key);
            }
        });

        if (isValid) {
            // Get form values
            const nameVal = fields.name.input.value.trim();
            const phoneVal = fields.phone.input.value.trim();
            const messageVal = fields.message.input.value.trim();

            // Prepare WhatsApp pre-filled text
            const whatsappText = encodeURIComponent(
                `Hello Aari Boutique, my name is ${nameVal} (${phoneVal}).\n\nEnquiry: ${messageVal}`
            );
            
            // Show premium styled success message
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = '#25d366';
            submitBtn.style.borderColor = '#25d366';
            submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Opening WhatsApp...';

            setTimeout(() => {
                // Open WhatsApp chat in a new tab
                window.open(`https://wa.me/919876543210?text=${whatsappText}`, '_blank');
                
                // Reset form
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.borderColor = '';
                submitBtn.innerHTML = originalText;
                
                // Show success toast / alert
                alert('Thank you for contacting us! Redirecting you to WhatsApp for direct chat support.');
            }, 1000);
        }
    });
}
