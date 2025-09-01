document.addEventListener('DOMContentLoaded', () => {
  const imageData = [
    { src: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=800&fit=crop', alt:'Morning Calm', caption:'Morning Calm' },
    { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&fit=crop', alt:'Lakeside View', caption:'Lakeside View' },
    { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&fit=crop', alt:'Enchanted Forest', caption:'Enchanted Forest' },
    { src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=800&fit=crop', alt:'Golden Sunset', caption:'Golden Sunset' },
    { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&fit=crop', alt:'Starry Night', caption:'Starry Night' },
    { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800&fit=crop', alt:'Hidden Waterfall', caption:'Hidden Waterfall' },
    { src: 'https://picsum.photos/id/1015/800/600', alt:'Mountain View', caption:'Mountain View' },
    { src: 'https://picsum.photos/id/1016/800/600', alt:'Forest Path', caption:'Forest Path' },
    { src: 'https://picsum.photos/id/1024/800/600', alt:'Dog in Nature', caption:'Dog in Nature' },
    { src: 'https://picsum.photos/id/1035/800/1000', alt:'Cascading Falls', caption:'Cascading Falls' },
    { src: 'https://picsum.photos/id/1040/800/600', alt:'Sunset Beach', caption:'Sunset Beach' },
    { src: 'https://picsum.photos/id/1043/800/600', alt:'City Skyline', caption:'City Skyline' }
  ];

  const gallery = document.getElementById('photo-gallery');

  function makeLarge(src){
    if (src.includes('images.unsplash.com')) {
      if (src.includes('w=')) return src.replace(/w=\d+/, 'w=1600');
      return src + (src.includes('?') ? '&' : '?') + 'w=1600';
    }
    if (src.includes('picsum.photos')) return src.replace(/\/\d+\/\d+/, '/1600/1000');
    return src;
  }

  imageData.forEach((item, idx) => {
    const fig = document.createElement('figure');
    fig.className = 'gallery-item';
    fig.style.transitionDelay = `${Math.min(idx * 30, 380)}ms`;

    const img = document.createElement('img');
    img.alt = item.alt || '';
    img.loading = 'lazy';
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; // tiny placeholder
    img.setAttribute('data-src', item.src);
    img.setAttribute('data-large', makeLarge(item.src));
    
    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = item.caption || item.alt || '';
    
    fig.appendChild(img);
    fig.appendChild(cap);
    gallery.appendChild(fig);
  });

  const items = gallery.querySelectorAll('.gallery-item');
  const ioOptions = { rootMargin: '200px 0px', threshold: 0.01 };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const item = entry.target;
      const img = item.querySelector('img');
      const realSrc = img.getAttribute('data-src');

      if (realSrc) {
        img.src = realSrc;
        img.onload = () => {
          img.classList.add('loaded');
          item.classList.add('revealed');
        };
        img.onerror = () => { // Also reveal if image fails to load
          item.classList.add('revealed');
        };
        img.removeAttribute('data-src');
      }
      io.unobserve(item);
    });
  }, ioOptions);

  items.forEach(item => io.observe(item));

  // --- All other functionality remains the same ---
  const header = document.querySelector('.main-header');
  const backToTop = document.getElementById('back-to-top');
  function scrollUI(){
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('visible', y > 400);
  }
  window.addEventListener('scroll', scrollUI);
  scrollUI();
  backToTop.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' }); });

  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobileNav.classList.toggle('open');
    mobileNav.setAttribute('aria-hidden', String(expanded));
  });
  mobileNav.addEventListener('click', (e) => {
    if (e.target.matches('a')) { mobileNav.classList.remove('open'); mobileNav.setAttribute('aria-hidden', 'true'); hamburger.setAttribute('aria-expanded','false'); }
  });

  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbSpinner = document.getElementById('lbSpinner');
  const lbClose = document.querySelector('.lb-close');
  const lbPrev = document.querySelector('.lb-prev');
  const lbNext = document.querySelector('.lb-next');
  const thumbs = Array.from(document.querySelectorAll('.gallery-item img'));
  let currentIndex = 0;

  function showSpinner(on){
    lbSpinner.classList.toggle('show', !!on);
    lbSpinner.setAttribute('aria-hidden', on ? 'false' : 'true');
  }

  function openLightbox(index){
    currentIndex = index;
    lightbox.setAttribute('aria-hidden','false');
    showSpinner(true);
    lbImage.classList.remove('show');
    const thumb = thumbs[currentIndex];
    const big = thumb.getAttribute('data-large') || thumb.src;
    const pre = new Image();
    pre.src = big;
    pre.alt = thumb.alt || '';
    pre.onload = () => {
      lbImage.src = pre.src;
      lbImage.alt = pre.alt;
      lbCaption.textContent = thumb.alt || '';
      requestAnimationFrame(() => { showSpinner(false); lbImage.classList.add('show'); });
    };
    pre.onerror = () => {
      lbImage.src = thumb.src;
      lbImage.alt = thumb.alt || '';
      lbCaption.textContent = thumb.alt || '';
      showSpinner(false);
      lbImage.classList.add('show');
    };
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
  }

  function showNext(){ openLightbox((currentIndex + 1) % thumbs.length); }
  function showPrev(){ openLightbox((currentIndex - 1 + thumbs.length) % thumbs.length); }

  thumbs.forEach((t, i) => { t.style.cursor = 'zoom-in'; t.addEventListener('click', () => openLightbox(i)); });
  lbClose.addEventListener('click', closeLightbox);
  lbNext.addEventListener('click', showNext);
  lbPrev.addEventListener('click', showPrev);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    }
  });
});