// ============================================================
// AI "Food Mood" & Craving Assistant Recommender
// ============================================================
import { addToCart } from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { fetchRestaurants } from '../api/client.js';
import { getActiveLocation } from './LocationModal.js';
import { getFoodImage } from '../utils/foodImages.js';

let modalOverlayEl = null;
let onNavigateCallback = null;

export function initAICravingModal(onNavigate) {
  onNavigateCallback = onNavigate;
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'ai-craving-modal-overlay';
  document.body.appendChild(modalOverlayEl);
}

export function openAICravingModal() {
  if (!modalOverlayEl) initAICravingModal(onNavigateCallback);
  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  sounds.playPop();
  renderAICravingView();
}

export function closeAICravingModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

const MOODS = [
  { id: 'late-night', title: 'Late Night Comfort', icon: '🌙', desc: 'Indulgent, warm & soul-satisfying', tags: ['biryani', 'pizza', 'burgers', 'rolls'] },
  { id: 'protein', title: 'Post-Workout High Protein', icon: '💪', desc: 'Lean meats, paneer, healthy bowls', tags: ['healthy', 'north-indian'] },
  { id: 'party', title: 'Party Feast with Friends', icon: '🍕🎉', desc: 'Sharing pizzas, platters & bites', tags: ['pizza', 'burgers', 'chinese'] },
  { id: 'rainy', title: 'Rainy Day Chai & Snacks', icon: '☕🌧️', desc: 'Hot samosas, rolls, piping curries', tags: ['coffee', 'rolls', 'south-indian'] },
  { id: 'budget', title: 'Budget Saver under ₹250', icon: '💸', desc: 'Maximum flavor, pocket friendly', tags: ['rolls', 'thali', 'south-indian'] },
  { id: 'healthy', title: 'Clean & Guilt-Free Eating', icon: '🥗', desc: 'Low calorie, fresh & nutrient dense', tags: ['healthy', 'south-indian'] },
  { id: 'sweet', title: 'Sweet Tooth & Desserts', icon: '🍰', desc: 'Ice creams, cheesecakes & brownies', tags: ['desserts', 'ice-cream', 'bakery'] },
  { id: 'sushi-asian', title: 'Asian Wok & Sushi', icon: '🍣', desc: 'Fresh maki, dim sums & pad thai', tags: ['sushi', 'chinese', 'momos'] },
  { id: 'spicy-challenge', title: 'Fiery Hot Spice Challenge', icon: '🌶️🔥', desc: 'Ghost pepper, Schezwan & hot wings', tags: ['biryani', 'chinese', 'burgers'] },
  { id: 'italian-pasta', title: 'Italian Gourmet & Pasta', icon: '🍝', desc: 'Creamy Alfredo, ravioli & garlic bread', tags: ['pasta', 'pizza'] },
  { id: 'street-chaat', title: 'Street Food & Chaat Craving', icon: '🍛', desc: 'Crispy golgappas, pav bhaji & bhel', tags: ['street-food', 'rolls'] },
  { id: 'bbq-grill', title: 'Smoky Texas BBQ & Tikkas', icon: '🍗', desc: 'Charcoal grills, kebabs & wings', tags: ['bbq', 'north-indian'] }
];

