document.addEventListener('DOMContentLoaded', () => {

    // --- Animate sections on scroll ---
    const animatedSections = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedSections.forEach(section => observer.observe(section));

    // --- Objective 1: Dropdown Menu Logic ---
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownContent = document.getElementById('dropdown-content');

    dropdownBtn.addEventListener('click', (e) => {
        const isOpening = dropdownContent.hasAttribute('hidden');
        if (isOpening) {
            dropdownContent.hidden = false;
            // Use rAF to ensure the transition applies
            requestAnimationFrame(() => dropdownContent.classList.add('show'));
        } else {
            dropdownContent.classList.remove('show');
        }
        dropdownBtn.setAttribute('aria-expanded', isOpening);
        e.stopPropagation(); // Prevent window click handler from closing it immediately
    });

    // Animate dropdown closing
    dropdownContent.addEventListener('transitionend', (e) => {
        if (!dropdownContent.classList.contains('show') && e.propertyName === 'opacity') {
            dropdownContent.hidden = true;
        }
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', () => {
        if (dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
            dropdownBtn.setAttribute('aria-expanded', 'false');
        }
    });


    // --- Objective 2: Modal Window Logic ---
    const modalBtn = document.getElementById('modal-btn');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    let lastActiveElement;

    const openModal = () => {
        lastActiveElement = document.activeElement;
        modalOverlay.hidden = false;
        closeBtn.focus();
        document.addEventListener('keydown', handleKeyDown);
    };

    const closeModal = () => {
        modalOverlay.hidden = true;
        if (lastActiveElement) lastActiveElement.focus();
        document.removeEventListener('keydown', handleKeyDown);
    };

    // Keyboard accessibility for modal (Esc to close)
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') closeModal();
    };

    modalBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });


    // --- Objective 3: Live Form Validation Logic ---
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const successMessage = document.getElementById('success-message');
    const signupForm = document.getElementById('signup-form');

    const validationState = { email: false, password: false };

    const checkFormValidity = () => {
        submitBtn.disabled = !(validationState.email && validationState.password);
    };

    // Email validation
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validationState.email = emailRegex.test(emailInput.value);
        if (emailInput.value && !validationState.email) {
            emailError.textContent = 'Please enter a valid email address.';
            emailInput.classList.add('invalid');
            emailInput.classList.remove('valid');
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('invalid');
            if(validationState.email) emailInput.classList.add('valid');
        }
        checkFormValidity();
    });

    // Password validation
    passwordInput.addEventListener('input', () => {
        validationState.password = passwordInput.value.length >= 8;
        if (passwordInput.value && !validationState.password) {
            passwordError.textContent = 'Password must be 8+ characters.';
            passwordInput.classList.add('invalid');
            passwordInput.classList.remove('valid');
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('invalid');
            if(validationState.password) passwordInput.classList.add('valid');
        }
        checkFormValidity();
    });

    // Form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validationState.email && validationState.password) {
            successMessage.hidden = false;
            // Hide the message after a few seconds
            setTimeout(() => { successMessage.hidden = true; }, 4000);
            
            // Reset form state
            signupForm.reset();
            emailInput.classList.remove('valid', 'invalid');
            passwordInput.classList.remove('valid', 'invalid');
            validationState.email = false;
            validationState.password = false;
            checkFormValidity();
        }
    });
});