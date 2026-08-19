import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { getRestaurantCoverImage } from '../utils/foodImages.js';
import { getRestaurantLogo } from '../utils/restaurantLogos.js';
import { openTableBookingModal } from './TableBookingModal.js';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('fooddash_favs') || '[]');
  } catch {
    return [];
  }
}

async function toggleFavorite(id, e) {
  e.stopPropagation();
  sounds.playPop();
  let favs = getFavorites();
  const isFav = favs.includes(id);
  if (isFav) {
    favs = favs.filter(favId => favId !== id);
    showToast('Removed from favorites', '💔');
  } else {
    favs.push(id);
    showToast('Saved to your favorites! ❤️', '❤️');
  }
  localStorage.setItem('fooddash_favs', JSON.stringify(favs));

  // Sync to backend
  try {
    fetch(`/api/restaurants/user/favorites/${id}`, { method: 'POST' });
  } catch (err) {}

  return !isFav;
}

export function renderRestaurantCard(restaurant, onClick) {
  const card = document.createElement('article');
  card.className = 'restaurant-card animate-on-scroll';
  card.id = `restaurant-card-${restaurant.id}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${restaurant.name} — ${restaurant.rating} stars, ${restaurant.deliveryTime}`);

  const isFav = getFavorites().includes(restaurant.id);
  const restImg = (restaurant.image && !restaurant.image.includes('/images/rest'))
    ? restaurant.image
    : getRestaurantCoverImage(restaurant.name, restaurant.cuisines);

  const brand = getRestaurantLogo(restaurant.name);

  card.innerHTML = `
    <div class="restaurant-card__image-wrap">
      <img
        class="restaurant-card__image"
        src="${restImg}"
        alt="${restaurant.name}"
        loading="lazy"
      />
      <div class="restaurant-card__gradient"></div>
      ${restaurant.isPromoted ? `<span class="restaurant-card__promoted">Promoted</span>` : ''}
      ${restaurant.isNew ? `<span class="restaurant-card__promoted" style="background: var(--clr-accent); color: white;">New</span>` : ''}
      <button class="restaurant-card__fav-btn ${isFav ? 'is-fav' : ''}" aria-label="Favorite ${restaurant.name}">
        ${isFav ? '❤️' : '🤍'}
      </button>
      ${restaurant.offer ? `<span class="restaurant-card__offer">${restaurant.offer}</span>` : ''}
      <span style="position: absolute; bottom: 8px; left: 8px; font-size: 10px; font-weight: 700; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); color: #4ade80; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(74,222,128,0.3);">🪑 Dine-in</span>

      <!-- Floating Real Restaurant Brand Logo Badge -->
      <div class="restaurant-card__logo-badge" style="position: absolute; bottom: -14px; right: 14px; width: 44px; height: 44px; border-radius: 50%; background: ${brand.bgColor}; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.5), 0 0 10px rgba(255,107,0,0.3); display: flex; align-items: center; justify-content: center; overflow: hidden; z-index: 10; transform: translateZ(35px);">
        ${brand.logoUrl ? `
          <img src="${brand.logoUrl}" alt="${brand.name} Logo" style="width: 80%; height: 80%; object-fit: contain;" />
        ` : `
          <span style="font-size: 13px; font-weight: 900; color: ${brand.color};">${brand.initials}</span>
        `}
      </div>
    </div>
    <div class="restaurant-card__info" style="padding-top: 18px;">
      <div class="restaurant-card__header">
        <h3 class="restaurant-card__name" style="display: flex; align-items: center; gap: 5px;">
          ${restaurant.name}
          ${brand.isKnownBrand ? `<span title="Official Brand Outlet" style="color: #38bdf8; font-size: 13px;">✓</span>` : ''}
        </h3>
        <div class="restaurant-card__rating">
          ★ ${restaurant.rating}
        </div>
      </div>
      <p class="restaurant-card__cuisines">${restaurant.cuisines.join(' • ')}</p>
      <div class="restaurant-card__meta">
        <span class="restaurant-card__meta-item">⚡ ${restaurant.deliveryTime}</span>
        <span class="restaurant-card__meta-item">📍 ${restaurant.distance}</span>
        <span class="restaurant-card__meta-item">₹${restaurant.priceForTwo} for two</span>
      </div>
      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed var(--clr-border); display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <button class="btn btn-secondary btn-sm card-book-btn" style="padding: 4px 10px; font-size: 11px; border-radius: var(--radius-full); display: flex; align-items: center; gap: 4px;" title="Reserve a table">
          <span>🍽️</span> Book Table
        </button>
        <button class="btn btn-primary btn-sm" style="padding: 4px 14px; font-size: 12px; border-radius: var(--radius-full);" aria-label="View menu for ${restaurant.name}">
          Order Now →
        </button>
      </div>
    </div>
  `;

  // Favorite button listener
  const favBtn = card.querySelector('.restaurant-card__fav-btn');
  favBtn.addEventListener('click', (e) => {
    const newState = toggleFavorite(restaurant.id, e);
    favBtn.classList.toggle('is-fav', newState);
    favBtn.innerHTML = newState ? '❤️' : '🤍';
  });

  // Direct Book Table action
  card.querySelector('.card-book-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openTableBookingModal(restaurant);
  });

  card.addEventListener('click', () => onClick(restaurant.id));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(restaurant.id);
    }
  });

  return card;
}
