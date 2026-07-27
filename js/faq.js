/* faq.js - Interactive FAQ Accordion */

document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
});

function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 1. Collapse all active FAQ items first (exclusive accordion feel)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0px';
                    }
                }
            });

            // 2. Toggle active state on current item
            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0px';
            } else {
                item.classList.add('active');
                // Dynamically set max-height based on scroll height of content
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Optionally open the first FAQ item by default on desktop
    if (window.innerWidth > 768 && faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
}
