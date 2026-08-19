// ============================================================
// Category Slider Component
// ============================================================
import { categories } from '../data/restaurants.js';

export function renderCategorySlider(onCategoryClick, activeCategory = null) {
  const section = document.createElement('section');
  section.className = 'categories';
  section.id = 'categories-section';

  const pills = categories.map(cat => `
    <button
      class="category-pill ${activeCategory === cat.id ? 'active' : ''}"
      data-category="${cat.id}"
      aria-label="Filter by ${cat.name}"
    >
      <span class="category-pill__icon">${cat.icon}</span>
      <span class="category-pill__name">${cat.name}</span>
    </button>
  `).join('');

  section.innerHTML = `
    <div class="container">
      <h2 class="categories__title">What's on your mind?</h2>
      <div class="categories__slider" id="category-slider">
        ${pills}
      </div>
    </div>
  `;

  section.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.category;
      // Toggle active
      const isAlreadyActive = pill.classList.contains('active');
      section.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      if (!isAlreadyActive) {
        pill.classList.add('active');
        onCategoryClick(cat);
      } else {
        onCategoryClick(null);
      }
    });
  });

  return section;
}
