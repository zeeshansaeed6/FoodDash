// ============================================================
// Flavour Matchmaker & "Food Tinder" Card Swipe Experience
// ============================================================
import { addToCart } from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';

let modalOverlayEl = null;

const DISH_CARDS = [
  {
    id: 'swipe-1',
    name: 'Truffle Mushroom Double Cheese Smash Burger',
    restaurant: 'The Burger Den',
    price: 329,
    rating: 4.8,
    time: '20-25m',
    tags: ['🍔 Burger', '🧀 Cheesy', '🍄 Gourmet Truffle'],
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    matchScore: '98% Taste Match 🔥',
    isVeg: true
  },
  {
    id: 'swipe-2',
    name: 'Charcoal Smoked Dum Hyderabadi Chicken Biryani',
    restaurant: 'Nawab Royal Kitchen',
    price: 379,
    rating: 4.9,
    time: '25-30m',
    tags: ['🍗 Authentic Dum', '🌶️ Medium Spice', '👑 Bestseller'],
    calories: '750 kcal',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    matchScore: '96% Taste Match 🔥',
    isVeg: false
  },
  {
    id: 'swipe-3',
    name: 'Creamy Garlic Butter Truffle Fettuccine Alfredo',
    restaurant: 'Trattoria Bella',
    price: 359,
    rating: 4.7,
    time: '20-30m',
    tags: ['🍝 Handmade Pasta', '🧄 Garlic Herb', '🇮🇹 Italian'],
    calories: '620 kcal',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281734?w=600&auto=format&fit=crop&q=80',
    matchScore: '94% Taste Match 🔥',
    isVeg: true
  },
  {
    id: 'swipe-4',
    name: 'Crunchy Tempura Prawns & Salmon Sushi Maki Roll',
    restaurant: 'Tokyo Street Wok',
    price: 449,
    rating: 4.9,
    time: '25-35m',
    tags: ['🍣 Fresh Sushi', '🥢 Wasabi Aioli', '✨ Chef Special'],
    calories: '480 kcal',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    matchScore: '95% Taste Match 🔥',
    isVeg: false
  },
  {
    id: 'swipe-5',
    name: 'Belgian Dark Chocolate Molten Waffle with Ice Cream',
    restaurant: 'The Waffle & Berry Co.',
    price: 249,
    rating: 4.9,
    time: '15-20m',
    tags: ['🧇 Belgian Waffle', '🍫 Pure Callebaut', '🍦 Vanilla Bean'],
    calories: '540 kcal',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&auto=format&fit=crop&q=80',
    matchScore: '99% Sweet Tooth Match 🍰',
    isVeg: true
  }
];

let currentIndex = 0;
let likedDishes = [];

export function initTasteMatchModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'taste-match-modal-overlay';
  document.body.appendChild(modalOverlayEl);
}

export function openTasteMatchModal() {
  if (!modalOverlayEl) initTasteMatchModal();
  currentIndex = 0;
  likedDishes = [];
  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  sounds.playPop();
  renderTasteMatchView();
}

export function closeTasteMatchModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleSwipe(action) {
  const currentDish = DISH_CARDS[currentIndex];
  if (!currentDish) return;

  if (action === 'like' || action === 'superlike') {
    likedDishes.push(currentDish);
    sounds.playWinCoin();
    showToast(`Matched with ${currentDish.name}! ❤️`, '🎉');
  } else {
    sounds.playPop();
  }

  currentIndex++;
  renderTasteMatchView();
}

