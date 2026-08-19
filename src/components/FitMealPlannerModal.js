// ============================================================
// FitMeal AI Planner & Nutrition Macro Tracker Modal
// ============================================================
import { addToCart } from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { getFoodImage } from '../utils/foodImages.js';

let modalOverlayEl = null;

const GOALS = [
  { id: 'muscle', name: 'Muscle Gain (Hypertrophy)', icon: '💪', calMul: 1.15, pRatio: 0.35, cRatio: 0.45, fRatio: 0.20, desc: 'High protein surplus for lean muscle hypertrophy' },
  { id: 'fatloss', name: 'Fat Loss (Caloric Deficit)', icon: '🔥', calMul: 0.82, pRatio: 0.40, cRatio: 0.35, fRatio: 0.25, desc: 'High satiety protein with controlled healthy carbs' },
  { id: 'keto', name: 'Keto & Low-Carb', icon: '🥑', calMul: 0.90, pRatio: 0.30, cRatio: 0.10, fRatio: 0.60, desc: 'Ketogenic state with healthy fats and leafy greens' },
  { id: 'endurance', name: 'Athletic Endurance', icon: '⚡', calMul: 1.10, pRatio: 0.25, cRatio: 0.55, fRatio: 0.20, desc: 'Complex carbohydrate powerhouse for stamina & runners' },
  { id: 'balanced', name: 'Balanced Wellness', icon: '🥗', calMul: 1.00, pRatio: 0.30, cRatio: 0.45, fRatio: 0.25, desc: 'Clean wholesome nutrition for longevity and energy' }
];