async function renderAICravingView() {
  if (!modalOverlayEl) return;

  const loc = getActiveLocation();
  let selectedMood = MOODS[0];
  let maxBudget = 500;
  let dietMode = 'all'; // 'all', 'veg', 'nonveg'
  let isGenerating = false;

  modalOverlayEl.innerHTML = `
    <div class="login-modal ai-modal" style="max-width: 680px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Header with AI Glow -->
      <div style="background: linear-gradient(135deg, #181d28 0%, #10131a 100%); border-bottom: 1px solid var(--clr-border); padding: 20px 24px; position: relative;">
        <button id="ai-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #ff4757, #9b5de5); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 20px rgba(155, 93, 229, 0.4);">
            ✨
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: #9b5de5;">AI Food Mood Assistant</div>
            <h3 style="font-size: 19px; font-weight: 800; color: white; margin: 2px 0 0;">What are you craving today?</h3>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Mood Selector Grid -->
        <div>
          <div style="font-size: 13px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 10px;">
            1. Select Your Current Vibe
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px;" id="mood-grid">
            ${MOODS.map((m, idx) => `
              <div class="mood-card ${idx === 0 ? 'selected' : ''}" data-mood-id="${m.id}" style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; padding: 12px; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 22px; margin-bottom: 4px;">${m.icon}</div>
                <div style="font-weight: 700; font-size: 13px; color: white;">${m.title}</div>
                <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 2px;">${m.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Controls: Budget Slider & Diet -->
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 8px;">
              <span>Max Budget:</span>
              <span style="color: var(--clr-primary);" id="ai-budget-val">₹${maxBudget}</span>
            </div>
            <input type="range" id="ai-budget-range" min="150" max="1200" step="50" value="${maxBudget}" style="width: 100%; accent-color: var(--clr-primary);" />
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--clr-text-muted); margin-top: 4px;">
              <span>₹150 (Budget)</span>
              <span>₹1200+ (Feast)</span>
            </div>
          </div>

          <div>
            <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Dietary Filter:</div>
            <div style="display: flex; gap: 6px;" id="ai-diet-chips">
              <button class="cart-chip active" data-diet="all" style="padding: 6px 12px; font-size: 12px;">All Dishes</button>
              <button class="cart-chip" data-diet="veg" style="padding: 6px 12px; font-size: 12px;">🥬 Pure Veg</button>
              <button class="cart-chip" data-diet="nonveg" style="padding: 6px 12px; font-size: 12px;">🍗 Non-Veg</button>
            </div>
          </div>
        </div>

        <!-- AI Match Generator Button -->
        <button class="btn btn-primary" id="ai-generate-btn" style="padding: 12px; font-size: 14px; font-weight: 700; border-radius: 12px; background: linear-gradient(135deg, #ff4757, #9b5de5); border: none; box-shadow: 0 6px 20px rgba(155, 93, 229, 0.35);">
          🪄 Generate AI Craving Matches in ${loc.city || 'Your City'}
        </button>

        <!-- Recommendations Container -->
        <div id="ai-results-container" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="text-align: center; color: var(--clr-text-muted); font-size: 13px; padding: 20px;">
            Click above to generate intelligent craving matches for <b>${selectedMood.title}</b>.
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach controls
  modalOverlayEl.querySelector('#ai-close-btn').addEventListener('click', closeAICravingModal);

  // Mood selection
  modalOverlayEl.querySelectorAll('.mood-card').forEach(card => {
    card.addEventListener('click', () => {
      modalOverlayEl.querySelectorAll('.mood-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const moodId = card.dataset.moodId;
      selectedMood = MOODS.find(m => m.id === moodId) || MOODS[0];
      sounds.playPop();
      triggerGenerate();
    });
  });

  // Budget range
  const budgetRange = modalOverlayEl.querySelector('#ai-budget-range');
  const budgetVal = modalOverlayEl.querySelector('#ai-budget-val');
  budgetRange.addEventListener('input', (e) => {
    maxBudget = parseInt(e.target.value, 10);
    budgetVal.textContent = `₹${maxBudget}`;
  });
  budgetRange.addEventListener('change', () => {
    triggerGenerate();
  });

  // Diet selection
  modalOverlayEl.querySelectorAll('#ai-diet-chips button').forEach(btn => {
    btn.addEventListener('click', () => {
      modalOverlayEl.querySelectorAll('#ai-diet-chips button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      dietMode = btn.dataset.diet;
      triggerGenerate();
    });
  });

  // Generate button
  modalOverlayEl.querySelector('#ai-generate-btn').addEventListener('click', () => {
    triggerGenerate();
  });

  async function triggerGenerate() {
    const resultsEl = modalOverlayEl.querySelector('#ai-results-container');
    if (!resultsEl) return;

    resultsEl.innerHTML = `
      <div style="text-align: center; padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
        <div class="spinner" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-size: 13px; color: var(--clr-text-muted);">AI is scanning menus for <b style="color:white;">${selectedMood.title}</b>...</div>
      </div>
    `;

    try {
      const restaurants = await fetchRestaurants(loc.cityId || 'bangalore');
      
      // Filter dishes based on tags, budget, and diet
      const matchedDishes = [];

      restaurants.forEach(rest => {
        if (!rest.menu) return;
        Object.keys(rest.menu).forEach(category => {
          rest.menu[category].forEach(item => {
            if (dietMode === 'veg' && !item.isVeg) return;
            if (dietMode === 'nonveg' && item.isVeg) return;
            if (item.price > maxBudget) return;

            // Score match based on mood tags
            let matchScore = 0;
            const itemText = (item.name + ' ' + (item.desc || '') + ' ' + rest.cuisines.join(' ')).toLowerCase();

            selectedMood.tags.forEach(tag => {
              if (itemText.includes(tag.toLowerCase()) || (rest.categories && rest.categories.includes(tag))) {
                matchScore += 2;
              }
            });

            if (item.isBestseller) matchScore += 1;

            if (matchScore > 0 || Math.random() > 0.4) {
              matchedDishes.push({
                item,
                restaurant: rest,
                matchScore,
                reason: getAIReason(selectedMood.id, item)
              });
            }
          });
        });
      });

      // Sort and take top 4
      matchedDishes.sort((a, b) => b.matchScore - a.matchScore);
      const topPicks = matchedDishes.slice(0, 4);

      if (topPicks.length === 0) {
        resultsEl.innerHTML = `
          <div style="text-align: center; padding: 24px; background: var(--clr-surface); border-radius: 12px;">
            <div style="font-size: 28px; margin-bottom: 8px;">🍽️</div>
            <div style="font-weight: 700; color: white;">No exact matches within ₹${maxBudget}</div>
            <div style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px;">Try increasing your budget slider or changing diet filter.</div>
          </div>
        `;
        return;
      }

      sounds.playChime();

      resultsEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
          <div style="font-size: 13px; font-weight: 700; color: white;">✨ Top AI Picks For You (${topPicks.length})</div>
          <span style="font-size: 11px; color: #00e676; background: rgba(0,230,118,0.1); padding: 2px 8px; border-radius: 4px;">98% Craving Match</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${topPicks.map((pick, idx) => {
            const foodImg = (pick.item.image && !pick.item.image.includes('/images/rest')) ? pick.item.image : getFoodImage(pick.item.name, '', pick.item.isVeg);
            return `
            <div class="ai-match-card" style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; padding: 14px; display: flex; gap: 14px; align-items: center; transition: all 0.2s;">
              <img src="${foodImg}" alt="${pick.item.name}" style="width: 72px; height: 72px; border-radius: 10px; object-fit: cover;" />
              
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="veg-indicator ${pick.item.isVeg ? '' : 'nonveg'}"></span>
                  <span style="font-weight: 700; font-size: 14px; color: white;">${pick.item.name}</span>
                </div>
                <div style="font-size: 12px; color: var(--clr-text-muted); margin-top: 2px;">
                  from <b style="color: white;">${pick.restaurant.name}</b> • ⭐ ${pick.restaurant.rating} (${pick.restaurant.deliveryTime})
                </div>
                <div style="font-size: 11px; color: #ffb703; margin-top: 4px; display: flex; align-items: center; gap: 4px;">
                  <span>💡</span> <span>${pick.reason}</span>
                </div>
              </div>

              <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
                <div style="font-size: 15px; font-weight: 800; color: var(--clr-primary);">₹${pick.item.price}</div>
                <button class="btn btn-primary btn-sm ai-add-btn" data-rest-id="${pick.restaurant.id}" data-rest-name="${pick.restaurant.name}" data-item-idx="${idx}" style="padding: 6px 14px; font-size: 12px; border-radius: 8px;">
                  + Add
                </button>
              </div>
            </div>
          `;
          }).join('')}
        </div>
      `;

      // Attach add button listeners
      resultsEl.querySelectorAll('.ai-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const itemIdx = parseInt(btn.dataset.itemIdx, 10);
          const restId = parseInt(btn.dataset.restId, 10);
          const restName = btn.dataset.restName;
          const selected = topPicks[itemIdx];

          if (selected) {
            addToCart(selected.item, restId, restName);
            sounds.playPop();
            showToast(`${selected.item.name} added to cart!`, '🎉');
            btn.textContent = '✓ Added';
            btn.style.background = '#00e676';
          }
        });
      });

    } catch (e) {
      resultsEl.innerHTML = `<div style="color: #ff5252; text-align: center; padding: 20px;">Could not load restaurant menu suggestions.</div>`;
    }
  }

  function getAIReason(moodId, item) {
    if (moodId === 'protein') return `High protein (${item.isVeg ? '18g' : '34g'}) to fuel muscle recovery`;
    if (moodId === 'late-night') return 'Rich, warm & freshly prepared late-night comfort pick';
    if (moodId === 'party') return 'Crowd favorite & perfect for sharing with friends';
    if (moodId === 'budget') return 'Top value deal with maximum portion and flavor';
    if (moodId === 'healthy') return 'Clean ingredients with balanced nutritional macros';
    return 'Popular chef recommendation rated highly by foodies';
  }

  // Trigger initial generate
  triggerGenerate();
}
