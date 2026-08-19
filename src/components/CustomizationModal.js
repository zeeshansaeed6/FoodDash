// ============================================================
// Dish Customization & Nutrition Modal ("Build Your Dish")
// ============================================================
import { addToCart } from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { getFoodImage } from '../utils/foodImages.js';

let modalOverlayEl = null;
let currentItem = null;
let currentRestId = null;
let currentRestName = null;

export function initCustomizationModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'customization-modal-overlay';
  document.body.appendChild(modalOverlayEl);
}

export function openCustomizationModal(item, restaurantId, restaurantName) {
  initCustomizationModal();
  currentItem = item;
  currentRestId = restaurantId;
  currentRestName = restaurantName;

  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderCustomizationView();
}

export function closeCustomizationModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderCustomizationView() {
  if (!modalOverlayEl || !currentItem) return;

  const basePrice = currentItem.price;
  const isVeg = currentItem.isVeg;

  // Options state
  let selectedSize = 'Regular';
  let sizePrice = 0;
  let selectedStyle = 'Classic Traditional';
  let stylePrice = 0;
  let selectedSpice = 'Medium Balanced 🟡';
  const selectedDips = new Set();
  const selectedAddons = new Set();
  const cookingPreferences = new Set();
  let specialInstructions = '';

  const sizeOptions = [
    { label: 'Solo / Small', price: Math.max(0, Math.round(basePrice * -0.15)), desc: 'Light portion for 1' },
    { label: 'Regular', price: 0, desc: 'Standard authentic portion' },
    { label: 'Medium Feast (+35%)', price: Math.round(basePrice * 0.35), desc: 'Generous serving for 1-2' },
    { label: 'Jumbo Party Pack (+70%)', price: Math.round(basePrice * 0.7), desc: 'Feast pack for sharing' }
  ];

  const styleOptions = [
    { id: 'classic', label: 'Classic Traditional', price: 0, desc: 'Chef’s original master recipe' },
    { id: 'multigrain', label: 'Whole Wheat / Multigrain', price: 20, desc: 'High fiber, healthy wholesome base' },
    { id: 'cheeseburst', label: 'Double Cheese Burst', price: 59, desc: 'Rich molten cheese center' },
    { id: 'keto', label: 'Keto / Low Carb', price: 35, desc: 'Grain-free, high protein base' }
  ];

  const spiceOptions = [
    { label: 'Zero Spice 🟢', desc: 'Aromatic & mild, no chili heat' },
    { label: 'Mild Aromatic 🌿', desc: 'Subtle warmth with garden herbs' },
    { label: 'Medium Balanced 🟡', desc: 'Balanced signature house spice' },
    { label: 'Fiery Hot 🌶️🔥', desc: 'Authentic chili kick for spice lovers' },
    { label: 'Ghost Pepper 💀', desc: 'Extreme fiery heat experience' }
  ];

  const dipOptions = [
    { id: 'garlic-aioli', name: 'Garlic Truffle Aioli Dip', price: 29, kcal: 65, icon: '🧄' },
    { id: 'peri-mayo', name: 'Zesty Peri-Peri Mayo', price: 25, kcal: 70, icon: '🌶️' },
    { id: 'mint-chutney', name: 'Fresh Mint & Coriander Chutney', price: 19, kcal: 25, icon: '🌿' },
    { id: 'cheese-queso', name: 'Warm Molten Cheddar Queso', price: 35, kcal: 85, icon: '🧀' },
    { id: 'bbq-sauce', name: 'Smoky Chipotle BBQ Glaze', price: 29, kcal: 45, icon: '🍯' }
  ];

  const addonOptions = [
    { id: 'cheese', name: 'Extra Molten Mozzarella / Cheese Blend', price: 49, kcal: 90, protein: 5 },
    { id: 'protein', name: isVeg ? 'Crispy Garlic Paneer Cubes' : 'Tender Grilled Chicken Tikka Strips', price: 69, kcal: 110, protein: 12 },
    { id: 'mushrooms', name: 'Sautéed Butter Herb Mushrooms & Sweet Corn', price: 45, kcal: 50, protein: 3 },
    { id: 'crunch', name: 'Crispy Fried Onion Shallots & Jalapenos', price: 25, kcal: 40, protein: 1 },
    { id: 'dryfruits', name: 'Toasted Cashew Nuts & Almond Flakes', price: 39, kcal: 80, protein: 4 },
    { id: 'beverage', name: 'Chilled Artisanal Masala Soda / Beverage', price: 45, kcal: 70, protein: 0 },
  ];

  const cookingToggles = [
    { id: 'low-oil', label: '🥗 Less Oil & Light Salt' },
    { id: 'extra-crispy', label: '🔥 Extra Crispy / Well Done' },
    { id: 'no-onion-garlic', label: '🧄 Jain Style / No Onion-Garlic' },
    { id: 'eco-cutlery', label: '🌱 Don’t Send Plastic Cutlery' }
  ];

  function calculateTotals() {
    let addonsTotal = 0;
    let extraKcal = 0;
    let extraProtein = 0;

    selectedDips.forEach(dipId => {
      const found = dipOptions.find(d => d.id === dipId);
      if (found) {
        addonsTotal += found.price;
        extraKcal += found.kcal;
      }
    });

    selectedAddons.forEach(addonId => {
      const found = addonOptions.find(a => a.id === addonId);
      if (found) {
        addonsTotal += found.price;
        extraKcal += found.kcal;
        extraProtein += found.protein;
      }
    });

    const totalPrice = Math.max(0, basePrice + sizePrice + stylePrice + addonsTotal);
    const baseKcal = isVeg ? 340 : 480;
    const baseProtein = isVeg ? 14 : 30;
    const baseCarbs = 42;
    const baseFats = isVeg ? 12 : 20;

    const sizeMult = selectedSize.includes('Small') ? 0.8 : selectedSize.includes('Medium') ? 1.35 : selectedSize.includes('Jumbo') ? 1.7 : 1;

    const finalKcal = Math.round(baseKcal * sizeMult + extraKcal + (stylePrice > 0 ? 60 : 0));
    const finalProtein = Math.round(baseProtein * sizeMult + extraProtein + (selectedStyle.includes('Keto') ? 6 : 0));
    const finalCarbs = Math.round(baseCarbs * sizeMult - (selectedStyle.includes('Keto') ? 15 : 0));
    const finalFats = Math.round(baseFats * sizeMult + Math.round(addonsTotal / 10));

    return {
      totalPrice,
      macros: {
        calories: finalKcal,
        protein: finalProtein,
        carbs: finalCarbs,
        fats: finalFats
      }
    };
  }

  function updateUI() {
    const { totalPrice, macros } = calculateTotals();

    const priceBtn = modalOverlayEl.querySelector('#custom-add-btn');
    if (priceBtn) {
      priceBtn.innerHTML = `Add to Order • ₹${totalPrice}`;
    }

    const kcalEl = modalOverlayEl.querySelector('#macro-kcal');
    const protEl = modalOverlayEl.querySelector('#macro-prot');
    const carbEl = modalOverlayEl.querySelector('#macro-carb');
    const fatsEl = modalOverlayEl.querySelector('#macro-fats');

    if (kcalEl) kcalEl.textContent = `${macros.calories} kcal`;
    if (protEl) protEl.textContent = `${macros.protein}g`;
    if (carbEl) carbEl.textContent = `${macros.carbs}g`;
    if (fatsEl) fatsEl.textContent = `${macros.fats}g`;
  }

  const foodImg = (currentItem.image && !currentItem.image.includes('/images/rest')) ? currentItem.image : getFoodImage(currentItem.name, '', isVeg);

  modalOverlayEl.innerHTML = `
    <div class="login-modal custom-builder-modal" style="max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Hero Header -->
      <div style="position: relative; background: linear-gradient(135deg, #1b202c 0%, #11141c 100%); border-bottom: 1px solid var(--clr-border);">
        <button id="custom-close-btn" style="position: absolute; right: 16px; top: 16px; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 50%; width: 34px; height: 34px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">✕</button>
        
        <div style="display: flex; gap: 16px; padding: 20px 24px; align-items: center;">
          <img src="${foodImg}" alt="${currentItem.name}" style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover; border: 2px solid var(--clr-border);" />
          <div style="flex: 1; padding-right: 28px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span class="veg-indicator ${isVeg ? '' : 'nonveg'}"></span>
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--clr-text-muted);">${currentRestName}</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 800; color: white; margin: 0 0 4px;">${currentItem.name}</h3>
            <div style="font-size: 13px; color: var(--clr-primary); font-weight: 700;">Base Price: ₹${basePrice}</div>
          </div>
        </div>

        <!-- Live Dynamic Macro Counter Bar -->
        <div style="background: rgba(0,0,0,0.35); border-top: 1px solid var(--clr-border); padding: 8px 24px; display: flex; justify-content: space-around; font-size: 12px;">
          <div style="text-align: center;"><span style="color: var(--clr-text-muted);">⚡ Energy:</span> <b id="macro-kcal" style="color: #ffb703;">0 kcal</b></div>
          <div style="text-align: center;"><span style="color: var(--clr-text-muted);">💪 Protein:</span> <b id="macro-prot" style="color: #00e676;">0g</b></div>
          <div style="text-align: center;"><span style="color: var(--clr-text-muted);">🌾 Carbs:</span> <b id="macro-carb" style="color: #00b4d8;">0g</b></div>
          <div style="text-align: center;"><span style="color: var(--clr-text-muted);">🥑 Fats:</span> <b id="macro-fats" style="color: #e0aaff;">0g</b></div>
        </div>
      </div>

      <!-- Scrollable Customizer Body -->
      <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Step 1: Portion Size -->
        <div>
          <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span>1. Choose Portion Size</span>
            <span style="font-size: 11px; color: var(--clr-primary); background: rgba(255,71,87,0.1); padding: 2px 8px; border-radius: 4px;">Required</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${sizeOptions.map((s, idx) => `
              <label class="custom-option-card ${idx === 1 ? 'selected' : ''}" data-size-idx="${idx}" style="display: flex; flex-direction: column; justify-content: space-between; padding: 10px 12px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="radio" name="custom-size" value="${s.label}" ${idx === 1 ? 'checked' : ''} style="accent-color: var(--clr-primary);" />
                    <span style="font-weight: 700; font-size: 13px; color: white;">${s.label}</span>
                  </div>
                  <span style="font-weight: 700; font-size: 12px; color: ${s.price > 0 ? 'var(--clr-primary)' : 'var(--clr-text-muted)'};">
                    ${s.price > 0 ? `+₹${s.price}` : s.price < 0 ? `-₹${Math.abs(s.price)}` : 'Included'}
                  </span>
                </div>
                <div style="font-size: 11px; color: var(--clr-text-muted); padding-left: 24px;">${s.desc}</div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Step 2: Base / Style -->
        <div>
          <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span>2. Crust & Preparation Style</span>
            <span style="font-size: 11px; color: var(--clr-text-muted);">Select 1</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${styleOptions.map((st, idx) => `
              <label class="custom-style-card ${idx === 0 ? 'selected' : ''}" data-style-idx="${idx}" style="display: flex; flex-direction: column; justify-content: space-between; padding: 10px 12px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="radio" name="custom-style" value="${st.label}" ${idx === 0 ? 'checked' : ''} style="accent-color: var(--clr-primary);" />
                    <span style="font-weight: 700; font-size: 13px; color: white;">${st.label}</span>
                  </div>
                  <span style="font-weight: 700; font-size: 12px; color: ${st.price > 0 ? 'var(--clr-primary)' : 'var(--clr-text-muted)'};">
                    ${st.price > 0 ? `+₹${st.price}` : 'Included'}
                  </span>
                </div>
                <div style="font-size: 11px; color: var(--clr-text-muted); padding-left: 24px;">${st.desc}</div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Step 3: Spice Level -->
        <div>
          <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px;">
            3. Spice & Heat Level
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 6px;">
            ${spiceOptions.map(sp => `
              <label class="custom-spice-chip ${sp.label.includes('Medium') ? 'selected' : ''}" data-spice="${sp.label}" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 8px 6px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="custom-spice" value="${sp.label}" ${sp.label.includes('Medium') ? 'checked' : ''} style="display: none;" />
                <span style="font-size: 12px; font-weight: 700; color: white;">${sp.label}</span>
                <span style="font-size: 10px; color: var(--clr-text-muted); margin-top: 2px;">${sp.desc.split(',')[0]}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Step 4: Dips & Sauces -->
        <div>
          <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span>4. Gourmet Artisanal Dips & Sauces</span>
            <span style="font-size: 11px; color: var(--clr-text-muted);">Optional (Choose any)</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${dipOptions.map(dip => `
              <label class="custom-dip-row" data-dip-id="${dip.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" name="custom-dip" value="${dip.id}" style="accent-color: var(--clr-primary);" />
                  <div>
                    <div style="font-weight: 600; font-size: 12px; color: white;">${dip.icon} ${dip.name}</div>
                    <div style="font-size: 10px; color: var(--clr-text-muted);">+${dip.kcal} kcal</div>
                  </div>
                </div>
                <div style="font-weight: 700; font-size: 12px; color: var(--clr-primary);">+₹${dip.price}</div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Step 5: Add-ons & Extras -->
        <div>
          <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px; display: flex; justify-content: space-between;">
            <span>5. Extra Toppings & Sides</span>
            <span style="font-size: 11px; color: var(--clr-text-muted);">Optional</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${addonOptions.map(addon => `
              <label class="custom-addon-row" data-addon-id="${addon.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 10px; cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <input type="checkbox" name="custom-addon" value="${addon.id}" style="accent-color: var(--clr-primary); width: 16px; height: 16px;" />
                  <div>
                    <div style="font-weight: 600; font-size: 13px; color: white;">${addon.name}</div>
                    <div style="font-size: 11px; color: var(--clr-text-muted);">+${addon.kcal} kcal • +${addon.protein}g protein</div>
                  </div>
                </div>
                <div style="font-weight: 700; font-size: 13px; color: var(--clr-primary);">+₹${addon.price}</div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Step 6: Cooking & Prep Preferences -->
        <div>
          <div style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 8px;">
            6. Cooking & Chef Preferences
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
            ${cookingToggles.map(t => `
              <label class="custom-pref-chip" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 8px; cursor: pointer; font-size: 12px; color: white;">
                <input type="checkbox" name="custom-cook-pref" value="${t.label}" style="accent-color: var(--clr-primary);" />
                <span>${t.label}</span>
              </label>
            `).join('')}
          </div>
          <input 
            type="text" 
            id="custom-instructions" 
            placeholder="Special instructions (e.g. Extra napkins, no cilantro, pack gravy separately)..." 
            class="login-modal__input" 
            style="font-size: 13px; padding: 10px 14px;"
            maxlength="150"
          />
        </div>

      </div>

      <!-- Footer Action -->
      <div style="padding: 16px 24px; background: var(--clr-bg-elevated); border-top: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <button class="btn btn-secondary" id="custom-cancel-btn" style="padding: 10px 18px;">Cancel</button>
        <button class="btn btn-primary" id="custom-add-btn" style="flex: 1; padding: 12px 20px; font-weight: 700; font-size: 14px; border-radius: 10px; box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);">
          Add to Order • ₹${basePrice}
        </button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  modalOverlayEl.querySelector('#custom-close-btn').addEventListener('click', closeCustomizationModal);
  modalOverlayEl.querySelector('#custom-cancel-btn').addEventListener('click', closeCustomizationModal);

  // Size changes
  modalOverlayEl.querySelectorAll('input[name="custom-size"]').forEach((radio, i) => {
    radio.addEventListener('change', () => {
      selectedSize = radio.value;
      sizePrice = sizeOptions[i].price;
      modalOverlayEl.querySelectorAll('.custom-option-card').forEach((card, idx) => {
        card.classList.toggle('selected', idx === i);
      });
      updateUI();
    });
  });

  // Style changes
  modalOverlayEl.querySelectorAll('input[name="custom-style"]').forEach((radio, i) => {
    radio.addEventListener('change', () => {
      selectedStyle = radio.value;
      stylePrice = styleOptions[i].price;
      modalOverlayEl.querySelectorAll('.custom-style-card').forEach((card, idx) => {
        card.classList.toggle('selected', idx === i);
      });
      updateUI();
    });
  });

  // Spice changes
  modalOverlayEl.querySelectorAll('.custom-spice-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      modalOverlayEl.querySelectorAll('.custom-spice-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const radio = chip.querySelector('input');
      if (radio) {
        radio.checked = true;
        selectedSpice = radio.value;
      }
      updateUI();
    });
  });

  // Dips changes
  modalOverlayEl.querySelectorAll('input[name="custom-dip"]').forEach(chk => {
    chk.addEventListener('change', () => {
      if (chk.checked) {
        selectedDips.add(chk.value);
      } else {
        selectedDips.delete(chk.value);
      }
      chk.closest('.custom-dip-row')?.classList.toggle('selected', chk.checked);
      updateUI();
    });
  });

  // Addons changes
  modalOverlayEl.querySelectorAll('input[name="custom-addon"]').forEach(chk => {
    chk.addEventListener('change', () => {
      if (chk.checked) {
        selectedAddons.add(chk.value);
      } else {
        selectedAddons.delete(chk.value);
      }
      chk.closest('.custom-addon-row')?.classList.toggle('selected', chk.checked);
      updateUI();
    });
  });

  // Cooking Preferences changes
  modalOverlayEl.querySelectorAll('input[name="custom-cook-pref"]').forEach(chk => {
    chk.addEventListener('change', () => {
      if (chk.checked) {
        cookingPreferences.add(chk.value);
      } else {
        cookingPreferences.delete(chk.value);
      }
    });
  });

  // Add to cart submission
  modalOverlayEl.querySelector('#custom-add-btn').addEventListener('click', () => {
    const rawNote = modalOverlayEl.querySelector('#custom-instructions')?.value.trim() || '';
    const prefs = Array.from(cookingPreferences);
    const combinedInstructions = [prefs.join(', '), rawNote].filter(Boolean).join(' | ');
    const { totalPrice, macros } = calculateTotals();

    const selectedDipNames = Array.from(selectedDips).map(id => {
      return dipOptions.find(d => d.id === id)?.name;
    }).filter(Boolean);

    const selectedAddonNames = Array.from(selectedAddons).map(id => {
      return addonOptions.find(a => a.id === id)?.name.split('/')[0].trim();
    }).filter(Boolean);

    const allExtras = [...selectedDipNames, ...selectedAddonNames];

    const customization = {
      size: selectedSize,
      style: selectedStyle,
      spice: selectedSpice,
      addons: allExtras,
      instructions: combinedInstructions,
      totalPrice,
      macros,
      options: {
        size: selectedSize,
        style: selectedStyle,
        spice: selectedSpice,
        dips: Array.from(selectedDips),
        addons: Array.from(selectedAddons),
        preferences: prefs,
        instructions: combinedInstructions
      }
    };

    addToCart(currentItem, currentRestId, currentRestName, customization);
    sounds.playPop();
    showToast(`Customized ${currentItem.name} added!`, '✨');
    closeCustomizationModal();
  });

  updateUI();
}
