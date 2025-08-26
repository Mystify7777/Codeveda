// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Objective 1: Dropdown Menu Logic ---
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownContent = document.getElementById('dropdown-content');

    // Add a click event listener to the dropdown button
    dropdownBtn.addEventListener('click', () => {
        // Toggle the 'show' class to display or hide the dropdown content
        dropdownContent.classList.toggle('show');
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
        // Check if the click was not on the button itself
        if (!event.target.matches('#dropdown-btn')) {
            // If the dropdown is visible, hide it
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });


    // --- Objective 2: Modal Window Logic ---
    const openModalBtn = document.getElementById('modal-btn');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const modalOverlay = document.getElementById('modal-overlay');

    // Show the modal when the "Open Modal" button is clicked
    openModalBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
    });

    // Hide the modal when the "Close" button is clicked
    closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Hide the modal when the user clicks on the overlay (outside the modal content)
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });


    // --- Objective 3: Live Form Validation Logic ---
    const signupForm = document.getElementById('signup-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const successMessage = document.getElementById('success-message');

    // State to track validity of each field
    const formValidity = {
        isEmailValid: false,
        isPasswordValid: false
    };

    // Function to validate email format using a regular expression
    const validateEmail = () => {
        // Simple regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(emailInput.value)) {
            emailError.textContent = ''; // Clear error message
            formValidity.isEmailValid = true;
        } else {
            emailError.textContent = 'Please enter a valid email address.';
            formValidity.isEmailValid = false;
        }
        checkFormValidity();
    };

    // Function to validate password length
    const validatePassword = () => {
        if (passwordInput.value.length >= 8) {
            passwordError.textContent = ''; // Clear error message
            formValidity.isPasswordValid = true;
        } else {
            passwordError.textContent = 'Password must be 8+ characters.';
            formValidity.isPasswordValid = false;
        }
        checkFormValidity();
    };
    
    // Function to check overall form validity and enable/disable the submit button
    const checkFormValidity = () => {
        if (formValidity.isEmailValid && formValidity.isPasswordValid) {
            submitBtn.disabled = false; // Enable the button
        } else {
            submitBtn.disabled = true; // Keep it disabled
        }
    };

    // Add 'input' event listeners for real-time validation as the user types
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    // Handle form submission
    signupForm.addEventListener('submit', (event) => {
        // Prevent the default form submission behavior (which reloads the page)
        event.preventDefault();

        // Check one last time if the form is valid before showing success
        if (formValidity.isEmailValid && formValidity.isPasswordValid) {
            successMessage.textContent = 'Success! Your form has been submitted.';
            // Optionally, you could clear the form here
            // signupForm.reset(); 
            // submitBtn.disabled = true;
        }
    });

});