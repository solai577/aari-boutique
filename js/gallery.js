/* gallery.js - Filtering and Lightbox handling */

document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilters();
    initLightbox();
});

// 1. Gallery Filter Tab System
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (filterButtons.length === 0 || galleryCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to current button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card displays
                card.style.display = 'block';
                
                if (filterValue === 'all') {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else if (category === filterValue) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    // Use a timeout to display none after fade-out transition
                    setTimeout(() => {
                        if (btn.classList.contains('active') && btn.getAttribute('data-filter') !== 'all' && card.getAttribute('data-category') !== btn.getAttribute('data-filter')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// 2. Lightbox Popup
function initLightbox() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryCards.length === 0 || !lightbox) return;

    const lightboxImg = lightbox.querySelector('.lightbox-media img');
    const lightboxCategory = lightbox.querySelector('.lightbox-category');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDesc = lightbox.querySelector('.lightbox-desc');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const enquiryBtn = lightbox.querySelector('.btn-whatsapp');

    // Open Lightbox
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-img');
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');

            if (!imgSrc) return;

            // Set media
            lightboxImg.src = imgSrc;
            lightboxImg.alt = title || 'Aari Design';
            
            // Set details
            if (lightboxCategory) lightboxCategory.textContent = category || 'Design';
            if (lightboxTitle) lightboxTitle.textContent = title || 'Exclusive Aari Embroidery';
            if (lightboxDesc) lightboxDesc.textContent = desc || 'Intricately handcrafted embroidery blouse design using the finest threads, beads, and materials.';

            // Pre-fill WhatsApp link with design details
            if (enquiryBtn) {
                const whatsappNumber = "918940704322"; // Chennai boutique contact
                const customMessage = encodeURIComponent(
                    `Hi, I am looking at your beautiful design: "${title || 'Aari Blouse'}" (Category: ${category || 'Embroidery'}). Please share pricing details and availability.`
                );
                enquiryBtn.href = `https://wa.me/${whatsappNumber}?text=${customMessage}`;
            }

            // Show lightbox with animation
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop scrolling behind modal
        });
    });

    // Close Lightbox function
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scrolling again
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on clicking outside lightbox container
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
