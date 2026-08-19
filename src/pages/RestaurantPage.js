// ============================================================
// Restaurant Detail Page (Connected to Backend API)
// ============================================================
import { renderMenuItemCard } from '../components/MenuItemCard.js';
import { renderFooter } from '../components/Footer.js';
import { fetchRestaurantById } from '../api/client.js';
import { getActiveLocation } from '../components/LocationModal.js';
import { openReviewsModal } from '../components/ReviewsModal.js';
import { openTableBookingModal } from '../components/TableBookingModal.js';
import { getRestaurantCoverImage } from '../utils/foodImages.js';
import { getRestaurantLogo } from '../utils/restaurantLogos.js';

export function renderRestaurantPage(container, restaurantId, onNavigate) {
  container.innerHTML = `
    <div class="container" style="padding-top: 140px; text-align: center; color: var(--clr-text-muted);">
      <div style="font-size: 2.5rem; margin-bottom: 12px;">🥘</div>
      <div>Loading restaurant menu...</div>
    </div>
  `;

  const loc = getActiveLocation();

  fetchRestaurantById(restaurantId, {
    cityId: loc.cityId || 'bangalore',
    cityName: loc.cityName || 'Bangalore',
    area: loc.area || ''
  }).then(res => {
    if (!res.success || !res.restaurant) {
      container.innerHTML = `
        <div class="container" style="padding-top: 120px; text-align: center;">
          <h2>Restaurant not found</h2>
          <button class="btn btn-primary" id="rest-not-found-back" style="margin-top: 12px;">Go to Home</button>
        </div>
      `;
      container.querySelector('#rest-not-found-back')?.addEventListener('click', () => onNavigate('home'));
      return;
    }

    try {
      renderRestaurantContent(container, res.restaurant, onNavigate);
    } catch (renderErr) {
      console.error('Error rendering restaurant content:', renderErr);
      container.innerHTML = `
        <div class="container" style="padding-top: 120px; text-align: center;">
          <h2>Error displaying menu</h2>
          <p style="color: var(--clr-text-muted); margin: 8px 0 16px;">${renderErr.message}</p>
          <button class="btn btn-primary" id="rest-err-back">Go to Home</button>
        </div>
      `;
      container.querySelector('#rest-err-back')?.addEventListener('click', () => onNavigate('home'));
    }
  }).catch(err => {
    console.error('Failed to fetch restaurant:', err);
    container.innerHTML = `
      <div class="container" style="padding-top: 120px; text-align: center;">
        <h2>Error loading restaurant</h2>
        <p style="color: var(--clr-text-muted); margin: 8px 0 16px;">${err.message || 'Please check your connection and try again.'}</p>
        <button class="btn btn-primary" id="rest-error-back">Go to Home</button>
      </div>
    `;
    container.querySelector('#rest-error-back')?.addEventListener('click', () => onNavigate('home'));
  });
}

