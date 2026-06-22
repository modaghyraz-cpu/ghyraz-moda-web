// GHYRAZ MODA — cart.js (módulo compartido entre páginas)
'use strict';

const CART_KEY = 'ghyraz_cart';
const WA_URL   = 'https://wa.me/51910120676';

const GhyrazCart = (() => {

  // ── Persistencia ──────────────────────────────────────────
  function load() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  // ── API pública ───────────────────────────────────────────
  function getItems() { return load(); }

  function getTotalQty() {
    return load().reduce((s, i) => s + i.qty, 0);
  }

  function add(product, qty = 1) {
    const items = load();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({
        id:    product.id,
        name:  product.name,
        price: product.price,
        img:   product.img,
        qty,
      });
    }
    save(items);
    dispatchUpdate();
  }

  function remove(id) {
    save(load().filter(i => i.id !== id));
    dispatchUpdate();
  }

  function clear() {
    save([]);
    dispatchUpdate();
  }

  function getSubtotal() {
    return load().reduce((s, i) => s + i.price * i.qty, 0);
  }

  function buildWhatsAppUrl() {
    const items = load();
    if (!items.length) return WA_URL;
    const lines = items
      .map(i => `- TOP RIB ${i.name.toUpperCase()} x${i.qty} - S/${(i.price * i.qty).toFixed(2)}`)
      .join('\n');
    const total = getSubtotal();
    const msg = `Hola! Quiero hacer este pedido:\n${lines}\nTotal: S/${total.toFixed(2)}`;
    return `${WA_URL}?text=${encodeURIComponent(msg)}`;
  }

  function dispatchUpdate() {
    window.dispatchEvent(new CustomEvent('cart:updated'));
  }

  return { getItems, getTotalQty, getSubtotal, add, remove, clear, buildWhatsAppUrl };
})();

window.GhyrazCart = GhyrazCart;

// ── Cart UI (drawer) ──────────────────────────────────────────
// Se inicializa en cualquier página que incluya cart.js
document.addEventListener('DOMContentLoaded', () => {
  // Insertar drawer en el DOM si no existe
  if (!document.getElementById('cart-drawer')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="cart-overlay" class="cart-overlay" aria-hidden="true"></div>
      <aside id="cart-drawer" class="cart-drawer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
        <div class="cart-drawer__header">
          <h2>Tu carrito</h2>
          <button id="cart-close-btn" class="cart-close" aria-label="Cerrar carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div id="cart-items" class="cart-items"></div>
        <div class="cart-drawer__footer">
          <div class="cart-subtotal">
            <span>Subtotal</span>
            <span id="cart-subtotal-val">S/ 0.00</span>
          </div>
          <a id="cart-wa-btn" href="#" target="_blank" rel="noopener" class="cart-wa-btn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.558 4.117 1.534 5.847L.057 23.57a.75.75 0 0 0 .92.919l5.739-1.484A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 0 1-4.964-1.363l-.356-.214-3.685.953.982-3.58-.233-.37A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
            Finalizar pedido por WhatsApp
          </a>
        </div>
      </aside>`);

    document.getElementById('cart-close-btn').addEventListener('click', closeDrawer);
    document.getElementById('cart-overlay').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
  }

  renderDrawer();
  updateBadge();

  window.addEventListener('cart:updated', () => {
    renderDrawer();
    updateBadge();
  });

  // Botón del carrito en el header
  document.getElementById('cart-icon-btn')?.addEventListener('click', openDrawer);
});

function openDrawer() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-overlay').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-overlay').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateBadge() {
  const qty = GhyrazCart.getTotalQty();
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = qty;
    b.classList.toggle('visible', qty > 0);
  });
}

function renderDrawer() {
  const items = GhyrazCart.getItems();
  const container = document.getElementById('cart-items');
  const waBtn = document.getElementById('cart-wa-btn');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p>Tu carrito está vacío</p>
        <span>Explora nuestro catálogo y agrega tus tops favoritos.</span>
      </div>`;
    subtotalEl && (subtotalEl.textContent = 'S/ 0.00');
    if (waBtn) { waBtn.style.opacity = '0.45'; waBtn.style.pointerEvents = 'none'; }
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.img}" alt="${item.name}" class="cart-item__img">
      <div class="cart-item__info">
        <p class="cart-item__name">TOP RIB ${item.name.toUpperCase()}</p>
        <p class="cart-item__price">S/ ${(item.price * item.qty).toFixed(2)} <span>x${item.qty}</span></p>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Eliminar ${item.name}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>`).join('');

  container.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => GhyrazCart.remove(btn.dataset.id));
  });

  if (subtotalEl) subtotalEl.textContent = `S/ ${GhyrazCart.getSubtotal().toFixed(2)}`;
  if (waBtn) {
    waBtn.href = GhyrazCart.buildWhatsAppUrl();
    waBtn.style.opacity = '';
    waBtn.style.pointerEvents = '';
  }
}

window.openCartDrawer  = openDrawer;
window.closeCartDrawer = closeDrawer;
