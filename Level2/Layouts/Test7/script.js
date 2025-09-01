document.addEventListener('DOMContentLoaded', () => {
  const imageData = [
    { src: 'https://picsum.photos/id/1015/600/400', alt:'Mountain View', caption:'Mountain View' },
    { src: 'https://picsum.photos/id/1016/600/400', alt:'Forest Path', caption:'Forest Path' },
    { src: 'https://picsum.photos/id/1024/600/400', alt:'Dog in Nature', caption:'Dog in Nature' },
    { src: 'https://picsum.photos/id/1035/600/400', alt:'Cascading Falls', caption:'Cascading Falls' },
    { src: 'https://picsum.photos/id/1040/600/400', alt:'Sunset Beach', caption:'Sunset Beach' },
    { src: 'https://picsum.photos/id/1015/600/400', alt:'Mountain View', caption:'Mountain View' },
    { src: 'https://picsum.photos/id/1016/600/400', alt:'Forest Path', caption:'Forest Path' },
    { src: 'https://picsum.photos/id/1024/600/400', alt:'Dog in Nature', caption:'Dog in Nature' },
    { src: 'https://picsum.photos/id/1035/600/400', alt:'Cascading Falls', caption:'Cascading Falls' },
    { src: 'https://picsum.photos/id/1040/600/400', alt:'Sunset Beach', caption:'Sunset Beach' },
    { src: 'https://picsum.photos/id/1043/600/400', alt:'City Skyline', caption:'City Skyline' }
  ];

  const gallery = document.getElementById('photo-gallery');

  imageData.forEach(item => {
    const fig = document.createElement('figure');
    fig.className = 'gallery-item';

    const img = document.createElement('img');
    img.alt = item.alt || '';
    img.loading = 'lazy';
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; // placeholder
    img.dataset.src = item.src;

    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = item.caption;

    fig.appendChild(img);
    fig.appendChild(cap);
    gallery.appendChild(fig);
  });

  // Lazy load images
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const real = img.dataset.src;
      if (real) {
        img.src = real;
        img.onload = () => img.classList.add('loaded');
        img.removeAttribute('data-src');
      }
      io.unobserve(img);
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('.gallery-item img').forEach(img => io.observe(img));

  // Navbar scroll + back to top
  const header = document.querySelector('.main-header');
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('visible', y > 400);
  });
  backToTop.addEventListener('click', e => {
    e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' });
  });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbSpinner = document.getElementById('lbSpinner');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');
  const thumbs = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentIndex = 0;

  function showSpinner(on){ lbSpinner.classList.toggle('show', on); }
  function openLightbox(i){
    currentIndex = i;
    lightbox.setAttribute('aria-hidden','false');
    showSpinner(true);
    const thumb = thumbs[i];
    const big = thumb.dataset.large || thumb.src;
    const pre = new Image();
    pre.src = big;
    pre.onload = () => {
      lbImage.src = pre.src;
      lbImage.alt = thumb.alt;
      lbCaption.textContent = thumb.alt;
      lbImage.classList.add('show');
      showSpinner(false);
    };
  }
  function closeLightbox(){ lightbox.setAttribute('aria-hidden','true'); lbImage.classList.remove('show'); }
  function showNext(){ openLightbox((currentIndex+1)%thumbs.length); }
  function showPrev(){ openLightbox((currentIndex-1+thumbs.length)%thumbs.length); }

  thumbs.forEach((t,i)=> t.addEventListener('click',()=> openLightbox(i)));
  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLightbox(); });
  document.addEventListener('keydown', e=>{
    if(lightbox.getAttribute('aria-hidden')==='false'){
      if(e.key==='Escape') closeLightbox();
      if(e.key==='ArrowRight') showNext();
      if(e.key==='ArrowLeft') showPrev();
    }
  });
});