function renderRestaurantContent(container, restaurant, onNavigate) {
  container.innerHTML = '';

  let isVegOnlyMenu = false;
  let menuSearchQuery = '';

  const bannerImg = (restaurant.image && !restaurant.image.includes('/images/rest'))
    ? restaurant.image
    : getRestaurantCoverImage(restaurant.name, restaurant.cuisines);

  const brand = getRestaurantLogo(restaurant.name);

  // Page wrapper
  const page = document.createElement('div');
  page.className = 'restaurant-page';

  // Banner
  page.innerHTML = `
    <div class="restaurant-banner">
      <img class="restaurant-banner__image" src="${bannerImg}" alt="${restaurant.name}" />
      <div class="restaurant-banner__overlay"></div>
    </div>
  `;

  // Header & Breadcrumb
  const header = document.createElement('div');
  header.className = 'container';
  header.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0 6px;">
      <button class="back-btn" id="rest-back-btn" style="margin: 0;">← Back to restaurants</button>
      <div style="font-size: 12px; color: var(--clr-text-muted);">
        Home / ${restaurant.city || 'Bangalore'} / ${(restaurant.cuisines && restaurant.cuisines[0]) || 'Food'} / <span style="color: var(--clr-text); font-weight: 500;">${restaurant.name}</span>
      </div>
    </div>

    <div class="restaurant-header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          
          <!-- Brand Logo Avatar -->
          <div style="width: 64px; height: 64px; border-radius: 50%; background: ${brand.bgColor}; border: 3px solid white; box-shadow: 0 4px 18px rgba(0,0,0,0.5), 0 0 15px rgba(255,107,0,0.3); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
            ${brand.logoUrl ? `
              <img src="${brand.logoUrl}" alt="${brand.name} Logo" style="width: 80%; height: 80%; object-fit: contain;" />
            ` : `
              <span style="font-size: 20px; font-weight: 900; color: ${brand.color};">${brand.initials}</span>
            `}
          </div>

          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h1 class="restaurant-header__name" style="margin: 0;">${restaurant.name}</h1>
              ${brand.isKnownBrand ? `<span style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 800;">✓ OFFICIAL OUTLET</span>` : ''}
            </div>
            <p class="restaurant-header__cuisines">${(restaurant.cuisines || []).join(' • ')}</p>
            <p style="font-size: 13px; color: var(--clr-text-muted); margin: 4px 0 0;">📍 ${restaurant.address || ''}</p>
          </div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button id="open-rest-table-booking-btn" class="btn-dinein" title="Book a dining table with seat selection & food pre-order">
            <span style="font-size: 16px;">🍽️</span>
            <span>Book Table & Dine-in</span>
          </button>
          <button id="open-rest-reviews-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: var(--radius-md); cursor: pointer;" title="Read and write customer reviews">
            <span style="background: var(--clr-success); color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 13px;">★ ${restaurant.rating}</span>
            <span style="font-size: 12px;">Reviews & Rating 💬</span>
          </button>
        </div>
      </div>

      <div class="restaurant-header__meta">
        <span class="restaurant-header__meta-item">
          <span class="restaurant-header__meta-icon">⚡</span>
          ${restaurant.deliveryTime} (Delivery)
        </span>
        <span class="restaurant-header__meta-item">
          <span class="restaurant-header__meta-icon">🪑</span>
          Dine-in Available (Instant Table)
        </span>
        <span class="restaurant-header__meta-item">
          <span class="restaurant-header__meta-icon">📍</span>
          ${restaurant.distance} from you
        </span>
        <span class="restaurant-header__meta-item">
          <span class="restaurant-header__meta-icon">💰</span>
          ₹${restaurant.priceForTwo} for two
        </span>
      </div>

      <!-- Dine-in promo strip -->
      <div style="margin-top: 14px; padding: 10px 16px; background: linear-gradient(135deg, rgba(255,107,0,0.12) 0%, rgba(255,107,0,0.03) 100%); border: 1px solid rgba(255,107,0,0.25); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">🍷</span>
          <div>
            <div style="font-size: 13px; font-weight: 700; color: white;">Planning to dine at ${restaurant.name}?</div>
            <div style="font-size: 11px; color: var(--clr-text-muted);">Reserve window booths, choose live seats & pre-order chef specials with zero queue wait.</div>
          </div>
        </div>
        <button id="rest-dinein-strip-btn" class="btn btn-outline btn-sm" style="border-color: var(--clr-primary); color: var(--clr-primary); font-size: 12px; font-weight: 700;">
          Reserve Seat Now ➔
        </button>
      </div>

      ${restaurant.offer ? `
        <div class="restaurant-header__offer-strip">
          <div class="restaurant-offer-tag">🏷️ ${restaurant.offer}</div>
          <div class="restaurant-offer-tag">🏷️ Free delivery above ₹199</div>
          <div class="restaurant-offer-tag">💳 Flat ₹50 cashback on UPI</div>
        </div>
      ` : ''}
    </div>

    <!-- Menu Search & Veg Filter Bar -->
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 20px 0 12px; flex-wrap: wrap;">
      <div style="position: relative; flex: 1; max-width: 380px;">
        <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted);">🔍</span>
        <input
          type="search"
          id="menu-search-input"
          placeholder="Search within menu..."
          style="width: 100%; padding: 8px 12px 8px 36px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-full); font-size: 13px;"
        />
      </div>

      <div class="veg-toggle-wrap" id="menu-veg-toggle" title="Toggle Veg Only Dishes">
        <span class="veg-indicator" style="width: 14px; height: 14px;"></span>
        <span>Veg Only</span>
        <div class="veg-toggle-switch"></div>
      </div>
    </div>
  `;
  page.appendChild(header);

  // Menu Navigation
  const menuCategories = Object.keys(restaurant.menu || {});
  const menuNav = document.createElement('nav');
  menuNav.className = 'menu-nav';

  const menuNavContainer = document.createElement('div');
  menuNavContainer.className = 'container';
  menuNavContainer.innerHTML = `
    <div class="menu-nav__list" id="menu-nav-list">
      ${menuCategories.map((cat, i) => `
        <button class="menu-nav__item ${i === 0 ? 'active' : ''}" data-section="${cat}" id="menu-nav-${cat.replace(/\s+/g, '-')}">
          ${cat} (${(restaurant.menu[cat] || []).length})
        </button>
      `).join('')}
    </div>
  `;
  menuNav.appendChild(menuNavContainer);
  page.appendChild(menuNav);

  // Menu Sections Container
  const menuContainer = document.createElement('div');
  menuContainer.className = 'container';
  menuContainer.id = 'menu-sections-container';
  page.appendChild(menuContainer);

  // Render menu function
  function renderMenu() {
    menuContainer.innerHTML = '';
    let totalRendered = 0;

    menuCategories.forEach(cat => {
      let items = restaurant.menu[cat];

      if (isVegOnlyMenu) {
        items = items.filter(i => i.isVeg);
      }

      if (menuSearchQuery) {
        items = items.filter(i =>
          i.name.toLowerCase().includes(menuSearchQuery) ||
          i.desc.toLowerCase().includes(menuSearchQuery)
        );
      }

      if (items.length > 0) {
        totalRendered += items.length;
        const section = document.createElement('section');
        section.className = 'menu-section';
        section.id = `menu-section-${cat.replace(/\s+/g, '-')}`;

        section.innerHTML = `
          <h2 class="menu-section__title">
            ${cat}
            <span class="menu-section__count">(${items.length} items)</span>
          </h2>
          <div class="menu-section__divider"></div>
        `;

        items.forEach(item => {
          const itemCard = renderMenuItemCard(item, restaurant.id, restaurant.name);
          section.appendChild(itemCard);
        });

        menuContainer.appendChild(section);
      }
    });

    if (totalRendered === 0) {
      menuContainer.innerHTML = `
        <div class="no-results" style="padding: 40px 0;">
          <div class="no-results__icon">🍽️</div>
          <div class="no-results__title">No dishes match your search</div>
          <div class="no-results__desc">Try clearing your search keyword or turning off the Veg Only filter</div>
        </div>
      `;
    }
  }

  renderMenu();

  // Footer
  page.appendChild(renderFooter());
  container.appendChild(page);

  // Back button
  page.querySelector('#rest-back-btn')?.addEventListener('click', () => {
    onNavigate('home');
  });

  // Open Table Booking Modal
  page.querySelector('#open-rest-table-booking-btn')?.addEventListener('click', () => {
    openTableBookingModal(restaurant);
  });

  page.querySelector('#rest-dinein-strip-btn')?.addEventListener('click', () => {
    openTableBookingModal(restaurant);
  });

  // Open Reviews Modal
  page.querySelector('#open-rest-reviews-btn')?.addEventListener('click', () => {
    openReviewsModal(restaurant.id, restaurant.name);
  });

  // Search in menu
  page.querySelector('#menu-search-input')?.addEventListener('input', (e) => {
    menuSearchQuery = e.target.value.toLowerCase().trim();
    renderMenu();
  });

  // Veg toggle
  const vegToggle = page.querySelector('#menu-veg-toggle');
  vegToggle?.addEventListener('click', () => {
    isVegOnlyMenu = !isVegOnlyMenu;
    vegToggle.classList.toggle('active', isVegOnlyMenu);
    renderMenu();
  });

  // Menu nav clicks
  const navItems = page.querySelectorAll('.menu-nav__item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = `menu-section-${item.dataset.section.replace(/\s+/g, '-')}`;
      const target = document.getElementById(sectionId);
      if (target) {
        const navHeight = 140;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
}
