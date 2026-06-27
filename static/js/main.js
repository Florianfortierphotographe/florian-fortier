/* ============================================
   SLIDER HERO
   ============================================ */
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startTimer() {
    timer = setInterval(next, 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(i);
      startTimer();
    });
  });

  slides[0].classList.add('active');
  dots[0]?.classList.add('active');
  startTimer();
}

/* ============================================
   MENU BURGER MOBILE
   ============================================ */
function initBurger() {
  const burger = document.getElementById('burger');
  const navGroup = document.querySelector('.nav-group');
  const closeBtn = document.getElementById('burger-close');
  if (!burger || !navGroup) return;

 function openMenu() {
  navGroup.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

}

  function closeMenu() {
    navGroup.classList.remove('open');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navGroup.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (navGroup.classList.contains('open') &&
        !burger.contains(e.target) &&
        !navGroup.contains(e.target)) {
      closeMenu();
    }
  });
}

/* ============================================
   LIGHTBOX
   ============================================ */
let lightboxImages = [];
let lightboxIndex = 0;

function openLightbox(images, index) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightboxImages = images;
  lightboxIndex = index;

  const img = lightbox.querySelector('img');
  img.src = lightboxImages[lightboxIndex].src;
  img.alt = lightboxImages[lightboxIndex].alt;

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNext() {
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  const img = document.querySelector('#lightbox img');
  img.src = lightboxImages[lightboxIndex].src;
  img.alt = lightboxImages[lightboxIndex].alt;
}

function lightboxPrev() {
  lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  const img = document.querySelector('#lightbox img');
  img.src = lightboxImages[lightboxIndex].src;
  img.alt = lightboxImages[lightboxIndex].alt;
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', lightboxPrev);
  lightbox.querySelector('.lightbox-next').addEventListener('click', lightboxNext);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });

  const items = document.querySelectorAll('.portfolio-item img');
  if (items.length) {
    const images = Array.from(items).map(img => ({ src: img.src, alt: img.alt }));
    items.forEach((img, i) => {
      img.parentElement.addEventListener('click', () => openLightbox(images, i));
    });
  }
}

