// ============================================================
// Floating Sticky Cart Bar Component
// ============================================================
import { getCartCount, getCartTotal, onCartChange } from './CartState.js';

export function createFloatingCartBar(onOpenCart) {
  const bar = document.createElement('div');
  bar.className = 'floating-cart-bar';
  bar.id = 'floating-cart-bar';
  bar.setAttribute('role', 'button');
  bar.setAttribute('tabindex', '0');

  function update() {
    const count = getCartCount();
    const total = getCartTotal();

    if (count > 0) {
      bar.innerHTML = `
        <div class="floating-cart-bar__info">
          <span class="floating-cart-bar__count">${count} ${count === 1 ? 'item' : 'items'}</span>
          <span style="font-weight: bold; font-size: 16px;">₹${total}</span>
        </div>
        <div class="floating-cart-bar__action">
          <span>View Cart</span>
          <span>🛒 →</span>
        </div>
      `;
      bar.classList.add('visible');
    } else {
      bar.classList.remove('visible');
    }
  }

  bar.addEventListener('click', onOpenCart);
  bar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenCart();
    }
  });

  onCartChange(update);
  update();

  document.body.appendChild(bar);
}
