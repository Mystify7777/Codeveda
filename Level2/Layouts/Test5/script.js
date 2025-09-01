document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Image Data and Gallery Population (Unchanged) ---
  const imageData = [ { src: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?q=80&w=600&h=400&fit=crop', alt: 'Wooden Pier', caption: 'Morning Calm' }, { src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&h=900&fit=crop', alt: 'Lakeside View', caption: 'Lakeside View' }, { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800&fit=crop', alt: 'Forest Path', caption: 'Enchanted Forest' }, { src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=800&fit=crop', alt: 'Beach Sunset', caption: 'Golden Sunset' }, { src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=800&fit=crop', alt: 'Starry Night', caption: 'Starry Night' }, { src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=800&h=1200&fit=crop', alt: 'Waterfall', caption: 'Hidden Waterfall' }, { src: 'https://picsum.photos/id/1015/800/600', alt: 'Mountain View', caption: 'Mountain View' }, { src: 'https://picsum.photos/id/1016/800/600', alt: 'Forest path', caption: 'Forest Path' }, { src: 'https://picsum.photos/id/1024/800/600', alt: 'Dog in nature', caption: 'Dog in Nature' }, { src: 'https://picsum.photos/id/1035/800/1000', alt: 'Waterfall', caption: 'Waterfall' }, { src: 'https://picsum.photos/id/1040/800/600', alt: 'Sunset beach', caption: 'Sunset Beach' }, { src: 'https://picsum.photos/id/1043/800/600', alt: 'City skyline', caption: 'City Skyline' } ];
  const galleryContainer = document.querySelector('.photo-gallery');
  function populateGallery() { imageData.forEach(item => { const galleryItem = document.createElement('div'); galleryItem.className = 'gallery-item'; const img = document.createElement('img'); img.src = "https://via.placeholder.com/150/111827/808080?text=Loading..."; img.setAttribute('data-src', item.src); img.alt = item.alt; img.loading = 'lazy'; const caption = document.createElement('div'); caption.className = 'caption'; caption.textContent = item.caption; galleryItem.appendChild(img); galleryItem.appendChild(caption); galleryContainer.appendChild(galleryItem); }); }
  populateGallery();

  // --- 2. Initialize App Features ---
  const header = document.querySelector('.main-header');
  const backToTopButton = document.getElementById('back-to-top');
  const menuToggle = document.querySelector('.menu-toggle');

  // --- NEW: Mobile Navigation Toggle ---
  menuToggle.addEventListener('click', () => {
    header.classList.toggle('nav-open');
  });

  // --- Sticky Navbar & Back-to-Top Button Logic (Unchanged) ---
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    backToTopButton.classList.toggle('visible', window.scrollY > 400);
  });
  backToTopButton.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // --- Image Lazy Loading (Unchanged) ---
  const lazyImages = document.querySelectorAll('img[data-src]');
  const lazyLoad = target => { const io = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; img.src = img.dataset.src; img.onload = () => img.classList.add('loaded'); observer.disconnect(); } }); }); io.observe(target); };
  lazyImages.forEach(lazyLoad);

  // --- Lightbox Functionality (Unchanged) ---
  const galleryItems = document.querySelectorAll('.photo-gallery .gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.lightbox .close');
  const prevBtn = document.querySelector('.lightbox .prev');
  const nextBtn = document.querySelector('.lightbox .next');
  let currentIndex = 0;
  function openLightbox(index) { currentIndex = index; updateLightboxContent(); lightbox.classList.add('visible'); }
  function closeLightbox() { lightbox.classList.remove('visible'); }
  function updateLightboxContent() { const img = galleryItems[currentIndex]; lightboxImg.style.opacity = '0'; setTimeout(() => { lightboxImg.src = img.src; lightboxCaption.textContent = img.alt; lightboxImg.style.opacity = '1'; }, 200); }
  function showNext() { currentIndex = (currentIndex + 1) % galleryItems.length; updateLightboxContent(); }
  function showPrev() { currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length; updateLightboxContent(); }
  galleryItems.forEach((img, index) => { img.addEventListener('click', () => openLightbox(index)); });
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (lightbox.classList.contains('visible')) { if (e.key === 'ArrowRight') showNext(); if (e.key === 'ArrowLeft') showPrev(); if (e.key === 'Escape') closeLightbox(); } });
});