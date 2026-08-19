import { addToCart } from './CartState.js';
import { showToast } from './Toast.js';
import { getFoodImage } from '../utils/foodImages.js';

let inspectorModalEl = null;

export function open3DFoodInspectorModal(dishItem = null, restaurant = null) {
  const existing = document.getElementById('food-3d-inspector-modal-overlay');
  if (existing) existing.remove();

  const item = dishItem || {
    id: 101,
    name: 'Gourmet Double Smash Truffle Burger',
    price: 349,
    isVeg: false,
    image: getFoodImage('Double Smash Burger', 'Burgers', false),
    desc: 'Dual prime smash patties, aged English cheddar, black truffle aioli, and crisp butterhead lettuce on a toasted brioche bun.',
    calories: 620,
    protein: 34,
    carbs: 48,
    fats: 28,
    spiceLevel: 2,
    layers: [
      { name: 'Toasted Brioche Bun', icon: '🍞', desc: 'Butter-toasted artisanal bun' },
      { name: 'Truffle Garlic Aioli', icon: '🧄', desc: 'Infused with black winter truffles' },
      { name: 'Double Prime Smash Patty', icon: '🥩', desc: '100% grass-fed beef with crust' },
      { name: 'Aged English Cheddar', icon: '🧀', desc: 'Melted sharp yellow cheddar' },
      { name: 'Crisp Butterhead Lettuce', icon: '🥬', desc: 'Hydroponic farm-fresh greens' }
    ]
  };

  const rest = restaurant || {
    id: 2,
    name: 'The Burger Club',
    rating: 4.8,
    deliveryTime: '20-25 min'
  };

  inspectorModalEl = document.createElement('div');
  inspectorModalEl.className = 'login-overlay active';
  inspectorModalEl.id = 'food-3d-inspector-modal-overlay';

  inspectorModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 820px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; padding: 0; background: #0c0a1a; border: 1.5px solid rgba(255, 107, 0, 0.4); box-shadow: 0 0 50px rgba(255, 107, 0, 0.3);">
      
      <!-- Top Modal Header -->
      <div style="background: linear-gradient(135deg, #1c0a2a 0%, #0c0a1a 100%); padding: 18px 24px; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="background: linear-gradient(135deg, #ff6b00, #ec4899); color: white; padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 900; letter-spacing: 0.5px;">
            ✨ 3D INTERACTIVE DISH SHOWCASE
          </span>
          <h2 style="font-size: 18px; font-weight: 800; margin: 0; color: white;">${item.name}</h2>
        </div>
        <button id="btn-3d-close" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">✕</button>
      </div>

      <!-- Main Body: 3D Stage + Layer Exploder + Nutrition -->
      <div style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: 1.1fr 1fr; gap: 24px; padding: 24px;">
        
        <!-- Left: 3D Floating Dish Composition -->
        <div style="background: radial-gradient(circle at 50% 50%, #2e0854 0%, #030712 100%); border-radius: var(--radius-2xl); border: 1px solid rgba(255,255,255,0.1); position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 16px; perspective: 1000px;">
          
          <!-- Orbit Ring -->
          <div style="position: absolute; width: 240px; height: 240px; border-radius: 50%; border: 2px dashed rgba(255, 107, 0, 0.35); animation: orbit3D 14s linear infinite; pointer-events: none;"></div>

          <!-- Steam Plumes -->
          <div style="position: absolute; top: 20px; font-size: 26px; animation: steamRise 3s infinite ease-out;">♨️</div>

          <!-- 3D Floating Hero Dish Circle -->
          <div id="inspector-3d-dish-target" style="width: 190px; height: 190px; border-radius: 50%; padding: 6px; background: linear-gradient(135deg, #ff6b00, #ec4899); box-shadow: 0 20px 45px rgba(0,0,0,0.6), 0 0 35px rgba(255,107,0,0.5); animation: float3DHero 5s ease-in-out infinite; transform-style: preserve-3d; transition: transform 0.2s ease-out; margin-bottom: 20px;">
            <img
              src="${item.image || getFoodImage(item.name, 'Main Course', item.isVeg)}"
              alt="${item.name}"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid rgba(255,255,255,0.9);"
            />
          </div>

          <!-- Interactive 3D Exploded Ingredients Hierarchy -->
          <div style="width: 100%;">
            <div style="font-size: 11px; font-weight: 800; color: #ffb703; text-transform: uppercase; margin-bottom: 8px; text-align: center;">
              🥞 3D Layered Recipe Breakdown
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${(item.layers || [
                { name: 'Crispy Sourdough Crust / Bun', icon: '🍞', desc: 'Freshly baked base' },
                { name: 'Signature Secret Sauce', icon: '🥫', desc: 'Chef-crafted spice blend' },
                { name: 'Prime Sautéed Filling', icon: '🥩', desc: 'Marinated & grilled' },
                { name: 'Fresh Farm Greens & Herbs', icon: '🌿', desc: 'Crisp aromatic garnish' }
              ]).map((l, i) => `
                <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; transition: all 0.2s; transform: translateZ(${i * 10}px);">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">${l.icon}</span>
                    <span style="font-weight: 700; color: white;">${l.name}</span>
                  </div>
                  <span style="font-size: 10px; color: var(--clr-text-muted);">${l.desc}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right: Dish Specifications, Spice Heat & Order Action -->
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <div>
                <span style="font-size: 13px; color: var(--clr-text-muted);">🏪 ${rest.name}</span>
                <div style="font-size: 11px; color: #4ade80; font-weight: 700;">⏱️ ${rest.deliveryTime} • ⭐ ${rest.rating}</div>
              </div>
              <span style="font-size: 24px; font-weight: 900; color: #4ade80;">₹${item.price}</span>
            </div>

            <p style="font-size: 13px; color: var(--clr-text-muted); line-height: 1.5; margin-bottom: 18px;">
              ${item.desc}
            </p>

            <!-- 3D Macro Nutritional Breakdown -->
            <div style="font-size: 11px; font-weight: 800; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 8px;">
              🥗 Nutritional Health Profile
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 18px;">
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px; text-align: center;">
                <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Energy</div>
                <div style="font-size: 15px; font-weight: 900; color: white;">${item.calories || 520} kcal</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px; text-align: center;">
                <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Protein</div>
                <div style="font-size: 15px; font-weight: 900; color: #38bdf8;">${item.protein || 28}g</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px; text-align: center;">
                <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Carbs</div>
                <div style="font-size: 15px; font-weight: 900; color: #fbbf24;">${item.carbs || 44}g</div>
              </div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px; text-align: center;">
                <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Fats</div>
                <div style="font-size: 15px; font-weight: 900; color: #f87171;">${item.fats || 18}g</div>
              </div>
            </div>

            <!-- Spice Intensity Meter -->
            <div style="background: rgba(255,107,0,0.08); border: 1px solid rgba(255,107,0,0.25); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px;">
              <div style="font-size: 11px; font-weight: 800; color: #ff9f43; text-transform: uppercase; margin-bottom: 4px;">Spice Intensity Rating</div>
              <div style="font-size: 13px; font-weight: 800; color: white; display: flex; align-items: center; gap: 8px;">
                <span>🔥🌶️🌶️</span> Medium Hot (Authentic Chef Recipe)
              </div>
            </div>
          </div>

          <!-- Add to Cart Action -->
          <div>
            <button class="btn btn-primary" id="btn-3d-add-cart" style="width: 100%; padding: 14px; font-size: 15px; font-weight: 800; border-radius: var(--radius-md); background: linear-gradient(135deg, #10b981, #059669); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.45);">
              <span>⚡</span> Add to Cart • ₹${item.price}
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(inspectorModalEl);

  // Close handlers
  inspectorModalEl.querySelector('#btn-3d-close').addEventListener('click', () => inspectorModalEl.remove());
  inspectorModalEl.addEventListener('click', (e) => {
    if (e.target === inspectorModalEl) inspectorModalEl.remove();
  });

  // Add to cart
  inspectorModalEl.querySelector('#btn-3d-add-cart')?.addEventListener('click', () => {
    addToCart(item, rest.id, rest.name);
    showToast(`Added ${item.name} to Cart! 🛍️`, '✅');
    inspectorModalEl.remove();
  });
}
