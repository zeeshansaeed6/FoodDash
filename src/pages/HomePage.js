// ============================================================
// Home Page (Connected to Backend Multi-City API & Advance Hub)
// ============================================================
import { renderHeroBanner } from '../components/HeroBanner.js';
import { renderCategorySlider } from '../components/CategorySlider.js';
import { renderRestaurantCard } from '../components/RestaurantCard.js';
import { renderFilterBar } from '../components/FilterBar.js';
import { renderFooter } from '../components/Footer.js';
import { offers, collections } from '../data/restaurants.js';
import { fetchRestaurants } from '../api/client.js';
import { getActiveLocation } from '../components/LocationModal.js';
import { openAICravingModal } from '../components/AICravingModal.js';
import { openSpinWheelModal } from '../components/SpinWheelModal.js';
import { openGroupOrderModal } from '../components/GroupOrderModal.js';
import { getDashCoins } from '../components/CartState.js';
import { autoEnhance3DCards } from '../utils/threeDPhysics.js';
import { renderFoodStoriesBar } from '../components/FoodStoriesBar.js';

export function renderHomePage(container, onNavigate) {
  container.innerHTML = '';

  let activeCategory = null;
  let activeCollection = null;
  let activeFilterState = { filters: [], sort: 'relevance', isPureVeg: false };

  // Hero
  const hero = renderHeroBanner((query) => onNavigate('search', query));
  container.appendChild(hero);

  // Live Foodie Stories & Reels Bar
  const storiesBar = renderFoodStoriesBar();
  container.appendChild(storiesBar);

  // Advance Features Interactive Showcase Banner
  const advanceBannerSection = document.createElement('section');
  advanceBannerSection.className = 'home-section';
  advanceBannerSection.innerHTML = `
    <div class="container">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
        
        <!-- AI Craving Finder Card -->
        <div class="advance-feature-banner" id="home-ai-banner" style="background: linear-gradient(135deg, rgba(155, 93, 229, 0.2), rgba(255, 71, 87, 0.15)); border: 1px solid rgba(155, 93, 229, 0.4); border-radius: var(--radius-xl); padding: 20px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #c77dff; background: rgba(155, 93, 229, 0.25); padding: 3px 8px; border-radius: 4px;">Smart AI Discovery</span>
              <h3 style="font-size: 17px; font-weight: 800; color: white; margin: 8px 0 4px;">Food Mood & Craving Recommender</h3>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0; line-height: 1.4;">Not sure what to eat? Let AI match your vibe, budget & cravings.</p>
            </div>
            <div style="font-size: 32px;">✨</div>
          </div>
          <div style="margin-top: 14px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #c77dff;">
            <span>Try AI Mood Finder</span> <span>→</span>
          </div>
        </div>

        <!-- Spin & Win Daily Lucky Draw Card -->
        <div class="advance-feature-banner" id="home-spin-banner" style="background: linear-gradient(135deg, rgba(255, 165, 2, 0.2), rgba(255, 71, 87, 0.15)); border: 1px solid rgba(255, 165, 2, 0.4); border-radius: var(--radius-xl); padding: 20px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ffa502; background: rgba(255, 165, 2, 0.25); padding: 3px 8px; border-radius: 4px;">Daily Lucky Reward</span>
              <h3 style="font-size: 17px; font-weight: 800; color: white; margin: 8px 0 4px;">Spin the Wheel & Win</h3>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0; line-height: 1.4;">Claim 50% discount vouchers & DashCoins every single day!</p>
            </div>
            <div style="font-size: 32px;">🎡</div>
          </div>
          <div style="margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #ffa502;">
              <span>Spin for Free</span> <span>→</span>
            </div>
            <span style="font-size: 11px; color: #ffa502; background: rgba(255, 165, 2, 0.2); padding: 2px 8px; border-radius: 12px; font-weight: bold;">🪙 ${getDashCoins()} Coins</span>
          </div>
        </div>

        <!-- Group Order & Split Bill Card -->
        <div class="advance-feature-banner" id="home-group-banner" style="background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 119, 182, 0.15)); border: 1px solid rgba(0, 180, 216, 0.4); border-radius: var(--radius-xl); padding: 20px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #00b4d8; background: rgba(0, 180, 216, 0.25); padding: 3px 8px; border-radius: 4px;">Social Delivery</span>
              <h3 style="font-size: 17px; font-weight: 800; color: white; margin: 8px 0 4px;">Group Order & Split Bill</h3>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0; line-height: 1.4;">Invite friends to add items and generate instant UPI split requests.</p>
            </div>
            <div style="font-size: 32px;">👥</div>
          </div>
          <div style="margin-top: 14px; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #00b4d8;">
            <span>Create Squad Room</span> <span>→</span>
          </div>
        </div>

      </div>
    </div>
  `;

  advanceBannerSection.querySelector('#home-ai-banner').addEventListener('click', openAICravingModal);
  advanceBannerSection.querySelector('#home-spin-banner').addEventListener('click', openSpinWheelModal);
  advanceBannerSection.querySelector('#home-group-banner').addEventListener('click', openGroupOrderModal);

  container.appendChild(advanceBannerSection);

  // Categories
  const categoriesSection = renderCategorySlider((cat) => {
    activeCategory = cat;
    loadAndRenderRestaurants();
  });
  container.appendChild(categoriesSection);

  // Collections Bar
  const collectionsSection = document.createElement('section');
  collectionsSection.className = 'home-section';
  collectionsSection.innerHTML = `
    <div class="container">
      <div class="section-header">
        <div>
          <h2 class="section-title">✨ Curated Collections</h2>
          <p class="section-subtitle">Explore hand-picked lists of top dining spots</p>
        </div>
      </div>
      <div class="collections-grid" id="collections-grid">
        ${collections.map(col => `
          <div class="collection-card" data-col="${col.id}">
            <div class="collection-card__icon">${col.icon}</div>
            <div>
              <div class="collection-card__title">${col.title}</div>
              <div class="collection-card__subtitle">${col.subtitle}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  collectionsSection.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      const colId = card.dataset.col;
      const isAlreadyActive = card.classList.contains('active');
      collectionsSection.querySelectorAll('.collection-card').forEach(c => c.classList.remove('active'));

      if (!isAlreadyActive) {
        card.classList.add('active');
        activeCollection = collections.find(c => c.id === colId)?.filter || null;
      } else {
        activeCollection = null;
      }
      loadAndRenderRestaurants();
    });
  });

  container.appendChild(collectionsSection);

  // Offers
  const offersSection = document.createElement('section');
  offersSection.className = 'home-section';
  offersSection.innerHTML = `
    <div class="container">
      <div class="section-header">
        <div>
          <h2 class="section-title">🔥 Top Offers Near You</h2>
          <p class="section-subtitle">Use promo codes at checkout for instant savings</p>
        </div>
      </div>
      <div class="offers-carousel" id="offers-carousel">
        ${offers.map(o => `
          <div class="offer-card">
            <div class="offer-card__glow"></div>
            <div class="offer-card__code">${o.code}</div>
            <div class="offer-card__title">${o.title}</div>
            <div class="offer-card__desc">${o.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  container.appendChild(offersSection);

  // Restaurant Section
  const restSection = document.createElement('section');
  restSection.className = 'home-section';
  restSection.id = 'restaurants-section';

  const loc = getActiveLocation();
  const restHeader = document.createElement('div');
  restHeader.className = 'container';
  restHeader.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title" id="restaurants-section-title">🍽️ Delivery Restaurants in ${loc.cityName}</h2>
        <p class="section-subtitle" id="restaurant-count">Loading restaurants...</p>
      </div>
    </div>
  `;
  restSection.appendChild(restHeader);

  // Filter bar
  const filterBar = renderFilterBar((filterState) => {
    activeFilterState = filterState;
    loadAndRenderRestaurants();
  });
  restHeader.appendChild(filterBar);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'restaurant-grid';
  grid.id = 'restaurant-grid';
  restHeader.appendChild(grid);

  container.appendChild(restSection);

  // Footer
  container.appendChild(renderFooter());

  // Load and render restaurants via Express API
  async function loadAndRenderRestaurants() {
    const loc = getActiveLocation();
    const titleEl = document.getElementById('restaurants-section-title');
    const countEl = document.getElementById('restaurant-count');

    if (titleEl) titleEl.textContent = `🍽️ Delivery Restaurants in ${loc.cityName}`;
    if (countEl) countEl.textContent = 'Searching best restaurants...';

    const params = {
      cityId: loc.cityId || 'bangalore',
      cityName: loc.cityName || 'Bangalore',
      area: loc.area || '',
      category: activeCategory || '',
      vegOnly: activeFilterState.isPureVeg ? 'true' : 'false',
      offersOnly: activeFilterState.filters.includes('offers') ? 'true' : 'false',
      fastOnly: activeFilterState.filters.includes('fast') ? 'true' : 'false',
      minRating: activeFilterState.filters.includes('rating4') ? '4.0' : '0',
      maxPrice: activeFilterState.filters.includes('under300') ? '300' : '9999',
      sort: activeFilterState.sort || 'relevance'
    };

    const res = await fetchRestaurants(params);
    let restaurantsList = (res.success && res.restaurants) ? res.restaurants : [];

    // Apply collection filter client-side if active
    if (activeCollection && typeof activeCollection === 'function') {
      restaurantsList = restaurantsList.filter(activeCollection);
    }

    // Apply favorites filter if active
    if (activeFilterState.filters.includes('favs')) {
      try {
        const favs = JSON.parse(localStorage.getItem('fooddash_favs') || '[]');
        restaurantsList = restaurantsList.filter(r => favs.includes(r.id));
      } catch {
        // ignore
      }
    }

    grid.innerHTML = '';

    if (restaurantsList.length === 0) {
      grid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <div class="no-results__icon">🔍</div>
          <div class="no-results__title">No matching restaurants in ${loc.cityName}</div>
          <div class="no-results__desc">Try choosing another city or clearing your filter criteria</div>
        </div>
      `;
      if (countEl) countEl.textContent = `0 restaurants found in ${loc.cityName}`;
      return;
    }

    if (countEl) countEl.textContent = `${restaurantsList.length} restaurants delivering to ${loc.fullTitle}`;

    restaurantsList.forEach((restaurant, i) => {
      const card = renderRestaurantCard(restaurant, (id) => onNavigate('restaurant', id));
      card.style.animationDelay = `${Math.min(i * 0.04, 0.4)}s`;
      grid.appendChild(card);
    });

    setupScrollAnimations(grid);
    autoEnhance3DCards(container);
  }

  loadAndRenderRestaurants();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function setupScrollAnimations(container) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  container.querySelectorAll('.restaurant-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(card);
  });
}