/* ============================================
   CAROUSEL GALERIE
   ============================================ */
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-track-container');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const items = document.querySelectorAll('.carousel-item');

  const popup = document.getElementById('gallery-popup');
  const popupImg = document.getElementById('gallery-popup-img');
  const thumbsContainer = document.getElementById('gallery-popup-thumbs');
  const popupClose = document.getElementById('gallery-popup-close');
  const popupPrev = document.getElementById('gallery-popup-prev');
  const popupNext = document.getElementById('gallery-popup-next');

  if (!track || !items.length || !popup) return;

  let isPaused = false;
  let isDown = false;
  let startX;
  let scrollLeftStart;
  let dragDistance = 0;

  let photos = [];
  let currentIndex = 0;

  items.forEach(item => {
    const img = item.querySelector('img');
    img.setAttribute('draggable', 'false');
    img.addEventListener('dragstart', e => e.preventDefault());
  });

  photos = Array.from(items).map(item => {
    const img = item.querySelector('img');
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || ''
    };
  });

  function showPopupPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    popupImg.src = photos[currentIndex].src;
    popupImg.alt = photos[currentIndex].alt;

    const thumbs = thumbsContainer.querySelectorAll('.projet-popup-thumb');
    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentIndex);
    });

    const activeThumb = thumbsContainer.querySelector('.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }

  function openGalleryPopup(startIndex = 0) {
    thumbsContainer.innerHTML = '';

    photos.forEach((photo, i) => {
      const thumb = document.createElement('img');
      thumb.src = photo.src;
      thumb.alt = photo.alt;
      thumb.classList.add('projet-popup-thumb');
      thumb.addEventListener('click', () => showPopupPhoto(i));
      thumbsContainer.appendChild(thumb);
    });

    showPopupPhoto(startIndex);
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGalleryPopup() {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      if (dragDistance < 5) openGalleryPopup(i);
      dragDistance = 0;
    });
  });

  function getScrollAmount() {
    return items[0].offsetWidth + 8;
  }

  function scrollNext() {
    container.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  }

  function scrollPrev() {
    container.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  }

  nextBtn?.addEventListener('click', scrollNext);
  prevBtn?.addEventListener('click', scrollPrev);

  prevBtn?.addEventListener('mouseenter', () => { isPaused = true; });
  prevBtn?.addEventListener('mouseleave', () => { isPaused = false; });
  nextBtn?.addEventListener('mouseenter', () => { isPaused = true; });
  nextBtn?.addEventListener('mouseleave', () => { isPaused = false; });

  container.addEventListener('mouseenter', () => { isPaused = true; });
  container.addEventListener('mouseleave', () => {
    isPaused = false;
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousedown', e => {
    isDown = true;
    isPaused = true;
    dragDistance = 0;
    startX = e.pageX - container.offsetLeft;
    scrollLeftStart = container.scrollLeft;
    container.style.cursor = 'grabbing';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
    isPaused = false;
  });

  container.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    dragDistance = Math.abs(walk);
    container.scrollLeft = scrollLeftStart - walk;
  });

  popupClose?.addEventListener('click', closeGalleryPopup);
  popupPrev?.addEventListener('click', () => showPopupPhoto(currentIndex - 1));
  popupNext?.addEventListener('click', () => showPopupPhoto(currentIndex + 1));

  popup.addEventListener('click', e => {
    if (e.target === popup) closeGalleryPopup();
  });

  document.addEventListener('keydown', e => {
    if (!popup.classList.contains('open')) return;
    if (e.key === 'Escape') closeGalleryPopup();
    if (e.key === 'ArrowLeft') showPopupPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPopupPhoto(currentIndex + 1);
  });

  setInterval(() => {
    if (!isPaused && !isDown && !popup.classList.contains('open')) {
      container.scrollLeft += 1;
      if (container.scrollLeft >= track.scrollWidth - container.offsetWidth) {
        container.scrollLeft = 0;
      }
    }
  }, 16);
}

/* ============================================
   POPUP PROJET
   ============================================ */
function initProjetPopup() {
  const popup = document.getElementById('projet-popup');
  if (!popup) return;

  const popupImg = document.getElementById('projet-popup-img');
  const thumbsContainer = popup.querySelector('.projet-popup-thumbs');
  const closeBtn = popup.querySelector('.projet-popup-close');
  const prevBtn = popup.querySelector('.projet-popup-prev');
  const nextBtn = popup.querySelector('.projet-popup-next');
  const btns = document.querySelectorAll('.voir-plus-btn');

  let photos = [];
  let currentIndex = 0;

  function showPhoto(index) {
    currentIndex = (index + photos.length) % photos.length;
    popupImg.src = photos[currentIndex];

    const thumbs = thumbsContainer.querySelectorAll('.projet-popup-thumb');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === currentIndex);
    });

    const activeThumb = thumbsContainer.querySelector('.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function openPopup(photosArray, titre) {
    photos = photosArray;
    currentIndex = 0;

    thumbsContainer.innerHTML = '';
    photos.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = titre;
      img.classList.add('projet-popup-thumb');
      img.addEventListener('click', () => showPhoto(i));
      thumbsContainer.appendChild(img);
    });

    showPhoto(0);
    popup.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.classList.remove('open');
    document.body.style.overflow = '';
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const photos = JSON.parse(btn.dataset.photos);
      const titre = btn.dataset.titre;
      openPopup(photos, titre);
    });
  });

  closeBtn?.addEventListener('click', closePopup);
  prevBtn?.addEventListener('click', () => showPhoto(currentIndex - 1));
  nextBtn?.addEventListener('click', () => showPhoto(currentIndex + 1));

  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (!popup.classList.contains('open')) return;
    if (e.key === 'Escape') closePopup();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
}

/* ============================================
   INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initBurger();
  initLightbox();
  if (document.querySelector('.carousel-track')) initCarousel();
  if (document.getElementById('projet-popup')) initProjetPopup();
});