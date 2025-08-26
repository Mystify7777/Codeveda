// Helpers
function show(el){ el.hidden = false; }
function hide(el){ el.hidden = true; }
function setExpanded(btn, expanded){
  btn.setAttribute('aria-expanded', String(expanded));
  const chev = btn.querySelector('.chevron');
  if (chev) chev.style.transform = expanded
      ? 'translateY(-50%) rotate(225deg)'
      : 'translateY(-50%) rotate(45deg)';
}

// Dropdown
const dropdownBtn = document.getElementById('dropdownBtn');
const dropdownContent = document.getElementById('dropdownContent');
dropdownBtn.addEventListener('click', () => {
  const willOpen = dropdownContent.hasAttribute('hidden');
  if (willOpen){
    show(dropdownContent);
    requestAnimationFrame(() => dropdownContent.classList.add('show'));
  } else {
    dropdownContent.classList.remove('show');
    dropdownContent.addEventListener('transitionend', function onEnd(e){
      if (e.propertyName === 'max-height'){
        hide(dropdownContent);
        dropdownContent.removeEventListener('transitionend', onEnd);
      }
    });
  }
  setExpanded(dropdownBtn, willOpen);
});

// Modal
const openModalBtn = document.getElementById('openModal');
const closeModalBtn = document.getElementById('closeModal');
const modalOverlay  = document.getElementById('modalOverlay');
let lastFocused = null;

function openModal(){
  lastFocused = document.activeElement;
  show(modalOverlay);
  closeModalBtn.focus();
  document.addEventListener('keydown', onEsc);
}
function closeModal(){
  hide(modalOverlay);
  if (lastFocused) lastFocused.focus();
  document.removeEventListener('keydown', onEsc);
}
function onEsc(e){ if (e.key === 'Escape') closeModal(); }
openModalBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e)=>{ if(e.target===modalOverlay) closeModal(); });

// Form validation
const form = document.getElementById('signupForm');
const email = document.getElementById('email');
const pass = document.getElementById('password');
const emailErr = document.getElementById('emailError');
const passErr = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const successMsg = document.getElementById('successMsg');
let emailValid=false, passValid=false;

const emailRegex=/^[^ ]+@[^ ]+\.[a-z]{2,}$/i;
email.addEventListener('input', ()=>{
  emailValid=emailRegex.test(email.value);
  if(emailValid){ emailErr.textContent=''; email.classList.add('valid'); email.classList.remove('invalid'); }
  else{ emailErr.textContent='Please enter a valid email.'; email.classList.add('invalid'); email.classList.remove('valid'); }
  toggle();
});
pass.addEventListener('input', ()=>{
  passValid=pass.value.length>=8;
  if(passValid){ passErr.textContent=''; pass.classList.add('valid'); pass.classList.remove('invalid'); }
  else{ passErr.textContent='Password must be 8+ characters.'; pass.classList.add('invalid'); pass.classList.remove('valid'); }
  toggle();
});
function toggle(){ submitBtn.disabled=!(emailValid&&passValid); }

form.addEventListener('submit', e=>{
  e.preventDefault();
  if(!(emailValid&&passValid)){
    form.style.animation='shake .35s';
    form.addEventListener('animationend', ()=> form.style.animation='', {once:true});
    return;
  }
  successMsg.hidden=false;
  form.reset();
  submitBtn.disabled=true;
  email.classList.remove('valid','invalid');
  pass.classList.remove('valid','invalid');
  emailValid=passValid=false;
});
