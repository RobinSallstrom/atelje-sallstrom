/* ============================================
   Ateljé Sällström — Main JavaScript
   ============================================ */

// Web3Forms access key — get yours at https://web3forms.com (free, takes a minute).
// Both the contact form and the newsletter form use this key.
const WEB3FORMS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

document.addEventListener('DOMContentLoaded', () => {

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Lucide icons (script is deferred; runs before DOMContentLoaded) ---
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // --- Navigation ---
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const navLinks = document.querySelector('.nav__links');

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      scrollTicking = false;
    });
  }, { passive: true });

  if (hamburger) {
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // --- Dynamic gallery (galleri.html) ---
  const dynamicGrid = document.querySelector('#gallery-grid[data-dynamic]');
  if (dynamicGrid && window.WORKS) {
    const frag = document.createDocumentFragment();
    window.WORKS.forEach(work => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gallery-item' + (work.size ? ' gallery-item--' + work.size : '');
      btn.dataset.artist = work.artist;
      btn.dataset.stem = work.stem;
      btn.setAttribute('aria-label', 'Visa ' + work.title + ' av ' + work.artistName);

      const img = document.createElement('img');
      img.src = 'images/opt/' + work.stem + '-800.webp';
      img.srcset = 'images/opt/' + work.stem + '-800.webp 800w, images/opt/' + work.stem + '-1600.webp 1600w';
      img.sizes = '(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw';
      img.alt = work.title + ' — ' + work.artistName + ', ' + work.medium.toLowerCase();
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = work.w;
      img.height = work.h;

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item__overlay';
      const h4 = document.createElement('h4');
      h4.textContent = work.title;
      const span = document.createElement('span');
      span.textContent = work.artistName + ' — ' + work.medium;
      overlay.append(h4, span);

      btn.append(img, overlay);
      frag.appendChild(btn);
    });
    dynamicGrid.appendChild(frag);
  }

  // --- Gallery Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;
      let shown = 0;
      galleryItems.forEach(item => {
        if (filter === 'alla' || item.dataset.artist === filter) {
          item.style.display = '';
          if (!reducedMotion) {
            item.style.animation = 'none';
            // Restart animation with a soft stagger
            void item.offsetWidth;
            item.style.animation = 'fadeInUp 0.45s ease ' + Math.min(shown * 0.04, 0.4) + 's backwards';
          }
          shown++;
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- Lightbox ---
  const lightbox = document.querySelector('.lightbox');
  if (lightbox && galleryItems.length) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const lightboxTitle = lightbox.querySelector('.lightbox__info h4');
    const lightboxArtist = lightbox.querySelector('.lightbox__info span');
    const lightboxInquiry = lightbox.querySelector('.lightbox__inquiry');
    const lightboxClose = lightbox.querySelector('.lightbox__close');
    const lightboxPrev = lightbox.querySelector('.lightbox__nav--prev');
    const lightboxNext = lightbox.querySelector('.lightbox__nav--next');

    let currentIndex = 0;
    let visibleItems = [];
    let lastFocused = null;

    const getVisibleItems = () =>
      Array.from(galleryItems).filter(item => item.style.display !== 'none');

    function updateLightbox() {
      const item = visibleItems[currentIndex];
      if (!item) return;
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-item__overlay h4');
      const artist = item.querySelector('.gallery-item__overlay span');

      // Prefer the large optimized version when available
      const stem = item.dataset.stem;
      const crossfade = !reducedMotion && lightboxImg.src;
      if (crossfade) lightboxImg.classList.add('is-switching');
      const apply = () => {
        lightboxImg.src = stem ? 'images/opt/' + stem + '-1600.webp' : img.currentSrc || img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.onload = () => lightboxImg.classList.remove('is-switching');
      };
      crossfade ? setTimeout(apply, 120) : apply();

      if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
      if (lightboxArtist && artist) lightboxArtist.textContent = artist.textContent;
      if (lightboxInquiry && title) {
        lightboxInquiry.href = 'kontakt.html?verk=' + encodeURIComponent(title.textContent);
      }
    }

    function openLightbox(index) {
      visibleItems = getVisibleItems();
      currentIndex = index;
      lastFocused = document.activeElement;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    const nextLightbox = () => { currentIndex = (currentIndex + 1) % visibleItems.length; updateLightbox(); };
    const prevLightbox = () => { currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length; updateLightbox(); };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const visItems = getVisibleItems();
        const visIndex = visItems.indexOf(item);
        openLightbox(visIndex >= 0 ? visIndex : 0);
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation + focus trap
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
      if (e.key === 'Tab') {
        const focusables = lightbox.querySelectorAll('button, a[href]');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }

  // --- Scroll reveal animations ---
  const fadeElements = document.querySelectorAll('.fade-in');
  if (reducedMotion) {
    fadeElements.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // --- Contact form (Web3Forms) ---
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    // Prefill subject from ?verk= (gallery inquiry link)
    const params = new URLSearchParams(window.location.search);
    const verk = params.get('verk');
    if (verk) {
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');
      if (subject) subject.value = 'Förfrågan: ' + verk;
      if (message && !message.value) {
        message.value = 'Hej! Jag är intresserad av verket "' + verk + '" och vill gärna veta mer.';
      }
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Skickar…';

      const data = new FormData(contactForm);
      data.append('access_key', WEB3FORMS_KEY);
      data.append('from_name', 'ateljesallstrom.se — kontaktformulär');
      if (!data.get('subject')) data.set('subject', 'Nytt meddelande via ateljesallstrom.se');

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then((res) => res.json())
        .then((json) => {
          if (!json.success) throw new Error(json.message || 'Form error');
          btn.textContent = 'Tack för ditt meddelande!';
          contactForm.reset();
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 4000);
        })
        .catch(() => {
          btn.textContent = 'Något gick fel — maila oss gärna direkt.';
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 4000);
        });
    });
  }

  // --- Newsletter form (footer, Web3Forms) ---
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');

      const data = new FormData(form);
      data.append('access_key', WEB3FORMS_KEY);
      data.append('from_name', 'ateljesallstrom.se — nyhetsbrev');
      data.append('subject', 'Ny prenumerant på nyhetsbrevet');

      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data })
        .then((res) => res.json())
        .then((json) => {
          if (!json.success) throw new Error(json.message || 'Form error');
          form.innerHTML = '<p class="newsletter-form__thanks">Tack! Vi hör av oss inför nästa vernissage.</p>';
        })
        .catch(() => { btn.textContent = 'Fel — försök igen'; });
    });
  });

});
