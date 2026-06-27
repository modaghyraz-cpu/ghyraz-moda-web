// GHYRAZ MODA — main.js (index)
'use strict';

const BASE = 'https://ghyraz-moda-tienda.netlify.app';
const PRODUCTS = [
  { id:'almendra', name:'Almendra', imgs:['almendra-1.jpeg','almendra-2.jpeg','almendra-3.jpeg'] },
  { id:'angel',    name:'Angel',    imgs:['angel-1.jpeg','angel-2.jpeg','angel-3.jpeg','angel-4.jpeg'] },
  { id:'caeli',    name:'Caeli',    imgs:['caeli-1.jpeg','caeli-2.jpeg','caeli-3.jpeg'] },
  { id:'fabia',    name:'Fabia',    imgs:['fabia-1.jpeg','fabia-2.jpeg','fabia-3.jpeg'] },
  { id:'marce',    name:'Marce',    imgs:['marce-1.jpeg','marce-2.jpeg','marce-3.jpeg','marce-4.jpeg'] },
  { id:'paola',    name:'Paola',    imgs:['paola-1.jpeg','paola-2.jpeg','paola-3.jpeg'] },
  { id:'princesa', name:'Princesa', imgs:['princesa-1.jpeg','princesa_2.jpeg','princesa-3.jpeg'] },
  { id:'sofia',    name:'Sofia',    imgs:['sofia-1.jpeg','sofia-2.jpeg','sofis-3.jpeg'] },
  { id:'sujey',    name:'Sujey',    imgs:['sujey-1.jpeg','sujey-2.jpeg','sujey-3.jpeg','sujey-4.jpeg'] },
  { id:'vanesa',   name:'Vanesa',   imgs:['vanesa-1.jpeg','vanesa-2.jpeg','vanesa-3.jpeg'] },
];

// ── Hero Carousel ───────────────────────────────────────────
(function initCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots   = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;

  slides.forEach((s, i) => s.classList.toggle('active', i === 0));
  dots.forEach((d, i)   => d.classList.toggle('active', i === 0));

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function startAuto() { timer = setInterval(next, 4500); }
  function stopAuto()  { clearInterval(timer); }

  document.querySelector('.carousel-arrow.next')?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  document.querySelector('.carousel-arrow.prev')?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Touch swipe
  const hero = document.querySelector('.hero');
  let touchStartX = 0;
  hero?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) { stopAuto(); delta > 0 ? next() : prev(); startAuto(); }
  });

  startAuto();
})();

// ── Header scroll shadow ────────────────────────────────────
(function initHeader() {
  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── Hamburger mobile menu ───────────────────────────────────
(function initMobileMenu() {
  const btn  = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-nav');
  btn?.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
  }));
})();

// ── Product grid render (enlaces → página de producto) ──────
(function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  PRODUCTS.forEach(p => {
    const url1 = `${BASE}/${p.id}/${p.imgs[0]}`;
    const url2 = `${BASE}/${p.id}/${p.imgs[1] || p.imgs[0]}`;

    const card = document.createElement('a');
    card.href      = `producto.html?id=${p.id}`;
    card.className = 'product-card';
    card.setAttribute('aria-label', `Ver TOP RIB ${p.name}`);
    card.innerHTML = `
      <div class="product-card__image-wrap">
        <img class="product-card__img primary"   src="${url1}" alt="TOP RIB ${p.name} — vista 1" loading="lazy">
        <img class="product-card__img secondary" src="${url2}" alt="TOP RIB ${p.name} — vista 2" loading="lazy">
        <span class="product-card__badge">Nuevo</span>
        <span class="product-card__quick">Ver detalle →</span>
      </div>
      <div class="product-card__info">
        <p class="product-card__name">TOP RIB ${p.name.toUpperCase()}</p>
        <p class="product-card__meta">Top rib · Fit ajustado</p>
        <p class="product-card__price">S/ 30</p>
      </div>`;

    grid.appendChild(card);
  });
})();
