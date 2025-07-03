const IS_DEV = false; // Set to false in production

function toggleNavMenu() {
    const nav = document.getElementById('main-navigation');
    const hamburger = document.getElementById('hamburger');
    const isOpen = nav.classList.toggle('nav-visible');
    hamburger.setAttribute('aria-expanded', isOpen);
}

document.getElementById('hamburger').addEventListener('click', toggleNavMenu);

// Smooth scrolling for internal navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            // Optionally close nav on mobile after click
            document.getElementById('main-navigation').classList.remove('nav-visible');
            document.getElementById('hamburger').setAttribute('aria-expanded', false);
        }
    });
});

// --- Project Filter Feature ---
function filterProjects(category) {
    document.querySelectorAll('.project-card').forEach(card => {
        const cardCategories = card.getAttribute('data-category')?.split(',') || [];
        if (category === 'all' || cardCategories.includes(category)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Example usage: filterProjects('web'); // or filterProjects('all')

// --- Lightbox Effect for Project Images ---
function createLightbox() {
    // Create modal elements if not already present
    if (document.getElementById('lightbox-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'lightbox-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
        z-index: 2000; display: none;
    `;
    modal.innerHTML = `
        <img id="lightbox-img" src="" alt="Project Image" style="max-width:90vw; max-height:80vh; border-radius:8px; box-shadow:0 2px 16px #000;">
        <button id="lightbox-close" aria-label="Close" style="position:absolute;top:32px;right:32px;font-size:2rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>
    `;
    document.body.appendChild(modal);

    // Close handlers
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.id === 'lightbox-close') {
            modal.style.display = 'none';
            document.getElementById('lightbox-img').src = '';
        }
    });
}

function enableLightbox() {
    createLightbox();
    document.querySelectorAll('.project-card img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function () {
            const modal = document.getElementById('lightbox-modal');
            const lightboxImg = document.getElementById('lightbox-img');
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            modal.style.display = 'flex';
        });
    });
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    enableLightbox();

    // --- Contact Form Validation ---
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');

        // Helper to show error message
        function showError(input, message) {
            let error = input.parentElement.querySelector('.form-error');
            if (!error) {
                error = document.createElement('span');
                error.className = 'form-error';
                error.style.color = '#e74c3c';
                error.style.fontSize = '0.95rem';
                error.style.marginTop = '2px';
                input.parentElement.appendChild(error);
            }
            error.textContent = message;
            input.setAttribute('aria-invalid', 'true');
        }

        // Helper to clear error message
        function clearError(input) {
            let error = input.parentElement.querySelector('.form-error');
            if (error) error.textContent = '';
            input.removeAttribute('aria-invalid');
        }

        // Email validation regex
        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        // Real-time validation
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required.');
            } else {
                clearError(nameInput);
            }
        });

        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required.');
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
            } else {
                clearError(emailInput);
            }
        });

        messageInput.addEventListener('input', () => {
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required.');
            } else {
                clearError(messageInput);
            }
        });

        // On submit
        contactForm.addEventListener('submit', function (e) {
            let valid = true;

            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required.');
                valid = false;
            }
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required.');
                valid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email address.');
                valid = false;
            }
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required.');
                valid = false;
            }

            if (!valid) {
                e.preventDefault();
            }

            // Prevent actual submission in test mode
            if (IS_DEV) {
                e.preventDefault();
            }
        });
    }

    if (IS_DEV) {
        // --- Simulate User Interactions for Testing Purposes ---

        // Simulate navigation to "Projects" section after 1 second
        setTimeout(() => {
            const projectsLink = document.querySelector('nav a[href="#projects"]');
            if (projectsLink) {
                projectsLink.click();
            }
        }, 1000);

        // Simulate filtering projects (if you have data-category attributes set)
        setTimeout(() => {
            // Example: filter only projects with category 'web'
            if (typeof filterProjects === 'function') {
                filterProjects('web');
            }
        }, 2000);

        // Simulate filling and submitting the contact form
        setTimeout(() => {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            const contactForm = document.querySelector('#contact form');
            if (nameInput && emailInput && messageInput && contactForm) {
                nameInput.value = 'Test User';
                emailInput.value = 'test@example.com';
                messageInput.value = 'This is a test message.';
                // Trigger input events for real-time validation
                nameInput.dispatchEvent(new Event('input'));
                emailInput.dispatchEvent(new Event('input'));
                messageInput.dispatchEvent(new Event('input'));
                // Submit the form
                contactForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }
        }, 3000);

        // Simulate clicking the first project image to open the lightbox
        setTimeout(() => {
            const firstProjectImg = document.querySelector('.project-card img');
            if (firstProjectImg) {
                firstProjectImg.click();
                // Auto-close the lightbox after 2 seconds
                setTimeout(() => {
                    const modal = document.getElementById('lightbox-modal');
                    if (modal && modal.style.display === 'flex') {
                        modal.style.display = 'none';
                        document.getElementById('lightbox-img').src = '';
                    }
                }, 2000);
            }
        }, 4000);
    }
});