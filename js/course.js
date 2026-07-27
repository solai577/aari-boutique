/* course.js - Syllabus accordion & Registration form handling */

document.addEventListener('DOMContentLoaded', () => {
    initSyllabusAccordion();
    initRegistrationValidation();
});

// 1. Syllabus Accordion Toggle
function initSyllabusAccordion() {
    const syllabusModules = document.querySelectorAll('.syllabus-module');

    if (syllabusModules.length === 0) return;

    syllabusModules.forEach(module => {
        const header = module.querySelector('.syllabus-header');
        const body = module.querySelector('.syllabus-body');

        if (!header || !body) return;

        header.addEventListener('click', () => {
            const isActive = module.classList.contains('active');

            // Collapse other active accordion tabs for clean feel
            syllabusModules.forEach(otherModule => {
                if (otherModule !== module && otherModule.classList.contains('active')) {
                    otherModule.classList.remove('active');
                    const otherBody = otherModule.querySelector('.syllabus-body');
                    if (otherBody) {
                        otherBody.style.maxHeight = '0px';
                    }
                }
            });

            // Toggle active state on current module
            if (isActive) {
                module.classList.remove('active');
                body.style.maxHeight = '0px';
            } else {
                module.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // Auto-open first syllabus module on load
    if (syllabusModules.length > 0) {
        syllabusModules[0].classList.add('active');
        const firstBody = syllabusModules[0].querySelector('.syllabus-body');
        if (firstBody) {
            firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
        }
    }
}

// 2. Admission Form Validation & WhatsApp Redirect
function initRegistrationValidation() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    const fields = {
        name: {
            input: document.getElementById('regName'),
            validate: val => val.trim().length >= 3,
            errorMsg: 'Name must be at least 3 characters long.'
        },
        phone: {
            input: document.getElementById('regPhone'),
            validate: val => {
                const phoneRegex = /^[6-9]\d{9}$/;
                return phoneRegex.test(val.trim().replace(/[-\s]/g, ''));
            },
            errorMsg: 'Please enter a valid 10-digit mobile number.'
        }
    };

    // Helper functions for errors
    const showError = (fieldKey, message) => {
        const group = fields[fieldKey].input.parentElement;
        group.classList.add('has-error');
        let errorEl = group.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            group.appendChild(errorEl);
        }
        errorEl.textContent = message;
    };

    const clearError = (fieldKey) => {
        const group = fields[fieldKey].input.parentElement;
        group.classList.remove('has-error');
    };

    // Listeners for real-time validation
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

    // Form Submit Action
    registerForm.addEventListener('submit', (e) => {
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
            const nameVal = fields.name.input.value.trim();
            const phoneVal = fields.phone.input.value.trim();
            
            // Get selected class mode (Online / Offline)
            const modeInput = document.querySelector('input[name="classMode"]:checked');
            const modeVal = modeInput ? modeInput.value : 'Not Specified';

            // WhatsApp Message drafting
            const messageStr = `Hello Aari Boutique & Academy!\n\nI want to register for the *Aari Work Pro Course* (Admission Enquiry).\n\nDetails:\n- Name: ${nameVal}\n- WhatsApp: ${phoneVal}\n- Preferred Mode: ${modeVal}`;
            const encodedText = encodeURIComponent(messageStr);

            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.style.backgroundColor = '#25d366';
            submitBtn.style.borderColor = '#25d366';
            submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Redirecting to WhatsApp...';

            setTimeout(() => {
                // Open WhatsApp link in new window
                window.open(`https://wa.me/919876543210?text=${encodedText}`, '_blank');

                // Reset Form
                registerForm.reset();
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.borderColor = '';
                submitBtn.innerHTML = originalText;

                alert('Thank you for choosing Aari Academy! We are redirecting you to WhatsApp to complete your registration.');
            }, 1000);
        }
    });
}