const MEAL_DATABASE = {
  muscle: [
    { meal: 'Breakfast (8:30 AM)', name: 'Egg White & Oats Power Bowl with Peanut Butter', rest: 'Protein Co. Cafe', calories: 480, protein: 36, carbs: 52, fats: 14, price: 199, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Lunch (1:30 PM)', name: 'Grilled Herb Chicken Breast with Brown Rice & Broccoli', rest: 'FitFuel Gourmet', calories: 650, protein: 55, carbs: 62, fats: 16, price: 299, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Pre-Workout Snack (5:00 PM)', name: 'Whey Protein Greek Yogurt Parfait with Berries', rest: 'The Healthy Bowl', calories: 280, protein: 28, carbs: 26, fats: 6, price: 149, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Dinner (8:30 PM)', name: 'Paneer / Tofu Tikka Quinoa Power Bowl', rest: 'Green Detox Kitchen', calories: 520, protein: 38, carbs: 48, fats: 16, price: 269, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ],
  fatloss: [
    { meal: 'Breakfast (8:30 AM)', name: 'Avocado & Boiled Egg Protein Mash on Sourdough', rest: 'FitFuel Gourmet', calories: 340, protein: 24, carbs: 28, fats: 12, price: 189, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Lunch (1:30 PM)', name: 'Smoky Tandoori Chicken Tikka with Garden Greens', rest: 'Protein Co. Cafe', calories: 420, protein: 46, carbs: 18, fats: 14, price: 279, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Snack (5:00 PM)', name: 'Cold Pressed Green Celery & Apple Detox Juice', rest: 'Green Detox Kitchen', calories: 110, protein: 3, carbs: 22, fats: 1, price: 129, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Dinner (8:30 PM)', name: 'Zucchini Noodle Bowl with Grilled Lemon Tofu', rest: 'The Healthy Bowl', calories: 360, protein: 28, carbs: 24, fats: 12, price: 239, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ],
  keto: [
    { meal: 'Breakfast (8:30 AM)', name: 'Double Cheese & Butter Scrambled Eggs with Sausage', rest: 'FitFuel Gourmet', calories: 460, protein: 32, carbs: 4, fats: 34, price: 219, image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Lunch (1:30 PM)', name: 'Grilled Salmon / Paneer Caesar Bowl with Parmesan', rest: 'The Healthy Bowl', calories: 580, protein: 42, carbs: 8, fats: 42, price: 349, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Snack (5:00 PM)', name: 'Roasted Almond & Sea Salt Keto Fat Bomb Bowl', rest: 'Protein Co. Cafe', calories: 220, protein: 8, carbs: 5, fats: 19, price: 139, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Dinner (8:30 PM)', name: 'Creamy Garlic Butter Herb Chicken with Spinach', rest: 'Green Detox Kitchen', calories: 540, protein: 48, carbs: 6, fats: 38, price: 299, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ],
  endurance: [
    { meal: 'Breakfast (8:30 AM)', name: 'Overnight Chia Banana Berry Power Oatmeal', rest: 'The Healthy Bowl', calories: 520, protein: 22, carbs: 84, fats: 12, price: 179, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Lunch (1:30 PM)', name: 'Teriyaki Chicken / Tofu Soba Noodle Bowl', rest: 'FitFuel Gourmet', calories: 680, protein: 40, carbs: 95, fats: 14, price: 289, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Snack (5:00 PM)', name: 'High Electrolyte Coconut Date Energy Smoothie', rest: 'Green Detox Kitchen', calories: 290, protein: 12, carbs: 52, fats: 4, price: 149, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Dinner (8:30 PM)', name: 'Slow Roasted Sweet Potato & Grilled Paneer Bowl', rest: 'Protein Co. Cafe', calories: 590, protein: 32, carbs: 82, fats: 15, price: 259, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ],
  balanced: [
    { meal: 'Breakfast (8:30 AM)', name: 'South Indian Steamed Idli Sambar & Almond Shake', rest: 'The Healthy Bowl', calories: 420, protein: 18, carbs: 64, fats: 10, price: 169, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Lunch (1:30 PM)', name: 'Classic Brown Rice Mediterranean Thali Bowl', rest: 'FitFuel Gourmet', calories: 580, protein: 35, carbs: 70, fats: 16, price: 279, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Snack (5:00 PM)', name: 'Mixed Fruit & Flax Seed Antioxidant Bowl', rest: 'Green Detox Kitchen', calories: 210, protein: 6, carbs: 38, fats: 5, price: 139, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
    { meal: 'Dinner (8:30 PM)', name: 'Herb Grilled Paneer / Chicken with Sauteed Veggies', rest: 'Protein Co. Cafe', calories: 490, protein: 38, carbs: 42, fats: 18, price: 289, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
  ]
};

let userGoal = 'muscle';
let userWeight = 70; // kg
let userActivity = 'moderate'; // sedentary, light, moderate, heavy

export function initFitMealPlannerModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'fitmeal-modal-overlay';
  document.body.appendChild(modalOverlayEl);
}

export function openFitMealPlannerModal() {
  if (!modalOverlayEl) initFitMealPlannerModal();
  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  sounds.playPop();
  renderFitMealView();
}

export function closeFitMealPlannerModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function calculateMacros() {
  const goalObj = GOALS.find(g => g.id === userGoal) || GOALS[0];
  let baseBmr = userWeight * 24;
  let actMultiplier = userActivity === 'sedentary' ? 1.2 : userActivity === 'light' ? 1.375 : userActivity === 'moderate' ? 1.55 : 1.75;
  let targetCalories = Math.round(baseBmr * actMultiplier * goalObj.calMul);
  let proteinGrams = Math.round((targetCalories * goalObj.pRatio) / 4);
  let carbsGrams = Math.round((targetCalories * goalObj.cRatio) / 4);
  let fatsGrams = Math.round((targetCalories * goalObj.fRatio) / 9);

  return { targetCalories, proteinGrams, carbsGrams, fatsGrams, goalObj };
}

function renderFitMealView() {
  if (!modalOverlayEl) return;

  const { targetCalories, proteinGrams, carbsGrams, fatsGrams, goalObj } = calculateMacros();
  const mealPlan = MEAL_DATABASE[userGoal] || MEAL_DATABASE.muscle;
  const totalMealCal = mealPlan.reduce((acc, m) => acc + m.calories, 0);
  const totalMealProt = mealPlan.reduce((acc, m) => acc + m.protein, 0);
  const totalMealCarbs = mealPlan.reduce((acc, m) => acc + m.carbs, 0);
  const totalMealFats = mealPlan.reduce((acc, m) => acc + m.fats, 0);
  const totalPlanPrice = mealPlan.reduce((acc, m) => acc + m.price, 0);

  modalOverlayEl.innerHTML = `
    <div class="login-modal fitmeal-modal" style="max-width: 820px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0e1e17 0%, #08100d 100%); padding: 18px 24px; border-bottom: 1px solid rgba(0, 230, 118, 0.2); position: relative;">
        <button id="fitmeal-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 14px; background: linear-gradient(135deg, #00e676, #00b4d8); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 20px rgba(0, 230, 118, 0.4);">
            🥗
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #00e676; letter-spacing: 1px;">AI Nutrition & Macro Engine</div>
            <h3 style="font-size: 20px; font-weight: 800; color: white; margin: 2px 0 0;">FitMeal AI Daily Macro Planner</h3>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Goal Selection Chips -->
        <div>
          <div style="font-size: 13px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; margin-bottom: 10px;">
            1. Select Your Fitness Target
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 8px;">
            ${GOALS.map(g => `
              <button type="button" class="fit-goal-card ${g.id === userGoal ? 'active' : ''}" data-goal="${g.id}" style="padding: 10px 12px; background: ${g.id === userGoal ? 'rgba(0, 230, 118, 0.15)' : 'var(--clr-surface)'}; border: 1.5px solid ${g.id === userGoal ? '#00e676' : 'var(--clr-border)'}; border-radius: 12px; text-align: left; cursor: pointer; transition: all 0.2s;">
                <div style="font-size: 20px; margin-bottom: 4px;">${g.icon}</div>
                <div style="font-weight: 700; font-size: 12px; color: white;">${g.name.split(' ')[0]} ${g.name.split(' ')[1] || ''}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Macro Dashboard Card -->
        <div style="background: linear-gradient(135deg, rgba(0, 230, 118, 0.08), rgba(0, 180, 216, 0.08)); border: 1px solid rgba(0, 230, 118, 0.25); border-radius: 16px; padding: 18px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #00e676; text-transform: uppercase;">Daily Recommended Targets</div>
              <div style="font-size: 16px; font-weight: 800; color: white;">${goalObj.name}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 12px; color: var(--clr-text-muted);">Weight: </span>
              <input type="number" id="fit-weight-input" value="${userWeight}" min="40" max="150" style="width: 60px; padding: 4px 8px; border-radius: 8px; border: 1px solid var(--clr-border); background: var(--clr-bg); color: white; font-weight: 700; text-align: center;" />
              <span style="font-size: 12px; color: var(--clr-text-muted);">kg</span>
            </div>
          </div>

          <!-- Macro Pills Grid -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
            <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px 8px;">
              <div style="font-size: 11px; color: var(--clr-text-muted); font-weight: 600;">CALORIES</div>
              <div style="font-size: 18px; font-weight: 900; color: #00e676; margin-top: 2px;">${targetCalories}</div>
              <div style="font-size: 10px; color: var(--clr-text-secondary);">Plan: ${totalMealCal} kcal</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px 8px;">
              <div style="font-size: 11px; color: var(--clr-text-muted); font-weight: 600;">PROTEIN</div>
              <div style="font-size: 18px; font-weight: 900; color: #ff3366; margin-top: 2px;">${proteinGrams}g</div>
              <div style="font-size: 10px; color: var(--clr-text-secondary);">Plan: ${totalMealProt}g</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px 8px;">
              <div style="font-size: 11px; color: var(--clr-text-muted); font-weight: 600;">CARBS</div>
              <div style="font-size: 18px; font-weight: 900; color: #ffb703; margin-top: 2px;">${carbsGrams}g</div>
              <div style="font-size: 10px; color: var(--clr-text-secondary);">Plan: ${totalMealCarbs}g</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); border-radius: 12px; padding: 12px 8px;">
              <div style="font-size: 11px; color: var(--clr-text-muted); font-weight: 600;">FATS</div>
              <div style="font-size: 18px; font-weight: 900; color: #a855f7; margin-top: 2px;">${fatsGrams}g</div>
              <div style="font-size: 10px; color: var(--clr-text-secondary);">Plan: ${totalMealFats}g</div>
            </div>
          </div>
        </div>

        <!-- Daily Meal Plan Schedule -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="font-size: 13px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase;">
              2. Curated Daily Meal Schedule
            </div>
            <span style="font-size: 11px; color: #00e676; font-weight: 600;">⚡ Tailored from top verified health kitchens</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${mealPlan.map((m, idx) => `
              <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <img src="${m.image}" alt="${m.name}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; border: 1px solid var(--clr-border);" />
                  <div>
                    <div style="font-size: 10px; font-weight: 800; color: #00e676; text-transform: uppercase;">${m.meal}</div>
                    <div style="font-weight: 700; font-size: 14px; color: white;">${m.name}</div>
                    <div style="font-size: 11px; color: var(--clr-text-muted);">${m.rest} • <span style="color: #ff3366; font-weight: 600;">${m.protein}g Protein</span> • ${m.calories} kcal</div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="text-align: right;">
                    <div style="font-size: 14px; font-weight: 800; color: white;">₹${m.price}</div>
                    <div style="font-size: 10px; color: var(--clr-text-muted);">P:${m.protein}g C:${m.carbs}g F:${m.fats}g</div>
                  </div>
                  <button class="btn btn-outline btn-sm fit-add-single-btn" data-meal-idx="${idx}" style="padding: 6px 14px; font-size: 11px; border-radius: var(--radius-full); border-color: #00e676; color: #00e676;">
                    + Add Meal
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div style="padding: 16px 24px; background: var(--clr-bg-elevated); border-top: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div>
          <div style="font-size: 11px; color: var(--clr-text-muted);">Full Day 4-Meal Plan Bundle:</div>
          <div style="font-size: 18px; font-weight: 900; color: white;">₹${totalPlanPrice} <span style="font-size: 12px; color: #00e676; font-weight: 700;">(Includes 15% Macro Bundle OFF)</span></div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-ghost" id="fitmeal-download-btn" style="padding: 10px 18px; font-size: 12px; border: 1px solid var(--clr-border); border-radius: var(--radius-full);">
            📄 Export Schedule
          </button>
          <button class="btn btn-primary" id="fitmeal-add-all-btn" style="padding: 10px 24px; font-size: 13px; font-weight: 800; border-radius: var(--radius-full); background: linear-gradient(135deg, #00e676, #00b4d8); border: none; box-shadow: 0 0 20px rgba(0, 230, 118, 0.4);">
            🛒 Add Whole Day Plan to Cart
          </button>
        </div>
      </div>

    </div>
  `;

  // Attach Listeners
  modalOverlayEl.querySelector('#fitmeal-close-btn').addEventListener('click', closeFitMealPlannerModal);

  // Goal switches
  modalOverlayEl.querySelectorAll('.fit-goal-card').forEach(btn => {
    btn.addEventListener('click', () => {
      userGoal = btn.dataset.goal;
      renderFitMealView();
    });
  });

  // Weight input
  modalOverlayEl.querySelector('#fit-weight-input')?.addEventListener('change', (e) => {
    userWeight = parseInt(e.target.value, 10) || 70;
    renderFitMealView();
  });

  // Single Meal Add
  modalOverlayEl.querySelectorAll('.fit-add-single-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.mealIdx, 10);
      const m = mealPlan[idx];
      addToCart({
        id: `fit-${userGoal}-${idx}`,
        name: `${m.name} (${m.meal.split(' ')[0]})`,
        price: m.price,
        restaurant: m.rest,
        restaurantId: 99,
        image: m.image,
        isVeg: !m.name.toLowerCase().includes('chicken') && !m.name.toLowerCase().includes('salmon') && !m.name.toLowerCase().includes('egg')
      });
      sounds.playPop();
      showToast(`Added ${m.name} to cart! 🥗`, '💪');
    });
  });

  // Add all
  modalOverlayEl.querySelector('#fitmeal-add-all-btn')?.addEventListener('click', () => {
    mealPlan.forEach((m, idx) => {
      addToCart({
        id: `fit-${userGoal}-${idx}`,
        name: `${m.name} (${m.meal.split(' ')[0]})`,
        price: m.price,
        restaurant: m.rest,
        restaurantId: 99,
        image: m.image,
        isVeg: !m.name.toLowerCase().includes('chicken') && !m.name.toLowerCase().includes('salmon') && !m.name.toLowerCase().includes('egg')
      });
    });
    sounds.playWinCoin();
    showToast(`Whole Day 4-Meal Plan added to Cart! (${totalMealProt}g Protein) 🚀`, '🎉');
    closeFitMealPlannerModal();
  });

  // Export
  modalOverlayEl.querySelector('#fitmeal-download-btn')?.addEventListener('click', () => {
    showToast(`Macro schedule downloaded for ${goalObj.name}! 📄`, '✅');
  });
}
