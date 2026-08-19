import { openFitMealPlannerModal } from './FitMealPlannerModal.js';
import { openMysteryBoxModal } from './MysteryBoxModal.js';
import { openTasteMatchModal } from './TasteMatchModal.js';
import { openSpinWheelModal } from './SpinWheelModal.js';
import { getFoodImage } from '../utils/foodImages.js';

const HERO_DISHES = [
  {
    id: 'hero-burger',
    name: 'Gourmet Double Truffle Burger',
    tag: '👑 Bestseller • Pure Beef & Aged Cheddar',
    price: '₹349',
    rating: '4.9★',
    time: '18 min',
    image: getFoodImage('Double Smash Burger', 'Burgers', false),
    desc: 'Dual prime smash patties, melted cheddar, truffle aioli & crispy brioche.'
  },
  {
    id: 'hero-pizza',
    name: 'Stone-Baked Pepperoni Fire Pizza',
    tag: '🔥 Wood-Fired • Buffalo Mozzarella',
    price: '₹429',
    rating: '4.8★',
    time: '22 min',
    image: getFoodImage('Pepperoni Supreme Pizza', 'Pizza', false),
    desc: 'Artisanal sourdough crust, San Marzano sauce, fresh basil & spiced pepperoni.'
  },
  {
    id: 'hero-biryani',
    name: 'Royal Hyderabadi Dum Biryani',
    tag: '🍚 Slow-Cooked • Saffron Aromatics',
    price: '₹379',
    rating: '4.95★',
    time: '25 min',
    image: getFoodImage('Hyderabadi Chicken Biryani', 'Biryani', false),
    desc: 'Fragrant long-grain basmati, tender marinated chicken, saffron & fried onions.'
  },
  {
    id: 'hero-sushi',
    name: 'Tokyo Rainbow Salmon Roll',
    tag: '🍣 Fresh Catch • Wasabi & Ginger',
    price: '₹499',
    rating: '4.9★',
    time: '20 min',
    image: getFoodImage('Salmon Nigiri Platter', 'Sushi', false),
    desc: 'Fresh Atlantic salmon, avocado, seasoned sushi rice & toasted nori.'
  }
];

let activeHeroIndex = 0;

