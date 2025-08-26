// Feather Icons
feather.replace();

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuBtn.addEventListener('click',()=> mobileMenu.classList.toggle('hidden'));

// Header Scroll Effect
const header=document.getElementById('header');
window.addEventListener('scroll',()=>{
  if(window.scrollY>50){
    header.classList.add('bg-slate-900/80','backdrop-blur-sm','shadow-lg');
  } else {
    header.classList.remove('bg-slate-900/80','backdrop-blur-sm','shadow-lg');
  }
});

// Typing Effect
const typingText=document.getElementById('typing-text');
const roles=["Full-Stack Developer","Problem Solver","SIH Finalist"];
let roleIndex=0,charIndex=0,isDeleting=false;
function type(){
  const role=roles[roleIndex];
  typingText.textContent=isDeleting?role.substring(0,charIndex-1):role.substring(0,charIndex+1);
  charIndex+=isDeleting?-1:1;
  if(!isDeleting&&charIndex===role.length){setTimeout(()=>isDeleting=true,1500);}
  else if(isDeleting&&charIndex===0){isDeleting=false;roleIndex=(roleIndex+1)%roles.length;}
  setTimeout(type,isDeleting?80:120);
}
document.addEventListener('DOMContentLoaded',type);

// Scroll Reveal Animations
const revealEls=document.querySelectorAll('.fade-in,.fade-up');
window.addEventListener('scroll',()=>{
  revealEls.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight-100) el.classList.add('show');
  });
});
