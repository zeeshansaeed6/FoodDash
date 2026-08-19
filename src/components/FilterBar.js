// ============================================================
// Filter Bar Component (Comprehensive & Modern)
// ============================================================

const filters = [
  { id: 'rating45', label: '⭐ Rating 4.5+' },
  { id: 'rating4', label: '⭐ 4.0+' },
  { id: 'fast20', label: '⚡ Ultra Fast (<20m)' },
  { id: 'fast', label: '🛵 Under 30m' },
  { id: 'offers', label: '🏷️ Great Offers' },
  { id: 'megaDiscount', label: '🔥 30%+ OFF' },
  { id: 'freeDelivery', label: '🚴 Free Delivery' },
  { id: 'favs', label: '❤️ Favorites' },
  { id: 'under200', label: '💰 Under ₹200' },
  { id: 'under300', label: '₹300 for Two' },
  { id: 'under500', label: '₹300–₹500' },
  { id: 'premium', label: '👑 Fine Dining' },
  { id: 'newPlaces', label: '✨ New Arrivals' },
];

const sortOptions = [
  { value: 'relevance', label: '✨ Relevance' },
  { value: 'rating', label: '⭐ Rating: High to Low' },
  { value: 'delivery', label: '⚡ Delivery: Fastest' },
  { value: 'costLow', label: '💵 Cost: Low to High' },
  { value: 'costHigh', label: '💎 Cost: High to Low' },
  { value: 'discount', label: '🏷️ Discount: High to Low' },
  { value: 'popularity', label: '🔥 Popularity (Reviews)' },
];

export function renderFilterBar(onFilterChange) {
  const bar = document.createElement('div');
  bar.className = 'filter-bar';
  bar.id = 'filter-bar';

  const activeFilters = new Set();
  let currentSort = 'relevance';
  let dietPreference = 'all'; // 'all' | 'veg' | 'nonveg'

  const dietToggleHtml = `
    <div class="dietary-segmented-control" style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.06); border: 1px solid var(--clr-border); border-radius: 24px; padding: 3px; gap: 2px;">
      <button class="diet-btn active" data-diet="all" style="background: transparent; border: none; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 600; color: var(--clr-text); cursor: pointer; transition: all 0.2s;">All</button>
      <button class="diet-btn" data-diet="veg" style="background: transparent; border: none; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 600; color: var(--clr-text-secondary); cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00e676;"></span> Veg
      </button>
      <button class="diet-btn" data-diet="nonveg" style="background: transparent; border: none; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 600; color: var(--clr-text-secondary); cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 4px;">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#ff5252;"></span> Non-Veg
      </button>
    </div>
  `;

  const chips = filters.map(f => `
    <button class="filter-chip" data-filter="${f.id}" id="filter-${f.id}">
      ${f.label}
    </button>
  `).join('');

  const sortSelect = `
    <div class="filter-bar__sort">
      <select id="sort-select" aria-label="Sort restaurants">
        ${sortOptions.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
      </select>
    </div>
  `;

  bar.innerHTML = dietToggleHtml + chips + sortSelect;

  // Dietary button switch
  const dietButtons = bar.querySelectorAll('.diet-btn');
  dietButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dietButtons.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--clr-text-secondary)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--clr-primary, #ff385c)';
      btn.style.color = '#fff';
      dietPreference = btn.dataset.diet;
      triggerChange();
    });
  });

  // Chip click
  bar.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const fId = chip.dataset.filter;
      if (activeFilters.has(fId)) {
        activeFilters.delete(fId);
        chip.classList.remove('active');
      } else {
        activeFilters.add(fId);
        chip.classList.add('active');
      }
      triggerChange();
    });
  });

  // Sort change
  bar.querySelector('#sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    triggerChange();
  });

  function triggerChange() {
    onFilterChange({
      filters: [...activeFilters],
      sort: currentSort,
      dietPreference,
      isPureVeg: dietPreference === 'veg',
      isNonVegOnly: dietPreference === 'nonveg'
    });
  }

  return bar;
}

export function applyFiltersAndSort(restaurants, { filters: activeFilters = [], sort = 'relevance', category = null, isPureVeg = false, isNonVegOnly = false, dietPreference = 'all', collectionFilter = null }) {
  let result = [...restaurants];

  // Category filter
  if (category) {
    result = result.filter(r => r.categories && r.categories.includes(category));
  }

  // Collection filter
  if (collectionFilter && typeof collectionFilter === 'function') {
    result = result.filter(collectionFilter);
  }

  // Diet switch
  if (dietPreference === 'veg' || isPureVeg) {
    result = result.filter(r => r.isVeg);
  } else if (dietPreference === 'nonveg' || isNonVegOnly) {
    result = result.filter(r => !r.isVeg);
  }

  // Active filters
  if (activeFilters.includes('rating45')) {
    result = result.filter(r => r.rating >= 4.5);
  }
  if (activeFilters.includes('rating4')) {
    result = result.filter(r => r.rating >= 4.0);
  }
  if (activeFilters.includes('fast20')) {
    result = result.filter(r => {
      const mins = parseInt(r.deliveryTime) || 30;
      return mins <= 20;
    });
  }
  if (activeFilters.includes('fast')) {
    result = result.filter(r => {
      const mins = parseInt(r.deliveryTime) || 30;
      return mins <= 30;
    });
  }
  if (activeFilters.includes('offers')) {
    result = result.filter(r => r.offer && r.offer.length > 0);
  }
  if (activeFilters.includes('megaDiscount')) {
    result = result.filter(r => {
      if (!r.offer) return false;
      const off = r.offer.toLowerCase();
      return off.includes('30%') || off.includes('40%') || off.includes('50%') || off.includes('150') || off.includes('125');
    });
  }
  if (activeFilters.includes('freeDelivery')) {
    result = result.filter(r => r.deliveryFee === 0);
  }
  if (activeFilters.includes('favs')) {
    try {
      const favs = JSON.parse(localStorage.getItem('fooddash_favs') || '[]');
      result = result.filter(r => favs.includes(r.id));
    } catch {
      // ignore
    }
  }
  if (activeFilters.includes('under200')) {
    result = result.filter(r => r.priceForTwo <= 250);
  }
  if (activeFilters.includes('under300')) {
    result = result.filter(r => r.priceForTwo <= 300);
  }
  if (activeFilters.includes('under500')) {
    result = result.filter(r => r.priceForTwo > 300 && r.priceForTwo <= 500);
  }
  if (activeFilters.includes('premium')) {
    result = result.filter(r => r.priceForTwo >= 600 || r.rating >= 4.6);
  }
  if (activeFilters.includes('newPlaces')) {
    result = result.filter(r => r.isNew);
  }

  // Sort
  switch (sort) {
    case 'rating':
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'delivery':
      result.sort((a, b) => (parseInt(a.deliveryTime) || 30) - (parseInt(b.deliveryTime) || 30));
      break;
    case 'costLow':
      result.sort((a, b) => (a.priceForTwo || 0) - (b.priceForTwo || 0));
      break;
    case 'costHigh':
      result.sort((a, b) => (b.priceForTwo || 0) - (a.priceForTwo || 0));
      break;
    case 'discount':
      result.sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0));
      break;
    case 'popularity':
      result.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
      break;
    default:
      break;
  }

  return result;
}