export function renderHeroBanner(onSearch) {
  const section = document.createElement('section');
  section.className = 'hero';
  section.id = 'hero-banner';
  section.style.cssText = `
    position: relative;
    overflow: hidden;
    padding: 48px 0 40px;
    background: radial-gradient(circle at 80% 20%, rgba(255, 51, 102, 0.08) 0%, var(--clr-bg) 70%);
  `;

  const curDish = HERO_DISHES[activeHeroIndex];

  section.innerHTML = `
    <div class="hero__bg" style="opacity: 0.06; filter: blur(20px);"></div>
    <div class="hero__overlay" style="background: linear-gradient(180deg, transparent 0%, var(--clr-bg) 100%);"></div>
    
    <div class="container" style="position: relative; z-index: 2; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 36px; align-items: center;">
      
      <!-- Left Column: Search & Action Header -->
      <div class="hero__content" style="max-width: 100%; text-align: left; padding: 0;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(255, 51, 102, 0.12); border: 1px solid rgba(255, 51, 102, 0.3); padding: 5px 14px; border-radius: 99px; margin-bottom: 14px;">
          <span style="font-size: 13px;">⚡</span>
          <span style="font-size: 11px; font-weight: 800; color: #ff3366; text-transform: uppercase; letter-spacing: 0.8px;">Lightning Fast Delivery</span>
        </div>

        <h1 class="hero__title" style="font-size: clamp(28px, 3.8vw, 44px); line-height: 1.15; margin-bottom: 12px; font-weight: 900;">
          Craving Delicious Food?
          <br /><span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Delivered in 20 Minutes.</span>
        </h1>
        
        <p class="hero__subtitle" style="font-size: 14px; color: var(--clr-text-muted); margin-bottom: 20px; max-width: 500px; line-height: 1.6;">
          Order from 500+ top-rated restaurants, track your live courier in real time, or explore AI-curated fitness and mystery meals.
        </p>

        <!-- Search Bar with Glow -->
        <div class="hero__search-bar" style="margin-left: 0; max-width: 520px; box-shadow: var(--shadow-lg); border: 1px solid var(--clr-border); background: var(--clr-surface);">
          <input
            type="search"
            class="hero__search-input"
            id="hero-search-input"
            placeholder="Search dishes, restaurants, cuisines..."
            aria-label="Search for dishes or restaurants"
            style="font-size: 14px;"
          />
          <button class="hero__search-btn" id="hero-search-btn" style="background: var(--clr-primary); border: none; font-weight: 800; padding: 0 24px;">
            Search 🔍
          </button>
        </div>

        <!-- Quick Feature Discovery Pills -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px;">
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-fitmeal" style="background: rgba(0, 230, 118, 0.08); border: 1px solid rgba(0, 230, 118, 0.25); color: #00e676; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 5px 12px; cursor: pointer;">
            🥗 FitMeal AI Planner
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-mystery" style="background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.25); color: #f472b6; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 5px 12px; cursor: pointer;">
            🎁 Blind Mystery Box
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-match" style="background: rgba(255, 51, 102, 0.08); border: 1px solid rgba(255, 51, 102, 0.25); color: #ff5c8a; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 5px 12px; cursor: pointer;">
            💘 Flavour Swipe
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-spin" style="background: rgba(255, 165, 2, 0.08); border: 1px solid rgba(255, 165, 2, 0.25); color: #ffa502; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 5px 12px; cursor: pointer;">
            🎡 Spin & Win
          </button>
        </div>

        <!-- Live Platform Stats -->
        <div class="hero__stats" style="justify-content: flex-start; gap: 32px; margin-top: 24px;">
          <div class="hero__stat" style="text-align: left;">
            <div class="hero__stat-number" style="color: white; font-size: 22px; font-weight: 900;">500+</div>
            <div class="hero__stat-label" style="font-size: 11px; color: var(--clr-text-muted);">Verified Kitchens</div>
          </div>
          <div class="hero__stat" style="text-align: left;">
            <div class="hero__stat-number" style="color: #00e676; font-size: 22px; font-weight: 900;">18 min</div>
            <div class="hero__stat-label" style="font-size: 11px; color: var(--clr-text-muted);">Average Delivery</div>
          </div>
          <div class="hero__stat" style="text-align: left;">
            <div class="hero__stat-number" style="color: #ffb703; font-size: 22px; font-weight: 900;">4.9★</div>
            <div class="hero__stat-label" style="font-size: 11px; color: var(--clr-text-muted);">Customer Rating</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Clean Spotlight Card Showcase -->
      <div id="hero-spotlight-card" style="position: relative;">
        
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; padding: 20px; box-shadow: var(--shadow-xl);">
          
          <!-- Top Tag Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
            <span style="background: rgba(0, 230, 118, 0.12); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.3); padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 800;">
              🟢 TODAY'S SPECIAL
            </span>
            <span style="font-size: 11px; color: var(--clr-text-muted); font-weight: 600;" id="hero-dish-time">⏱️ ${curDish.time}</span>
          </div>

          <!-- Dish Photo Showcase -->
          <div style="position: relative; height: 230px; border-radius: 16px; overflow: hidden; margin-bottom: 14px;">
            <img
              id="hero-dish-img"
              src="${curDish.image}"
              alt="${curDish.name}"
              style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
            />
            
            <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); border-radius: var(--radius-full); padding: 4px 10px; font-size: 11px; font-weight: 800; color: #ffb703;">
              ⭐ ${curDish.rating}
            </div>

            <div style="position: absolute; bottom: 10px; right: 10px; background: var(--clr-primary); border-radius: var(--radius-full); padding: 4px 12px; font-size: 13px; font-weight: 900; color: white;">
              ${curDish.price}
            </div>
          </div>

          <!-- Dish Info & Switcher -->
          <div style="text-align: center;">
            <h3 id="hero-dish-title" style="font-size: 16px; font-weight: 800; color: white; margin: 0 0 4px;">${curDish.name}</h3>
            <div style="font-size: 12px; color: var(--clr-text-muted); margin-bottom: 12px;" id="hero-dish-tag">${curDish.tag}</div>
            
            <!-- Quick Dish Switcher Tabs -->
            <div style="display: flex; gap: 6px; justify-content: center; flex-wrap: wrap;" id="hero-dish-tabs">
              ${HERO_DISHES.map((d, idx) => `
                <button class="btn-hero-dish-tab ${idx === activeHeroIndex ? 'active-hero-tab' : ''}" data-idx="${idx}" style="font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: var(--radius-full); border: 1px solid ${idx === activeHeroIndex ? 'var(--clr-primary)' : 'var(--clr-border)'}; background: ${idx === activeHeroIndex ? 'var(--clr-primary)' : 'transparent'}; color: white; cursor: pointer; transition: all 0.2s;">
                  ${d.name.split(' ')[0]}
                </button>
              `).join('')}
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  // Search listeners
  const input = section.querySelector('#hero-search-input');
  const btn = section.querySelector('#hero-search-btn');

  btn.addEventListener('click', () => {
    const q = input.value.trim();
    if (q.length >= 2) onSearch(q);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q.length >= 2) onSearch(q);
    }
  });

  // Dish Tab Switchers
  section.querySelectorAll('.btn-hero-dish-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeHeroIndex = parseInt(tab.dataset.idx);
      const selected = HERO_DISHES[activeHeroIndex];

      section.querySelectorAll('.btn-hero-dish-tab').forEach(t => {
        t.style.background = 'transparent';
        t.style.borderColor = 'var(--clr-border)';
      });
      tab.style.background = 'var(--clr-primary)';
      tab.style.borderColor = 'var(--clr-primary)';

      // Update dish info
      const img = section.querySelector('#hero-dish-img');
      const title = section.querySelector('#hero-dish-title');
      const tag = section.querySelector('#hero-dish-tag');
      const time = section.querySelector('#hero-dish-time');

      if (img) img.src = selected.image;
      if (title) title.textContent = selected.name;
      if (tag) tag.textContent = selected.tag;
      if (time) time.textContent = `⏱️ ${selected.time}`;
    });
  });

  // Feature Pill Triggers
  section.querySelector('#hero-pill-fitmeal')?.addEventListener('click', openFitMealPlannerModal);
  section.querySelector('#hero-pill-mystery')?.addEventListener('click', openMysteryBoxModal);
  section.querySelector('#hero-pill-match')?.addEventListener('click', openTasteMatchModal);
  section.querySelector('#hero-pill-spin')?.addEventListener('click', openSpinWheelModal);

  return section;
}
