// ============================================================
// FoodDash — Mobile Phone App Bottom Navigation Bar
// ============================================================
import { getCartCount, onCartChange } from './CartState.js';

export function createMobileBottomNav(onNavigate, onToggleCart) {
  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.id = 'mobile-bottom-nav';
  nav.setAttribute('aria-label', 'Mobile Bottom Navigation');

  nav.innerHTML = `
    <button class="mobile-nav-item active" data-route="home" id="mob-nav-home">
      <span class="nav-icon">🛍️</span>
      <span>Home</span>
    </button>
    <button class="mobile-nav-item" data-route="search" id="mob-nav-search">
      <span class="nav-icon">🔍</span>
      <span>Search</span>
    </button>
    <button class="mobile-nav-item" data-route="cart" id="mob-nav-cart" style="position: relative;">
      <span class="nav-icon">🛒</span>
      <span>Cart</span>
      <span class="mobile-nav-badge" id="mob-cart-badge" style="display: none;">0</span>
    </button>
    <button class="mobile-nav-item" data-route="merchant" id="mob-nav-merchant">
      <span class="nav-icon">🧑‍🍳</span>
      <span>Kitchen</span>
    </button>
    <button class="mobile-nav-item" data-route="driver" id="mob-nav-driver">
      <span class="nav-icon">🛵</span>
      <span>Rider</span>
    </button>
    <button class="mobile-nav-item" data-route="profile" id="mob-nav-profile">
      <span class="nav-icon">👤</span>
      <span>Account</span>
    </button>
  `;

  // Bind Buttons
  nav.querySelector('#mob-nav-home')?.addEventListener('click', () => {
    onNavigate('home');
    updateActive('home');
  });

  nav.querySelector('#mob-nav-search')?.addEventListener('click', () => {
    const searchInput = document.getElementById('nav-search-input');
    if (searchInput) {
      searchInput.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate('search', '');
    }
    updateActive('search');
  });

  nav.querySelector('#mob-nav-cart')?.addEventListener('click', () => {
    onToggleCart();
  });

  nav.querySelector('#mob-nav-merchant')?.addEventListener('click', () => {
    onNavigate('merchant');
    updateActive('merchant');
  });

  nav.querySelector('#mob-nav-driver')?.addEventListener('click', () => {
    onNavigate('driver');
    updateActive('driver');
  });

  nav.querySelector('#mob-nav-profile')?.addEventListener('click', () => {
    onNavigate('profile');
    updateActive('profile');
  });

  function updateActive(route) {
    nav.querySelectorAll('.mobile-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === route);
    });
  }

  // Update Cart Badge
  function updateBadge() {
    const count = getCartCount();
    const badge = nav.querySelector('#mob-cart-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  onCartChange(updateBadge);
  updateBadge();

  // Listen to hash changes to sync active bottom tab
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1).toLowerCase();
    if (hash.startsWith('merchant') || hash.startsWith('partner')) {
      updateActive('merchant');
    } else if (hash.startsWith('driver') || hash.startsWith('rider')) {
      updateActive('driver');
    } else if (hash.startsWith('profile') || hash.startsWith('account')) {
      updateActive('profile');
    } else if (hash.startsWith('search')) {
      updateActive('search');
    } else {
      updateActive('home');
    }
  });

  return nav;
}
