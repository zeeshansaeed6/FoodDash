// ============================================================
// Blind Mystery Gourmet Craving Box & Scratch Card Modal
// ============================================================
import { addToCart } from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';

let modalOverlayEl = null;

const TIERS = [
  {
    id: 'bronze',
    name: '🥉 Bronze Mystery Cravings',
    price: 199,
    value: '₹350+ value',
    color: '#cd7f32',
    icon: '🎁',
    desc: '1 Main Dish + 1 Appetizer + 1 Dip from top-rated kitchens',
    dishes: ['Paneer Butter Masala Roll', 'Crispy Peri-Peri Fries', 'Garlic Mayo Dip']
  },
  {
    id: 'silver',
    name: '🥈 Silver Gourmet Feast',
    price: 399,
    value: '₹650+ value',
    color: '#c0c0c0',
    icon: '✨',
    desc: '2 Main Courses + 1 Starter + 1 Dessert + Drink',
    dishes: ['Smoky Chicken Tikka Dum Biryani', 'Butter Garlic Naan', 'Gulab Jamun (2 pcs)', 'Spiced Mint Masala Chaas']
  },
  {
    id: 'gold',
    name: '🥇 Gold Luxury Crate',
    price: 699,
    value: '₹1,150+ value',
    color: '#ffd700',
    icon: '👑',
    desc: 'Chef Signature Platter + 2 Entrees + 2 Artisanal Desserts + 2 Premium Shakes',
    dishes: ['Truffle Alfredo Fettuccine', 'Classic Wood-fired Pizza', 'Warm Belgian Dark Chocolate Waffle', 'Lotus Biscoff Monster Shake']
  }
];

let selectedTier = TIERS[1]; // silver default
let dietaryType = 'all'; // all, veg, nonveg, desserts
let isUnboxed = false;
let isUnboxingAnimation = false;

export function initMysteryBoxModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'mystery-box-modal-overlay';
  document.body.appendChild(modalOverlayEl);
}

export function openMysteryBoxModal() {
  if (!modalOverlayEl) initMysteryBoxModal();
  isUnboxed = false;
  isUnboxingAnimation = false;
  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  sounds.playPop();
  renderMysteryBoxView();
}

