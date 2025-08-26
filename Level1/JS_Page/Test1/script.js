// ===============================
// JavaScript Interactivity
// ===============================

// 1. Dropdown Toggle
const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownContent = document.getElementById("dropdownContent");

dropdownBtn.addEventListener("click", () => {
  dropdownContent.classList.toggle("hidden");
});

// 2. Modal Window
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");

openModalBtn.addEventListener("click", () => {
  modalOverlay.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

// Close modal if clicking outside the modal box
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
  }
});

// 3. Form Validation
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const submitBtn = document.getElementById("submitBtn");
const signupForm = document.getElementById("signupForm");
const successMsg = document.getElementById("successMsg");

let emailValid = false;
let passwordValid = false;

// Email validation (basic regex)
emailInput.addEventListener("input", () => {
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (emailInput.value.match(emailPattern)) {
    emailError.textContent = "";
    emailValid = true;
  } else {
    emailError.textContent = "Please enter a valid email address";
    emailValid = false;
  }
  toggleSubmit();
});

// Password validation
passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length >= 8) {
    passwordError.textContent = "";
    passwordValid = true;
  } else {
    passwordError.textContent = "Password must be 8+ characters";
    passwordValid = false;
  }
  toggleSubmit();
});

// Enable/disable submit button
function toggleSubmit() {
  submitBtn.disabled = !(emailValid && passwordValid);
}

// Handle form submission
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  successMsg.classList.remove("hidden");
  signupForm.reset();
  submitBtn.disabled = true;
  emailValid = false;
  passwordValid = false;
});
