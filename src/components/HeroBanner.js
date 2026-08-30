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
    padding: 64px 0 48px;
    background: radial-gradient(circle at 70% 30%, rgba(252, 74, 26, 0.1) 0%, var(--clr-bg) 60%);
  `;

  const curDish = HERO_DISHES[activeHeroIndex];

  section.innerHTML = `
    <div class="hero__bg" style="opacity: 0.15; filter: blur(30px); background: url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&auto=format&fit=crop') center/cover; position: absolute; inset: 0;"></div>
    <div class="hero__overlay" style="background: linear-gradient(180deg, var(--clr-bg) 0%, rgba(11,15,25,0.7) 40%, var(--clr-bg) 100%); position: absolute; inset: 0;"></div>
    
    <div class="container hero__grid" style="position: relative; z-index: 2;">
      
      <!-- Left Column: Search & Action Header -->
      <div class="hero__content" style="max-width: 100%; text-align: left; padding: 0;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(252, 74, 26, 0.1); border: 1px solid rgba(252, 74, 26, 0.2); padding: 6px 16px; border-radius: 99px; margin-bottom: 16px;">
          <span style="font-size: 14px;">⚡</span>
          <span style="font-size: 11px; font-weight: 800; color: var(--clr-primary); text-transform: uppercase; letter-spacing: 1px;">Lightning Fast Delivery</span>
        </div>

        <h1 class="hero__title" style="font-size: clamp(32px, 4vw, 52px); line-height: 1.1; margin-bottom: 16px; font-weight: 900; letter-spacing: -0.5px;">
          Craving Delicious Food?
          <br /><span style="background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Delivered in 20 Minutes.</span>
        </h1>
        
        <p class="hero__subtitle" style="font-size: 15px; color: var(--clr-text-secondary); margin-bottom: 24px; max-width: 520px; line-height: 1.6;">
          Order from 500+ top-rated restaurants, track your live courier in real time, or explore AI-curated fitness and mystery meals.
        </p>

        <!-- Search Bar with Glow -->
        <div class="hero__search-bar" style="margin-left: 0; max-width: 540px; box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(252, 74, 26, 0.15); border: 1px solid var(--clr-border); background: var(--clr-bg-elevated); border-radius: var(--radius-full); padding: 6px; display: flex;">
          <input
            type="search"
            class="hero__search-input"
            id="hero-search-input"
            placeholder="Search dishes, restaurants, cuisines..."
            aria-label="Search for dishes or restaurants"
            style="font-size: 15px; border: none; background: transparent; color: white; padding: 12px 20px; flex: 1; outline: none;"
          />
          <button class="hero__search-btn" id="hero-search-btn" style="background: var(--grad-primary); border: none; font-weight: 800; padding: 0 28px; border-radius: var(--radius-full); color: white; cursor: pointer; transition: transform 0.2s;">
            Search
          </button>
        </div>

        <!-- Quick Feature Discovery Pills -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px;">
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-fitmeal" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #10b981; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 6px 14px; cursor: pointer; transition: all 0.2s;">
            🥗 FitMeal AI Planner
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-mystery" style="background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.2); color: #ec4899; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 6px 14px; cursor: pointer; transition: all 0.2s;">
            🎁 Blind Mystery Box
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="hero-pill-spin" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #f59e0b; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; padding: 6px 14px; cursor: pointer; transition: all 0.2s;">
            🎡 Spin & Win
          </button>
        </div>

        <!-- Live Platform Stats -->
        <div class="hero__stats" style="justify-content: flex-start; gap: 40px; margin-top: 32px; display: flex;">
          <div class="hero__stat" style="text-align: left;">
            <div class="hero__stat-number" style="color: white; font-size: 24px; font-weight: 900;">500+</div>
            <div class="hero__stat-label" style="font-size: 12px; color: var(--clr-text-muted);">Verified Kitchens</div>
          </div>
          <div class="hero__stat" style="text-align: left;">
            <div class="hero__stat-number" style="color: #10b981; font-size: 24px; font-weight: 900;">18 min</div>
            <div class="hero__stat-label" style="font-size: 12px; color: var(--clr-text-muted);">Average Delivery</div>
          </div>
          <div class="hero__stat" style="text-align: left;">
            <div class="hero__stat-number" style="color: #f59e0b; font-size: 24px; font-weight: 900;">4.9★</div>
            <div class="hero__stat-label" style="font-size: 12px; color: var(--clr-text-muted);">Customer Rating</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Clean Spotlight Card Showcase -->
      <div id="hero-spotlight-card" style="position: relative; perspective: 1000px;">
        
        <div style="background: var(--clr-bg-elevated); border: 1px solid var(--clr-border); border-radius: 24px; padding: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); transform-style: preserve-3d; transition: transform 0.3s ease;">
          
          <!-- Top Tag Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <span style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 12px; border-radius: 99px; font-size: 11px; font-weight: 800;">
              🟢 TODAY'S SPECIAL
            </span>
            <span style="font-size: 11px; color: var(--clr-text-muted); font-weight: 600; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 99px;" id="hero-dish-time">⏱️ ${curDish.time}</span>
          </div>

          <!-- Dish Photo Showcase -->
          <div style="position: relative; height: 260px; border-radius: 16px; overflow: hidden; margin-bottom: 16px; background: #1e293b;">
            <img
              id="hero-dish-img"
              src="${curDish.image}"
              alt="${curDish.name}"
              style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);"
            />
            
            <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%); pointer-events: none;"></div>

            <div style="position: absolute; bottom: 12px; left: 12px; background: rgba(15,23,42,0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-full); padding: 6px 12px; font-size: 12px; font-weight: 800; color: #facc15;">
              ⭐ ${curDish.rating}
            </div>

            <div style="position: absolute; bottom: 12px; right: 12px; background: var(--grad-primary); border-radius: var(--radius-full); padding: 6px 14px; font-size: 14px; font-weight: 900; color: white; box-shadow: 0 4px 12px rgba(252, 74, 26, 0.4);">
              ${curDish.price}
            </div>
          </div>

          <!-- Dish Info & Switcher -->
          <div style="text-align: center;">
            <h3 id="hero-dish-title" style="font-size: 18px; font-weight: 800; color: white; margin: 0 0 6px; font-family: var(--ff-heading);">${curDish.name}</h3>
            <div style="font-size: 12px; color: var(--clr-text-muted); margin-bottom: 16px;" id="hero-dish-tag">${curDish.tag}</div>
            
            <!-- Quick Dish Switcher Tabs -->
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;" id="hero-dish-tabs">
              ${HERO_DISHES.map((d, idx) => `
                <button class="btn-hero-dish-tab ${idx === activeHeroIndex ? 'active-hero-tab' : ''}" data-idx="${idx}" style="font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: var(--radius-full); border: 1px solid ${idx === activeHeroIndex ? 'var(--clr-primary)' : 'var(--clr-border)'}; background: ${idx === activeHeroIndex ? 'var(--clr-primary)' : 'rgba(255,255,255,0.03)'}; color: ${idx === activeHeroIndex ? 'white' : 'var(--clr-text-secondary)'}; cursor: pointer; transition: all 0.2s;">
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
