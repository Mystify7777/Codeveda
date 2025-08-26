// ===============================
// JavaScript Interactivity + UX
// ===============================

// Helper: toggle attribute-hidden consistently
function show(el){ el.hidden = false; }
function hide(el){ el.hidden = true; }

// Helper: manage ARIA expanded + chevron rotation
function setExpanded(btn, expanded){
  btn.setAttribute('aria-expanded', String(expanded));
  const chev = btn.querySelector('.chevron');
  if (chev) chev.style.transform = expanded ? 'translateY(-50%) rotate(225deg)' : 'translateY(-50%) rotate(45deg)';
}

// Section reveal on scroll
const revealItems = document.querySelectorAll('[data-animate]');
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(el => io.observe(el));

// 1) Dropdown Toggle -----------------------------------------
const dropdownBtn = document.getElementById('dropdownBtn');
const dropdownContent = document.getElementById('dropdownContent');

dropdownBtn.addEventListener('click', () => {
  const willOpen = dropdownContent.hasAttribute('hidden');
  // First show (so transitions can apply), then add .show for height/opacity animation
  if (willOpen){
    show(dropdownContent);
    requestAnimationFrame(() => dropdownContent.classList.add('show'));
  } else {
    dropdownContent.classList.remove('show');
    // wait for transition to finish then hide for a11y
    dropdownContent.addEventListener('transitionend', function onEnd(e){
      if (e.propertyName === 'max-height'){
        hide(dropdownContent);
        dropdownContent.removeEventListener('transitionend', onEnd);
      }
    });
  }
  setExpanded(dropdownBtn, willOpen);
});

// 2) Modal Window ---------------------------------------------
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay  = document.getElementById('modalOverlay');
const modalDialog   = modalOverlay.querySelector('.modal');

// Keep track of last focused element to restore on close
let lastFocused = null;

function openModal(){
  lastFocused = document.activeElement;
  show(modalOverlay);
  // Move focus to close button
  closeModalBtn.focus({ preventScroll: true });
  // Add small guard to ensure animations apply
  modalOverlay.style.animation = 'fadeIn .22s ease forwards';
  modalDialog.style.animation  = 'scaleIn .18s ease forwards';
  // Start focus trap
  document.addEventListener('keydown', trapFocus);
  document.addEventListener('keydown', onEscClose);
}

function closeModal(){
  hide(modalOverlay);
  // End focus trap
  document.removeEventListener('keydown', trapFocus);
  document.removeEventListener('keydown', onEscClose);
  // Restore focus
  if (lastFocused) lastFocused.focus({ preventScroll: true });
}

function onEscClose(e){
  if (e.key === 'Escape') closeModal();
}

// Basic focus trap within modal
function trapFocus(e){
  if (!modalOverlay.hidden && e.key === 'Tab'){
    const focusables = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const list = Array.from(focusables).filter(el => !el.hasAttribute('disabled'));
    if (!list.length) return;
    const first = list[0];
    const last  = list[list.length - 1];

    if (e.shiftKey && document.activeElement === first){
      last.focus(); e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last){
      first.focus(); e.preventDefault();
    }
  }
}

openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);

// Close when clicking overlay background
modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) closeModal();
});

// 3) Form Validation ------------------------------------------
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError    = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const submitBtn     = document.getElementById('submitBtn');
const signupForm    = document.getElementById('signupForm');
const successMsg    = document.getElementById('successMsg');

let emailValid = false;
let passwordValid = false;

// More robust email regex (still beginner-friendly)
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// Validate on input
emailInput.addEventListener('input', () => {
  emailValid = emailPattern.test(emailInput.value.trim());
  if (emailValid){
    emailError.textContent = '';
    emailInput.classList.remove('invalid'); emailInput.classList.add('valid');
  } else {
    emailError.textContent = 'Please enter a valid email address';
    emailInput.classList.remove('valid'); emailInput.classList.add('invalid');
  }
  toggleSubmit();
});

passwordInput.addEventListener('input', () => {
  passwordValid = passwordInput.value.length >= 8;
  if (passwordValid){
    passwordError.textContent = '';
    passwordInput.classList.remove('invalid'); passwordInput.classList.add('valid');
  } else {
    passwordError.textContent = 'Password must be 8+ characters';
    passwordInput.classList.remove('valid'); passwordInput.classList.add('invalid');
  }
  toggleSubmit();
});

function toggleSubmit(){
  submitBtn.disabled = !(emailValid && passwordValid);
}

// Handle submit
signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // If somehow reached with invalid (keyboard nav, etc.), give a quick shake hint
  if (!(emailValid && passwordValid)){
    signupForm.style.animation = 'shake .35s';
    signupForm.addEventListener('animationend', () => signupForm.style.animation = '', { once: true });
    return;
  }

  // "Success" path
  successMsg.hidden = false;
  successMsg.textContent = '✅ Form submitted successfully!';
  signupForm.reset();
  submitBtn.disabled = true;

  // Reset visuals
  emailInput.classList.remove('valid', 'invalid');
  passwordInput.classList.remove('valid', 'invalid');
  emailError.textContent = '';
  passwordError.textContent = '';
  emailValid = false; passwordValid = false;
});

// Keyboard niceties: Enter on dropdown button toggles; Esc closes modal handled above
dropdownBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' '){
    e.preventDefault();
    dropdownBtn.click();
  }
});
