// ============================================================
// Search Results Page
// ============================================================
import { searchAll, restaurants } from '../data/restaurants.js';
import { renderRestaurantCard } from '../components/RestaurantCard.js';
import { renderFooter } from '../components/Footer.js';

export function renderSearchPage(container, query, onNavigate) {
  container.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'search-page';

  const wrapper = document.createElement('div');
  wrapper.className = 'container';

  const results = searchAll(query);
  const totalResults = results.restaurants.length + results.dishes.length;

  wrapper.innerHTML = `
    <button class="back-btn" id="search-back-btn">← Back to Home</button>
    <h1 class="search-page__title">
      Results for <span class="search-page__query">"${query}"</span>
    </h1>
    <p class="search-page__count">${totalResults} results found</p>
  `;

  // Show matched restaurants
  if (results.restaurants.length > 0) {
    const section = document.createElement('section');
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">🏪 Restaurants</h2>
      </div>
    `;

    const grid = document.createElement('div');
    grid.className = 'restaurant-grid';

    results.restaurants.forEach(restaurant => {
      const card = renderRestaurantCard(restaurant, (id) => onNavigate('restaurant', id));
      grid.appendChild(card);
    });

    section.appendChild(grid);
    wrapper.appendChild(section);
  }

  // Show matched dishes → show their restaurants
  if (results.dishes.length > 0) {
    const section = document.createElement('section');
    section.style.marginTop = '2rem';
    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">🍽️ Dishes</h2>
      </div>
    `;

    const dishGrid = document.createElement('div');
    dishGrid.className = 'restaurant-grid';

    // Get unique restaurants from dishes
    const seenIds = new Set(results.restaurants.map(r => r.id));
    const dishRestIds = [...new Set(results.dishes.map(d => d.restaurantId))].filter(id => !seenIds.has(id));

    dishRestIds.forEach(rid => {
      const rest = restaurants.find(r => r.id === rid);
      if (rest) {
        const card = renderRestaurantCard(rest, (id) => onNavigate('restaurant', id));
        dishGrid.appendChild(card);
      }
    });

    // Also show dish names as info
    const dishList = document.createElement('div');
    dishList.style.cssText = 'margin-top: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem;';
    results.dishes.slice(0, 12).forEach(d => {
      const chip = document.createElement('span');
      chip.className = 'badge badge-accent';
      chip.style.cssText = 'cursor: pointer; padding: 6px 14px; font-size: 0.8rem;';
      chip.textContent = `${d.name} — ₹${d.price}`;
      chip.addEventListener('click', () => onNavigate('restaurant', d.restaurantId));
      dishList.appendChild(chip);
    });

    section.appendChild(dishList);
    if (dishGrid.children.length > 0) section.appendChild(dishGrid);
    wrapper.appendChild(section);
  }

  if (totalResults === 0) {
    wrapper.innerHTML += `
      <div class="no-results">
        <div class="no-results__icon">🔍</div>
        <div class="no-results__title">No results found</div>
        <div class="no-results__desc">Try searching for "Pizza", "Biryani", "Burger" or a restaurant name</div>
      </div>
    `;
  }

  page.appendChild(wrapper);
  page.appendChild(renderFooter());
  container.appendChild(page);

  // Back button
  page.querySelector('#search-back-btn')?.addEventListener('click', () => onNavigate('home'));

  window.scrollTo({ top: 0, behavior: 'instant' });
}
