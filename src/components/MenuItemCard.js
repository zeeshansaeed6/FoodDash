// ============================================================
// Menu Item Card Component (with Customization Trigger)
// ============================================================
import { addToCart, removeFromCart, getItemQty, onCartChange } from './CartState.js';
import { openCustomizationModal } from './CustomizationModal.js';
import { getFoodImage } from '../utils/foodImages.js';
import { showToast } from './Toast.js';

export function renderMenuItemCard(item, restaurantId, restaurantName) {
  const el = document.createElement('div');
  el.className = 'menu-item';
  el.id = `menu-item-${item.id}`;

  function render() {
    const qty = getItemQty(item.id);
    const foodImg = (item.image && !item.image.includes('/images/rest')) ? item.image : getFoodImage(item.name, '', item.isVeg);

    el.innerHTML = `
      <div class="menu-item__details">
        <div class="menu-item__badges">
          ${item.isBestseller ? '<span class="menu-item__bestseller">★ Bestseller</span>' : ''}
          <span style="font-size: 10px; color: #ffb703; background: rgba(255, 183, 3, 0.12); padding: 2px 6px; border-radius: 4px; font-weight: 600;">⚡ Customizable</span>
        </div>
        <div class="menu-item__name">
          <span class="veg-indicator ${item.isVeg ? '' : 'nonveg'}"></span>
          ${item.name}
        </div>
        <div class="menu-item__price">₹${item.price}</div>
        <p class="menu-item__desc">${item.desc}</p>
      </div>
      <div class="menu-item__image-wrap">
        <img class="menu-item__image" src="${foodImg}" alt="${item.name}" loading="lazy" />
        ${qty === 0 ? `
          <button class="menu-item__add-btn" data-action="custom-add" aria-label="Customize and add ${item.name} to cart">
            ADD <span style="font-size: 10px; opacity: 0.8;">+</span>
          </button>
        ` : `
          <div class="menu-item__qty-controls">
            <button class="menu-item__qty-btn" data-action="remove" aria-label="Remove one ${item.name}">−</button>
            <span class="menu-item__qty-value">${qty}</span>
            <button class="menu-item__qty-btn" data-action="add-more" aria-label="Add one more ${item.name}">+</button>
          </div>
        `}
        <div style="font-size: 10px; color: var(--clr-text-muted); text-align: center; margin-top: 3px; cursor: pointer;" class="customize-link" data-action="custom-add">
          customisable
        </div>
      </div>
    `;

    // Event listeners
    el.querySelectorAll('[data-action="custom-add"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCustomizationModal(item, restaurantId, restaurantName);
      });
    });

    const addMoreBtn = el.querySelector('[data-action="add-more"]');
    if (addMoreBtn) {
      addMoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCustomizationModal(item, restaurantId, restaurantName);
      });
    }

    const removeBtn = el.querySelector('[data-action="remove"]');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeFromCart(item.id);
        render();
      });
    }
  }

  render();

  // Re-render on cart changes
  onCartChange(() => render());

  return el;
}

