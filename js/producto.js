// GHYRAZ MODA — producto.js
'use strict';

const BASE_URL = 'https://ghyraz-moda-tienda.netlify.app';
const WA_LINK  = 'https://wa.me/51910120676';
const PRICE    = 30;

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

document.addEventListener('DOMContentLoaded', () => {
  // ── Leer parámetro de URL ──────────────────────────────────
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id')?.toLowerCase();
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    document.body.innerHTML = `<div style="padding:4rem;text-align:center;font-family:sans-serif">
      <h1>Producto no encontrado</h1>
      <a href="index.html" style="color:#D98A7A">← Volver al catálogo</a>
    </div>`;
    return;
  }

  // ── Título de la pestaña ───────────────────────────────────
  document.title = `TOP RIB ${product.name.toUpperCase()} — Ghyraz Moda`;

  // ── Galería ────────────────────────────────────────────────
  const mainImg    = document.getElementById('prod-main-img');
  const thumbsWrap = document.getElementById('prod-thumbs');
  let activeIdx = 0;

  function setActive(idx) {
    activeIdx = idx;
    mainImg.src = `${BASE_URL}/${product.id}/${product.imgs[idx]}`;
    mainImg.alt = `TOP RIB ${product.name} — imagen ${idx + 1}`;
    thumbsWrap.querySelectorAll('.prod-thumb').forEach((t, i) =>
      t.classList.toggle('active', i === idx));
  }

  product.imgs.forEach((img, i) => {
    const btn = document.createElement('button');
    btn.className = 'prod-thumb' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Ver imagen ${i + 1}`);
    btn.innerHTML = `<img src="${BASE_URL}/${product.id}/${img}" alt="" loading="lazy">`;
    btn.addEventListener('click', () => setActive(i));
    thumbsWrap.appendChild(btn);
  });

  setActive(0);

  // Flechas de galería
  document.getElementById('gallery-prev')?.addEventListener('click', () =>
    setActive((activeIdx - 1 + product.imgs.length) % product.imgs.length));
  document.getElementById('gallery-next')?.addEventListener('click', () =>
    setActive((activeIdx + 1) % product.imgs.length));

  // ── Rellenar info estática ─────────────────────────────────
  document.getElementById('prod-title').textContent    = `TOP RIB ${product.name.toUpperCase()}`;
  document.getElementById('prod-breadcrumb').textContent = product.name;

  // ── Cantidad ───────────────────────────────────────────────
  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });

  // ── Añadir al carrito ──────────────────────────────────────
  document.getElementById('btn-add-cart')?.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value) || 1;
    GhyrazCart.add({
      id:    product.id,
      name:  product.name,
      price: PRICE,
      img:   `${BASE_URL}/${product.id}/${product.imgs[0]}`,
    }, qty);

    // Feedback visual
    const btn = document.getElementById('btn-add-cart');
    btn.textContent = '✓ Agregado';
    btn.style.background = '#7aad8a';
    setTimeout(() => {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> AÑADIR AL CARRITO`;
      btn.style.background = '';
    }, 1800);

    // Abrir drawer
    setTimeout(() => window.openCartDrawer?.(), 400);
  });

  // ── Comprar ahora (WhatsApp) ───────────────────────────────
  document.getElementById('btn-buy-now')?.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value) || 1;
    const total = (PRICE * qty).toFixed(2);
    const msg = `Hola, quiero pedir: TOP RIB ${product.name.toUpperCase()} x${qty} - S/${total}`;
    window.open(`${WA_LINK}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });

  // ── Acordeón ───────────────────────────────────────────────
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Más para ti ────────────────────────────────────────────
  const related = document.getElementById('related-grid');
  if (related) {
    const others = PRODUCTS.filter(p => p.id !== product.id);
    // Tomar 4 a partir del siguiente en la lista
    const startIdx = PRODUCTS.findIndex(p => p.id === product.id);
    const picks = [];
    for (let i = 1; picks.length < 4; i++) {
      picks.push(PRODUCTS[(startIdx + i) % PRODUCTS.length]);
    }

    picks.forEach(p => {
      const url1 = `${BASE_URL}/${p.id}/${p.imgs[0]}`;
      const url2 = `${BASE_URL}/${p.id}/${p.imgs[1] || p.imgs[0]}`;
      const a = document.createElement('a');
      a.href = `producto.html?id=${p.id}`;
      a.className = 'product-card';
      a.setAttribute('aria-label', `Ver TOP RIB ${p.name}`);
      a.innerHTML = `
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
      related.appendChild(a);
    });
  }

  // ── Header scroll & hamburger (mismo que index) ────────────
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () =>
    header?.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

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
});