function renderTasteMatchView() {
  if (!modalOverlayEl) return;

  const currentDish = DISH_CARDS[currentIndex];
  const isFinished = !currentDish;

  modalOverlayEl.innerHTML = `
    <div class="login-modal match-modal" style="max-width: 480px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1b101c 0%, #0d0812 100%); padding: 16px 20px; border-bottom: 1px solid rgba(255, 51, 102, 0.25); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 22px;">💘</span>
          <div>
            <div style="font-size: 10px; text-transform: uppercase; font-weight: 800; color: #ff3366; letter-spacing: 1px;">Flavour Matchmaker</div>
            <h3 style="font-size: 16px; font-weight: 800; color: white; margin: 0;">Swipe Your Cravings</h3>
          </div>
        </div>
        <button id="match-close-btn" style="background: rgba(255,255,255,0.08); border-radius: 50%; width: 30px; height: 30px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Body / Swiper Area -->
      <div style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        
        ${!isFinished ? `
          <!-- Dish Card -->
          <div id="active-swipe-card" style="width: 100%; max-width: 380px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 20px; overflow: hidden; box-shadow: var(--shadow-xl); position: relative; transition: all 0.3s ease;">
            
            <!-- Image & Badges -->
            <div style="position: relative; height: 260px; overflow: hidden;">
              <img src="${currentDish.image}" alt="${currentDish.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%);"></div>
              
              <!-- Match score tag -->
              <div style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid #ff3366; border-radius: var(--radius-full); padding: 4px 10px; font-size: 11px; font-weight: 800; color: #ff3366;">
                ${currentDish.matchScore}
              </div>

              <!-- Time & Rating -->
              <div style="position: absolute; bottom: 12px; left: 14px; right: 14px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                  <span style="font-size: 11px; color: #ffa502; font-weight: bold; background: rgba(0,0,0,0.6); padding: 2px 8px; border-radius: var(--radius-full);">⭐ ${currentDish.rating}</span>
                  <span style="font-size: 11px; color: white; margin-left: 6px;">⏱️ ${currentDish.time}</span>
                </div>
                <div style="font-size: 20px; font-weight: 900; color: #00e676;">₹${currentDish.price}</div>
              </div>
            </div>

            <!-- Content Area -->
            <div style="padding: 16px;">
              <div style="font-size: 11px; color: var(--clr-text-muted); font-weight: 700; text-transform: uppercase;">${currentDish.restaurant}</div>
              <h4 style="font-size: 17px; font-weight: 800; color: white; margin: 4px 0 8px;">${currentDish.name}</h4>
              
              <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                ${currentDish.tags.map(tag => `<span style="font-size: 10px; padding: 2px 8px; border-radius: 99px; background: rgba(255,255,255,0.06); border: 1px solid var(--clr-border); color: var(--clr-text-secondary);">${tag}</span>`).join('')}
              </div>
            </div>

          </div>

          <!-- Swipe Controls -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 20px;">
            <button id="swipe-pass-btn" title="Pass / Swipe Left" style="width: 54px; height: 54px; border-radius: 50%; background: var(--clr-surface); border: 2px solid #ff4757; color: #ff4757; font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(255, 71, 87, 0.25); transition: transform 0.2s;">
              ✕
            </button>
            <button id="swipe-super-btn" title="Super Like ⭐" style="width: 44px; height: 44px; border-radius: 50%; background: var(--clr-surface); border: 2px solid #00b4d8; color: #00b4d8; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
              ⭐
            </button>
            <button id="swipe-like-btn" title="Match & Order ❤️" style="width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, #ff3366, #ff758c); border: none; color: white; font-size: 26px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(255, 51, 102, 0.4); transition: transform 0.2s;">
              ❤️
            </button>
          </div>
        ` : `
          <!-- Finished Screen -->
          <div style="text-align: center; padding: 20px 0; width: 100%;">
            <div style="font-size: 54px; margin-bottom: 10px;">🎉❤️</div>
            <h3 style="font-size: 20px; font-weight: 900; color: white;">It's a Flavor Match!</h3>
            <p style="font-size: 12px; color: var(--clr-text-secondary); margin: 4px 0 16px;">
              You matched with ${likedDishes.length} incredible dishes tailored to your cravings.
            </p>

            <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; text-align: left;">
              ${likedDishes.map(d => `
                <div style="padding: 10px 14px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <div style="font-size: 13px; font-weight: 700; color: white;">${d.name}</div>
                    <div style="font-size: 10px; color: var(--clr-text-muted);">${d.restaurant} • ₹${d.price}</div>
                  </div>
                  <span style="font-size: 11px; color: #ff3366; font-weight: bold;">Matched ❤️</span>
                </div>
              `).join('')}
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
              <button class="btn btn-ghost" id="match-restart-btn" style="border-radius: var(--radius-full); font-size: 12px; padding: 8px 18px; border: 1px solid var(--clr-border);">
                🔄 Swipe Again
              </button>
              <button class="btn btn-primary" id="match-add-all-btn" style="border-radius: var(--radius-full); font-size: 13px; font-weight: 800; padding: 10px 24px; background: linear-gradient(135deg, #ff3366, #ff758c); border: none;">
                🛒 Add Matches to Cart
              </button>
            </div>
          </div>
        `}

      </div>
    </div>
  `;

  // Close
  modalOverlayEl.querySelector('#match-close-btn').addEventListener('click', closeTasteMatchModal);

  // Swipe Action Buttons
  modalOverlayEl.querySelector('#swipe-pass-btn')?.addEventListener('click', () => handleSwipe('pass'));
  modalOverlayEl.querySelector('#swipe-super-btn')?.addEventListener('click', () => handleSwipe('superlike'));
  modalOverlayEl.querySelector('#swipe-like-btn')?.addEventListener('click', () => handleSwipe('like'));

  // Restart
  modalOverlayEl.querySelector('#match-restart-btn')?.addEventListener('click', () => {
    currentIndex = 0;
    likedDishes = [];
    renderTasteMatchView();
  });

  // Add all matches to cart
  modalOverlayEl.querySelector('#match-add-all-btn')?.addEventListener('click', () => {
    likedDishes.forEach(d => {
      addToCart({
        id: d.id,
        name: d.name,
        price: d.price,
        restaurant: d.restaurant,
        restaurantId: 77,
        image: d.image,
        isVeg: d.isVeg
      });
    });
    sounds.playWinCoin();
    showToast(`Added ${likedDishes.length} matched dishes to Cart! 🛒`, '🎉');
    closeTasteMatchModal();
  });
}