export function closeMysteryBoxModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderMysteryBoxView() {
  if (!modalOverlayEl) return;

  modalOverlayEl.innerHTML = `
    <div class="login-modal mystery-modal" style="max-width: 620px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1b1026 0%, #0d0814 100%); padding: 18px 24px; border-bottom: 1px solid rgba(236, 72, 153, 0.25); position: relative;">
        <button id="mystery-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #ec4899, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 20px rgba(236, 72, 153, 0.4);">
            🎁
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #ec4899; letter-spacing: 1px;">Blind Taste Mystery Box</div>
            <h3 style="font-size: 20px; font-weight: 800; color: white; margin: 2px 0 0;">Surprise Craving Crate & Scratch Card</h3>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 20px;">
        
        ${!isUnboxed ? `
          <!-- Tier Selector -->
          <div>
            <div style="font-size: 13px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; margin-bottom: 10px;">
              1. Choose Mystery Crate Tier
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
              ${TIERS.map(t => `
                <div class="mystery-tier-card ${t.id === selectedTier.id ? 'active' : ''}" data-tier-id="${t.id}" style="background: var(--clr-surface); border: 2px solid ${t.id === selectedTier.id ? '#ec4899' : 'var(--clr-border)'}; border-radius: 14px; padding: 14px; text-align: center; cursor: pointer; transition: all 0.2s;">
                  <div style="font-size: 28px; margin-bottom: 6px;">${t.icon}</div>
                  <div style="font-weight: 800; font-size: 13px; color: white;">${t.name.split(' ')[1]}</div>
                  <div style="font-size: 16px; font-weight: 900; color: #ec4899; margin: 4px 0;">₹${t.price}</div>
                  <div style="font-size: 10px; color: #2ed573; font-weight: 700; background: rgba(46, 213, 115, 0.12); padding: 2px 6px; border-radius: 99px;">${t.value}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Dietary Filter -->
          <div>
            <div style="font-size: 13px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; margin-bottom: 10px;">
              2. Dietary Preferences
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-ghost btn-sm myst-diet-chip ${dietaryType === 'all' ? 'active' : ''}" data-diet="all" style="border-radius: var(--radius-full); font-size: 12px; padding: 6px 14px; border: 1px solid ${dietaryType === 'all' ? 'var(--clr-primary)' : 'var(--clr-border)'}; background: ${dietaryType === 'all' ? 'var(--clr-primary)' : 'transparent'}; color: white;">🍽️ All Specialties</button>
              <button type="button" class="btn btn-ghost btn-sm myst-diet-chip ${dietaryType === 'veg' ? 'active' : ''}" data-diet="veg" style="border-radius: var(--radius-full); font-size: 12px; padding: 6px 14px; border: 1px solid ${dietaryType === 'veg' ? '#00e676' : 'var(--clr-border)'}; background: ${dietaryType === 'veg' ? 'rgba(0, 230, 118, 0.2)' : 'transparent'}; color: #00e676;">🟢 100% Pure Veg</button>
              <button type="button" class="btn btn-ghost btn-sm myst-diet-chip ${dietaryType === 'nonveg' ? 'active' : ''}" data-diet="nonveg" style="border-radius: var(--radius-full); font-size: 12px; padding: 6px 14px; border: 1px solid ${dietaryType === 'nonveg' ? '#ff3366' : 'var(--clr-border)'}; background: ${dietaryType === 'nonveg' ? 'rgba(255, 51, 102, 0.2)' : 'transparent'}; color: #ff3366;">🍗 Non-Veg Feast</button>
              <button type="button" class="btn btn-ghost btn-sm myst-diet-chip ${dietaryType === 'desserts' ? 'active' : ''}" data-diet="desserts" style="border-radius: var(--radius-full); font-size: 12px; padding: 6px 14px; border: 1px solid ${dietaryType === 'desserts' ? '#a855f7' : 'var(--clr-border)'}; background: ${dietaryType === 'desserts' ? 'rgba(168, 85, 247, 0.2)' : 'transparent'}; color: #c084fc;">🍰 Sweet Tooth Only</button>
            </div>
          </div>

          <!-- Mystery Crate Showcase -->
          <div style="background: radial-gradient(circle at center, #2b153f 0%, #12091c 100%); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 16px; padding: 24px; text-align: center; position: relative; overflow: hidden;">
            <div id="mystery-crate-icon" style="font-size: 72px; margin-bottom: 12px; display: inline-block; ${isUnboxingAnimation ? 'animation: shake 0.5s infinite;' : 'animation: float 3s ease-in-out infinite;'}">
              🎁
            </div>
            <h4 style="font-size: 18px; font-weight: 800; color: white; margin-bottom: 4px;">${selectedTier.name}</h4>
            <p style="font-size: 12px; color: var(--clr-text-secondary); max-width: 380px; margin: 0 auto 16px;">
              ${selectedTier.desc}. Specially curated from top 4.5★+ chef kitchens in your city!
            </p>
            <button class="btn btn-primary" id="open-crate-btn" style="padding: 12px 32px; font-size: 14px; font-weight: 800; border-radius: var(--radius-full); background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; box-shadow: 0 0 25px rgba(236, 72, 153, 0.5); cursor: pointer;">
              ✨ Reveal & Unbox Mystery Crate
            </button>
          </div>
        ` : `
          <!-- Unboxed Reveal View -->
          <div style="background: linear-gradient(135deg, rgba(46, 213, 115, 0.1), rgba(139, 92, 246, 0.1)); border: 1.5px solid #2ed573; border-radius: 16px; padding: 20px; text-align: center; animation: scaleIn 0.4s ease;">
            <div style="font-size: 48px; margin-bottom: 8px;">🎉📦</div>
            <h4 style="font-size: 18px; font-weight: 900; color: #2ed573;">Mystery Bundle Revealed!</h4>
            <p style="font-size: 12px; color: white; margin-top: 2px;">Here is your specially curated chef feast (${selectedTier.value}):</p>
            
            <div style="display: flex; flex-direction: column; gap: 8px; margin: 16px 0; text-align: left;">
              ${selectedTier.dishes.map((dish, i) => `
                <div style="padding: 10px 14px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: 700; font-size: 13px; color: white;">🍲 ${dish}</span>
                  <span style="font-size: 11px; color: #00e676; font-weight: 700;">Included ✓</span>
                </div>
              `).join('')}
            </div>

            <!-- Digital Scratch Card -->
            <div style="background: linear-gradient(135deg, #ffa502, #ff4757); border-radius: 12px; padding: 14px; margin-top: 14px; color: white;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">🎁 Bonus Mystery Scratch Reward</div>
              <div style="font-size: 16px; font-weight: 900; margin-top: 4px;">FREE Belgian Choco Lava Cake (Code: MYSTERYLAVA)</div>
            </div>
          </div>
        `}

      </div>

      <!-- Footer Action -->
      <div style="padding: 16px 24px; background: var(--clr-bg-elevated); border-top: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 11px; color: var(--clr-text-muted);">Crate Bundle Price:</div>
          <div style="font-size: 20px; font-weight: 900; color: #ec4899;">₹${selectedTier.price} <span style="font-size: 12px; color: #2ed573; font-weight: 700;">(${selectedTier.value})</span></div>
        </div>

        <div style="display: flex; gap: 10px;">
          ${isUnboxed ? `
            <button class="btn btn-ghost" id="mystery-reroll-btn" style="padding: 10px 16px; font-size: 12px; border-radius: var(--radius-full); border: 1px solid var(--clr-border);">
              🔄 Re-Roll
            </button>
            <button class="btn btn-primary" id="mystery-add-cart-btn" style="padding: 10px 24px; font-size: 13px; font-weight: 800; border-radius: var(--radius-full); background: linear-gradient(135deg, #2ed573, #00b4d8); border: none; box-shadow: 0 0 20px rgba(46, 213, 115, 0.4);">
              🛒 Add Mystery Feast to Cart
            </button>
          ` : `
            <button class="btn btn-primary" id="mystery-quick-buy-btn" style="padding: 10px 24px; font-size: 13px; font-weight: 800; border-radius: var(--radius-full); background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none;">
              🎁 Buy Blind Box Directly
            </button>
          `}
        </div>
      </div>

    </div>
  `;

  // Close
  modalOverlayEl.querySelector('#mystery-close-btn').addEventListener('click', closeMysteryBoxModal);

  // Tier Click
  modalOverlayEl.querySelectorAll('.mystery-tier-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.tierId;
      selectedTier = TIERS.find(t => t.id === id) || TIERS[1];
      renderMysteryBoxView();
    });
  });

  // Diet click
  modalOverlayEl.querySelectorAll('.myst-diet-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      dietaryType = chip.dataset.diet;
      renderMysteryBoxView();
    });
  });

  // Open Crate
  modalOverlayEl.querySelector('#open-crate-btn')?.addEventListener('click', () => {
    isUnboxingAnimation = true;
    sounds.playSpinTick();
    renderMysteryBoxView();
    setTimeout(() => {
      isUnboxingAnimation = false;
      isUnboxed = true;
      sounds.playWinCoin();
      renderMysteryBoxView();
      showToast(`Unboxed ${selectedTier.name}! 🎉`, '🎁');
    }, 1200);
  });

  // Re-roll
  modalOverlayEl.querySelector('#mystery-reroll-btn')?.addEventListener('click', () => {
    isUnboxed = false;
    renderMysteryBoxView();
  });

  // Add to cart
  const addCartHandler = () => {
    addToCart({
      id: `mystery-${selectedTier.id}-${Date.now()}`,
      name: `${selectedTier.name} (${dietaryType.toUpperCase()})`,
      price: selectedTier.price,
      restaurant: 'Chef Curated Blind Box',
      restaurantId: 88,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      isVeg: dietaryType === 'veg'
    });
    sounds.playWinCoin();
    showToast(`Added ${selectedTier.name} to Cart! 🎁`, '🛒');
    closeMysteryBoxModal();
  };

  modalOverlayEl.querySelector('#mystery-add-cart-btn')?.addEventListener('click', addCartHandler);
  modalOverlayEl.querySelector('#mystery-quick-buy-btn')?.addEventListener('click', addCartHandler);
}
