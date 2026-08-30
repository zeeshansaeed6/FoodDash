import { 
  getCart, 
  getCartTotal, 
  getCartCount, 
  getCartMacros,
  getDashCoins,
  spendDashCoins,
  updateItemQty, 
  clearCart, 
  onCartChange,
  getGroupSession,
  getDeliverySchedule,
  setDeliverySchedule
} from './CartState.js';
import { showToast } from './Toast.js';
import { getActiveLocation, getActiveDeliveryLocation } from './LocationModal.js';
import { openPaymentPortal } from './PaymentModal.js';
import { openGroupOrderModal } from './GroupOrderModal.js';
import { getCurrentUser } from '../api/client.js';
import { openLoginModal } from './LoginModal.js';
import { loadGoogleMapsApi } from '../utils/googleMaps.js';
import { sounds } from '../utils/audio.js';
import { getFoodImage } from '../utils/foodImages.js';

let isOpen = false;
let drawerEl = null;
let overlayEl = null;
let tipAmount = 0;
let appliedDiscount = 0;
let appliedCouponCode = '';
let selectedInstruction = 'Leave at door';
let selectedPayment = 'upi';
let isRedeemingCoins = false;
let coinsRedeemedVal = 0;
let selectedDeliverySpeed = 'standard';
let isNoCutlery = true;
let isGiftPackaging = false;

export function createCartDrawer(onGoHome) {
  overlayEl = document.createElement('div');
  overlayEl.className = 'overlay';
  overlayEl.id = 'cart-overlay';
  overlayEl.addEventListener('click', closeCartDrawer);

  drawerEl = document.createElement('aside');
  drawerEl.className = 'cart-drawer';
  drawerEl.id = 'cart-drawer';
  drawerEl.setAttribute('aria-label', 'Shopping cart');

  renderDrawerContent(onGoHome);

  onCartChange(() => {
    // Reset discount if cart becomes empty
    if (getCartCount() === 0) {
      appliedDiscount = 0;
      appliedCouponCode = '';
      isRedeemingCoins = false;
      coinsRedeemedVal = 0;
    }
    renderDrawerContent(onGoHome);
  });

  document.body.appendChild(overlayEl);
  document.body.appendChild(drawerEl);
}

export function openCartDrawer() {
  isOpen = true;
  drawerEl.classList.add('open');
  overlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeCartDrawer() {
  isOpen = false;
  drawerEl.classList.remove('open');
  overlayEl.classList.remove('active');
  document.body.style.overflow = '';
}

export function toggleCartDrawer() {
  if (isOpen) closeCartDrawer();
  else openCartDrawer();
}

function renderDrawerContent(onGoHome) {
  if (!drawerEl) return;

  const cart = getCart();
  const total = getCartTotal();
  const count = getCartCount();
  const loc = getActiveLocation();
  const macros = getCartMacros();
  const availableCoins = getDashCoins();
  const group = getGroupSession();
  const schedule = getDeliverySchedule();

  if (count === 0) {
    drawerEl.innerHTML = `
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">Your Cart</h2>
        <button class="cart-drawer__close" id="cart-close-btn" aria-label="Close cart">✕</button>
      </div>
      <div class="cart-drawer__empty">
        <div class="cart-drawer__empty-icon">🛒</div>
        <div class="cart-drawer__empty-text">Your cart is empty</div>
        <div class="cart-drawer__empty-sub">Add some delicious dishes with custom options to get started.</div>
        
        <div style="margin-top: 24px; padding: 16px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; text-align: left; width: 100%;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="font-weight: 700; font-size: 13px; color: white;">👥 Ordering with Friends?</div>
            <button class="btn btn-primary btn-sm" id="empty-cart-group-btn" style="padding: 6px 12px; font-size: 11px;">Start Room</button>
          </div>
          <p style="font-size: 11px; color: var(--clr-text-muted); margin: 6px 0 0;">Create a group order room and split the bill with 1-click UPI links.</p>
        </div>
      </div>
    `;

    drawerEl.querySelector('#cart-close-btn')?.addEventListener('click', closeCartDrawer);
    drawerEl.querySelector('#empty-cart-group-btn')?.addEventListener('click', () => {
      closeCartDrawer();
      openGroupOrderModal();
    });
    return;
  }

  const deliveryFee = total > 199 ? 0 : 25;
  const speedFee = selectedDeliverySpeed === 'priority' ? 29 : selectedDeliverySpeed === 'eco' ? -10 : 0;
  const giftFee = isGiftPackaging ? 15 : 0;
  const tax = Math.round(total * 0.05);
  const platformFee = 6;
  const discount = appliedDiscount;
  const maxCoinDiscount = Math.min(Math.floor(availableCoins / 2), Math.round(total * 0.3));
  coinsRedeemedVal = isRedeemingCoins ? maxCoinDiscount : 0;

  const grandTotal = Math.max(0, total + deliveryFee + speedFee + giftFee + tax + platformFee + tipAmount - discount - coinsRedeemedVal);

  const itemsHtml = cart.items.map(item => {
    const itemKey = item.customKey || item.id;
    const price = item.unitPrice || item.price;
    const custom = item.customization;

    const foodImg = (item.image && !item.image.includes('/images/rest')) ? item.image : getFoodImage(item.name, '', item.isVeg);

    return `
      <div class="cart-drawer__item" data-key="${itemKey}" style="display: flex; gap: 10px; align-items: flex-start;">
        <img src="${foodImg}" alt="${item.name}" style="width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid var(--clr-border); flex-shrink: 0; margin-top: 2px;" />
        <div class="cart-drawer__item-info" style="flex: 1;">
          <div class="cart-drawer__item-name">
            <span class="veg-indicator ${item.isVeg ? '' : 'nonveg'}" style="width:12px;height:12px;"></span>
            <span>${item.name}</span>
          </div>
          
          <!-- Customization Tags -->
          ${custom ? `
            <div style="font-size: 11px; color: var(--clr-text-muted); margin: 3px 0; display: flex; flex-direction: column; gap: 2px;">
              <div><b>Size:</b> ${custom.size} • <b>Spice:</b> ${custom.spice}</div>
              ${custom.addons && custom.addons.length ? `<div><b>Add-ons:</b> ${custom.addons.join(', ')}</div>` : ''}
              ${custom.instructions ? `<div style="color: #ffb703;"><i>Note: "${custom.instructions}"</i></div>` : ''}
            </div>
          ` : ''}

          <!-- Group Participant Badge -->
          ${item.participant ? `
            <div style="display: inline-flex; align-items: center; gap: 4px; background: rgba(0, 180, 216, 0.15); color: #00b4d8; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; margin-top: 2px;">
              👤 ${item.participant}
            </div>
          ` : ''}

          <div class="cart-drawer__item-price">₹${price} each</div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="cart-drawer__item-controls">
            <button class="cart-drawer__item-btn" data-action="decrease" data-key="${itemKey}" aria-label="Decrease quantity">−</button>
            <span class="cart-drawer__item-qty">${item.qty}</span>
            <button class="cart-drawer__item-btn" data-action="increase" data-key="${itemKey}" aria-label="Increase quantity">+</button>
          </div>
          <div class="cart-drawer__item-total">₹${price * item.qty}</div>
          <button class="btn btn-ghost" data-action="delete" data-key="${itemKey}" title="Remove item" style="padding: 4px 6px; color: #ff5252; font-size: 15px; cursor: pointer;">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');

  drawerEl.innerHTML = `
    <div class="cart-drawer__header" style="display: flex; align-items: center; justify-content: space-between;">
      <h2 class="cart-drawer__title">Your Cart (${count})</h2>
      <div style="display: flex; align-items: center; gap: 8px;">
        <button id="clear-all-cart-btn" class="btn btn-ghost btn-sm" style="font-size: 11px; color: #ff5252;">
          Clear Cart
        </button>
        <button class="cart-drawer__close" id="cart-close-btn" aria-label="Close cart">✕</button>
      </div>
    </div>

    <!-- Active Restaurant Info & Group Banner -->
    <div class="cart-drawer__restaurant" style="position: relative;">
      <div class="cart-drawer__restaurant-name">🏪 ${cart.restaurantName}</div>
      <div style="font-size: 11px; color: var(--clr-text-muted);">Delivering to: ${loc.fullTitle}</div>

      ${group ? `
        <div style="margin-top: 8px; background: rgba(0, 180, 216, 0.12); border: 1px solid rgba(0, 180, 216, 0.3); border-radius: 8px; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #00b4d8;">👥 Group Order Active: ${group.roomName}</div>
            <div style="font-size: 10px; color: var(--clr-text-muted);">${group.participants.length} squad members ordered</div>
          </div>
          <button class="btn btn-secondary btn-sm" id="cart-group-modal-btn" style="padding: 4px 8px; font-size: 10px;">
            Split Bill 🧾
          </button>
        </div>
      ` : `
        <button class="btn btn-ghost btn-sm" id="cart-start-group-btn" style="margin-top: 6px; font-size: 11px; color: #00b4d8; padding: 2px 0;">
          + Invite Friends & Split Bill
        </button>
      `}
    </div>

    <div class="cart-drawer__scroll-area" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column;">
    <!-- Live Macro Nutrition Summary Bar -->
    <div style="background: rgba(0,0,0,0.3); border-top: 1px solid var(--clr-border); border-bottom: 1px solid var(--clr-border); padding: 8px 16px; display: flex; justify-content: space-around; font-size: 11px;">
      <div><span style="color: var(--clr-text-muted);">⚡ Kcal:</span> <b style="color: #ffb703;">${macros.calories}</b></div>
      <div><span style="color: var(--clr-text-muted);">💪 Protein:</span> <b style="color: #00e676;">${macros.protein}g</b></div>
      <div><span style="color: var(--clr-text-muted);">🌾 Carbs:</span> <b style="color: #00b4d8;">${macros.carbs}g</b></div>
      <div><span style="color: var(--clr-text-muted);">🥑 Fats:</span> <b style="color: #e0aaff;">${macros.fats}g</b></div>
    </div>

    <!-- Delivery Speed Selection -->
    <div class="cart-drawer__instructions" style="background: var(--clr-surface); margin: 12px 16px; padding: 12px; border-radius: 10px; border: 1px solid var(--clr-border);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-size: 12px; font-weight: 700; color: white;">🚀 Delivery Speed & Timing</span>
        <span style="font-size: 11px; color: var(--clr-primary); font-weight: 600;">${selectedDeliverySpeed === 'priority' ? 'Priority 15-20m' : selectedDeliverySpeed === 'eco' ? 'Eco-Saver 45m' : 'Standard 30m'}</span>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; margin-bottom: 8px;">
        <button class="cart-chip ${selectedDeliverySpeed === 'priority' ? 'active' : ''}" id="speed-priority-btn" style="font-size: 11px; padding: 6px 4px; justify-content: center; flex-direction: column; gap: 2px;">
          <span>🚀 Priority</span>
          <span style="font-size: 9px; opacity: 0.8;">15-20m (+₹29)</span>
        </button>
        <button class="cart-chip ${selectedDeliverySpeed === 'standard' ? 'active' : ''}" id="speed-standard-btn" style="font-size: 11px; padding: 6px 4px; justify-content: center; flex-direction: column; gap: 2px;">
          <span>🛵 Standard</span>
          <span style="font-size: 9px; opacity: 0.8;">30-40m (₹0)</span>
        </button>
        <button class="cart-chip ${selectedDeliverySpeed === 'eco' ? 'active' : ''}" id="speed-eco-btn" style="font-size: 11px; padding: 6px 4px; justify-content: center; flex-direction: column; gap: 2px;">
          <span>🌿 Eco-Saver</span>
          <span style="font-size: 9px; opacity: 0.8; color: #00e676;">45m (-₹10)</span>
        </button>
      </div>

      <div style="display: flex; gap: 6px; margin-top: 4px;">
        <button class="cart-chip ${schedule.mode === 'asap' ? 'active' : ''}" id="sched-asap-btn" style="font-size: 10px; padding: 4px 8px; flex: 1; justify-content: center;">⚡ Instant Now</button>
        <button class="cart-chip ${schedule.mode === 'scheduled' ? 'active' : ''}" id="sched-later-btn" style="font-size: 10px; padding: 4px 8px; flex: 1; justify-content: center;">📅 Later Slot</button>
      </div>

      ${schedule.mode === 'scheduled' ? `
        <div style="margin-top: 8px; display: flex; gap: 6px;">
          <select id="sched-slot-select" class="login-modal__input" style="padding: 6px 8px; font-size: 12px;">
            <option value="Today: 7:30 PM - 8:00 PM">Today: 7:30 PM - 8:00 PM</option>
            <option value="Today: 8:30 PM - 9:00 PM">Today: 8:30 PM - 9:00 PM</option>
            <option value="Tomorrow: 1:00 PM - 1:30 PM">Tomorrow: 1:00 PM - 1:30 PM</option>
            <option value="Tomorrow: 8:00 PM - 8:30 PM">Tomorrow: 8:00 PM - 8:30 PM</option>
          </select>
        </div>
      ` : ''}
    </div>

    <div class="cart-drawer__items" style="flex: none; overflow: visible;">
      ${itemsHtml}
    </div>

    <!-- Packaging & Eco Preferences -->
    <div style="margin: 0 16px 12px; background: rgba(0, 230, 118, 0.05); border: 1px dashed rgba(0, 230, 118, 0.25); border-radius: 10px; padding: 10px 14px; display: flex; flex-direction: column; gap: 6px;">
      <label style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: white; cursor: pointer;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🌱</span>
          <span>Don't send plastic cutlery & napkins</span>
        </div>
        <input type="checkbox" id="eco-cutlery-chk" ${isNoCutlery ? 'checked' : ''} style="accent-color: #00e676; width: 15px; height: 15px;" />
      </label>
      <label style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: white; cursor: pointer;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🎁</span>
          <span>Gift packaging & personal note (+₹15)</span>
        </div>
        <input type="checkbox" id="gift-pack-chk" ${isGiftPackaging ? 'checked' : ''} style="accent-color: var(--clr-primary); width: 15px; height: 15px;" />
      </label>
    </div>

    <!-- DashCoins Loyalty Wallet Switch -->
    ${availableCoins >= 50 ? `
      <div style="margin: 0 16px 12px; background: linear-gradient(135deg, rgba(255, 165, 2, 0.1), rgba(255, 71, 87, 0.1)); border: 1px solid rgba(255, 165, 2, 0.3); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">🪙</span>
          <div>
            <div style="font-size: 12px; font-weight: 700; color: #ffa502;">Redeem DashCoins (${availableCoins} coins)</div>
            <div style="font-size: 10px; color: var(--clr-text-muted);">Save up to ₹${maxCoinDiscount} on this order</div>
          </div>
        </div>
        <label style="cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: white;">
          <input type="checkbox" id="redeem-coins-checkbox" ${isRedeemingCoins ? 'checked' : ''} style="width: 16px; height: 16px; accent-color: #ffa502;" />
          <span>${isRedeemingCoins ? `-₹${maxCoinDiscount}` : 'Apply'}</span>
        </label>
      </div>
    ` : ''}

    <!-- Live 1-Click Coupons -->
    <div class="cart-drawer__instructions">
      <div class="cart-drawer__instructions-title">✨ Available Coupons</div>
      <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;" id="quick-coupons-wrap">
        <button class="cart-chip ${appliedCouponCode === 'WELCOME50' ? 'active' : ''}" data-code="WELCOME50">🏷️ WELCOME50 (₹50 OFF)</button>
        <button class="cart-chip ${appliedCouponCode === 'SPIN50' ? 'active' : ''}" data-code="SPIN50">🎯 SPIN50 (50% OFF)</button>
        <button class="cart-chip ${appliedCouponCode === 'TASTY20' ? 'active' : ''}" data-code="TASTY20">🏷️ TASTY20 (20% OFF)</button>
        <button class="cart-chip ${appliedCouponCode === 'PARTY40' ? 'active' : ''}" data-code="PARTY40">🏷️ PARTY40 (40% OFF)</button>
        <button class="cart-chip ${appliedCouponCode === 'FLAT100' ? 'active' : ''}" data-code="FLAT100">🏷️ FLAT100 (₹100 OFF)</button>
      </div>
    </div>

    <div class="cart-drawer__coupon">
      <div class="cart-drawer__coupon-input-group">
        <input type="text" class="cart-drawer__coupon-input" id="coupon-input" placeholder="Enter promo code" value="${appliedCouponCode}" aria-label="Coupon code" />
        <button class="btn btn-ghost btn-sm" id="apply-coupon-btn">Apply</button>
      </div>
      ${appliedDiscount > 0 ? `
        <div style="font-size: 12px; color: var(--clr-success); margin-top: 6px; display: flex; justify-content: space-between;">
          <span>✅ Code <b>${appliedCouponCode}</b> applied (-₹${appliedDiscount})</span>
          <button id="remove-coupon-btn" style="background: none; border: none; color: #ff5252; cursor: pointer; font-size: 11px;">Remove</button>
        </div>
      ` : ''}
    </div>

    <div class="cart-drawer__instructions">
      <div class="cart-drawer__instructions-title">🚪 Doorstep & Rider Instructions</div>
      <div class="cart-drawer__chips" id="instructions-chips" style="display: flex; flex-wrap: wrap; gap: 6px;">
        <button class="cart-chip ${selectedInstruction === 'Leave at door' ? 'active' : ''}" data-val="Leave at door">🚪 Leave at door</button>
        <button class="cart-chip ${selectedInstruction === 'Avoid calling' ? 'active' : ''}" data-val="Avoid calling">🔕 Avoid calling</button>
        <button class="cart-chip ${selectedInstruction === 'Do not ring bell' ? 'active' : ''}" data-val="Do not ring bell">🤫 Don't ring bell</button>
        <button class="cart-chip ${selectedInstruction === 'Leave with security' ? 'active' : ''}" data-val="Leave with security">🏢 Leave with security</button>
        <button class="cart-chip ${selectedInstruction === 'Call before arrival' ? 'active' : ''}" data-val="Call before arrival">📞 Call before arrival</button>
      </div>
    </div>

    <div class="cart-drawer__instructions">
      <div class="cart-drawer__instructions-title">❤️ Tip your delivery hero</div>
      <div class="cart-drawer__chips" id="tip-chips">
        <button class="cart-chip ${tipAmount === 0 ? 'active' : ''}" data-tip="0">No Tip</button>
        <button class="cart-chip ${tipAmount === 20 ? 'active' : ''}" data-tip="20">₹20</button>
        <button class="cart-chip ${tipAmount === 30 ? 'active' : ''}" data-tip="30">₹30 ❤️</button>
        <button class="cart-chip ${tipAmount === 50 ? 'active' : ''}" data-tip="50">₹50 🌟</button>
        <button class="cart-chip ${tipAmount === 100 ? 'active' : ''}" data-tip="100">₹100 👑</button>
      </div>
    </div>

    <div class="cart-drawer__bill">
      <div class="cart-drawer__bill-title">Bill Details</div>
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">Item Total</span>
        <span>₹${total}</span>
      </div>
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">Delivery Fee</span>
        <span>${deliveryFee === 0 ? '<span style="color: var(--clr-success); font-weight: bold;">FREE</span>' : '₹' + deliveryFee}</span>
      </div>
      ${speedFee !== 0 ? `
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">${selectedDeliverySpeed === 'priority' ? '🚀 Priority Express Fee' : '🌿 Eco-Saver Discount'}</span>
        <span style="color: ${speedFee < 0 ? 'var(--clr-success)' : 'inherit'};">${speedFee < 0 ? '-₹' + Math.abs(speedFee) : '+₹' + speedFee}</span>
      </div>
      ` : ''}
      ${isGiftPackaging ? `
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">🎁 Gift Packaging & Note</span>
        <span>+₹15</span>
      </div>
      ` : ''}
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">Platform Fee</span>
        <span>₹${platformFee}</span>
      </div>
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">GST & Restaurant Charges</span>
        <span>₹${tax}</span>
      </div>
      ${tipAmount > 0 ? `
      <div class="cart-drawer__bill-row">
        <span class="cart-drawer__bill-label">Delivery Partner Tip</span>
        <span>₹${tipAmount}</span>
      </div>
      ` : ''}
      ${discount > 0 ? `
      <div class="cart-drawer__bill-row discount">
        <span class="cart-drawer__bill-label">Promo Discount (${appliedCouponCode})</span>
        <span>-₹${discount}</span>
      </div>
      ` : ''}
      ${coinsRedeemedVal > 0 ? `
      <div class="cart-drawer__bill-row discount" style="color: #ffa502;">
        <span class="cart-drawer__bill-label">🪙 DashCoins Redeemed</span>
        <span>-₹${coinsRedeemedVal}</span>
      </div>
      ` : ''}
      <div class="cart-drawer__bill-row total">
        <span class="cart-drawer__bill-label">To Pay</span>
        <span>₹${grandTotal}</span>
      </div>
    </div>

    </div> <!-- /cart-drawer__scroll-area -->
    <div class="cart-drawer__footer">
      <button class="cart-drawer__checkout-btn" id="proceed-to-pay-btn">
        <span>Proceed to Pay</span>
        <span>₹${grandTotal} 💳 →</span>
      </button>
    </div>
  `;

  // Bind close & clear
  drawerEl.querySelector('#cart-close-btn')?.addEventListener('click', closeCartDrawer);
  
  drawerEl.querySelector('#clear-all-cart-btn')?.addEventListener('click', () => {
    clearCart();
    sounds.playPop();
    showToast('Cart cleared', '🗑️');
  });

  // Group modal triggers
  drawerEl.querySelector('#cart-group-modal-btn')?.addEventListener('click', () => {
    closeCartDrawer();
    openGroupOrderModal();
  });
  drawerEl.querySelector('#cart-start-group-btn')?.addEventListener('click', () => {
    closeCartDrawer();
    openGroupOrderModal();
  });

  // Delivery Speed Buttons
  drawerEl.querySelector('#speed-priority-btn')?.addEventListener('click', () => {
    selectedDeliverySpeed = 'priority';
    sounds.playPop();
    renderDrawerContent(onGoHome);
  });
  drawerEl.querySelector('#speed-standard-btn')?.addEventListener('click', () => {
    selectedDeliverySpeed = 'standard';
    sounds.playPop();
    renderDrawerContent(onGoHome);
  });
  drawerEl.querySelector('#speed-eco-btn')?.addEventListener('click', () => {
    selectedDeliverySpeed = 'eco';
    sounds.playPop();
    renderDrawerContent(onGoHome);
  });

  // Eco & Gift checkboxes
  drawerEl.querySelector('#eco-cutlery-chk')?.addEventListener('change', (e) => {
    isNoCutlery = e.target.checked;
    showToast(isNoCutlery ? 'No cutlery opted (Eco Hero! 🌿)' : 'Cutlery requested', '🍴');
  });
  drawerEl.querySelector('#gift-pack-chk')?.addEventListener('change', (e) => {
    isGiftPackaging = e.target.checked;
    sounds.playPop();
    renderDrawerContent(onGoHome);
  });

  // Schedule Buttons
  drawerEl.querySelector('#sched-asap-btn')?.addEventListener('click', () => {
    setDeliverySchedule({ mode: 'asap', timeSlot: '25-35 mins (Express)' });
    renderDrawerContent(onGoHome);
  });
  drawerEl.querySelector('#sched-later-btn')?.addEventListener('click', () => {
    setDeliverySchedule({ mode: 'scheduled', timeSlot: 'Today: 8:00 PM - 8:30 PM' });
    renderDrawerContent(onGoHome);
  });
  drawerEl.querySelector('#sched-slot-select')?.addEventListener('change', (e) => {
    setDeliverySchedule({ mode: 'scheduled', timeSlot: e.target.value });
  });

  // Coins Checkbox
  drawerEl.querySelector('#redeem-coins-checkbox')?.addEventListener('change', (e) => {
    isRedeemingCoins = e.target.checked;
    sounds.playPop();
    renderDrawerContent(onGoHome);
  });

  // Instructions chips
  drawerEl.querySelectorAll('#instructions-chips .cart-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedInstruction = chip.dataset.val;
      drawerEl.querySelectorAll('#instructions-chips .cart-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Tip chips
  drawerEl.querySelectorAll('#tip-chips .cart-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      tipAmount = parseInt(chip.dataset.tip);
      renderDrawerContent(onGoHome);
    });
  });

  // Quick coupon buttons
  drawerEl.querySelectorAll('#quick-coupons-wrap button').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      applyCoupon(code, total, onGoHome);
    });
  });

  // Coupon input apply button
  drawerEl.querySelector('#apply-coupon-btn')?.addEventListener('click', () => {
    const code = drawerEl.querySelector('#coupon-input')?.value?.trim();
    if (code) {
      applyCoupon(code, total, onGoHome);
    }
  });

  // Remove coupon button
  drawerEl.querySelector('#remove-coupon-btn')?.addEventListener('click', () => {
    appliedDiscount = 0;
    appliedCouponCode = '';
    showToast('Coupon removed', 'ℹ️');
    renderDrawerContent(onGoHome);
  });

  // Action Buttons (Increase, Decrease, and Delete)
  drawerEl.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const action = btn.dataset.action;

      if (action === 'increase') {
        updateItemQty(key, 1);
        sounds.playPop();
      } else if (action === 'decrease') {
        updateItemQty(key, -1);
        sounds.playPop();
      } else if (action === 'delete') {
        const item = cart.items.find(i => (i.customKey || i.id.toString()) === key.toString());
        if (item) {
          updateItemQty(key, -999);
          sounds.playPop();
          showToast(`Removed ${item.name} from cart`, '🗑️');
        }
      }
    });
  });

  // Proceed to Payment Portal
  drawerEl.querySelector('#proceed-to-pay-btn')?.addEventListener('click', async () => {
    const user = getCurrentUser();
    if (!user) {
      closeCartDrawer();
      openLoginModal();
      showToast('Please sign in or register to place your order 🔐', '👤');
      return;
    }

    const deliveryFee = total > 199 ? 0 : 25;
    const speedFee = selectedDeliverySpeed === 'priority' ? 29 : selectedDeliverySpeed === 'eco' ? -10 : 0;
    const giftFee = isGiftPackaging ? 15 : 0;
    const tax = Math.round(total * 0.05);
    const platformFee = 6;
    const discount = appliedDiscount;
    const coinsDiscount = coinsRedeemedVal;
    const grandTotal = Math.max(0, total + deliveryFee + speedFee + giftFee + tax + platformFee + tipAmount - discount - coinsDiscount);

    if (coinsDiscount > 0) {
      spendDashCoins(coinsDiscount * 2);
    }

    const checkoutBtn = drawerEl.querySelector('#proceed-to-pay-btn');
    const loc = getActiveDeliveryLocation() || { lat: 12.9352, lng: 77.6245, fullTitle: 'Bangalore' };
    const originalBtnText = checkoutBtn.innerHTML;
    checkoutBtn.innerHTML = 'Locating Outlet... 🛰️';
    checkoutBtn.disabled = true;

    // Use Google Maps Places API to find a real nearby outlet
    let realRestLoc = null;
    try {
      const maps = await loadGoogleMapsApi();
      if (maps && maps.places && maps.places.PlacesService) {
        const dummyDiv = document.createElement('div');
        const service = new maps.places.PlacesService(dummyDiv);
        
        const request = {
          location: new maps.LatLng(loc.lat, loc.lng),
          radius: '6000', // 6km search radius
          query: cart.restaurantName
        };

        const getPlace = () => new Promise(resolve => {
           service.textSearch(request, (results, status) => {
             if (status === maps.places.PlacesServiceStatus.OK && results.length > 0) {
               resolve(results[0]);
             } else {
               resolve(null);
             }
           });
        });

        const place = await getPlace();
        if (place && place.geometry && place.geometry.location) {
          realRestLoc = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || place.name
          };
        }
      }
    } catch (e) {
      console.warn('Failed to fetch Places API:', e);
    }

    checkoutBtn.innerHTML = originalBtnText;
    checkoutBtn.disabled = false;

    // Fallback: simulate a logical nearby location (~2km) if API key fails
    if (!realRestLoc) {
       realRestLoc = {
         lat: loc.lat + 0.015,
         lng: loc.lng + 0.012,
         address: `${cart.restaurantName} (Nearest Outlet)`
       };
    }

    const orderPayload = {
      restaurantId: cart.restaurantId,
      restaurantName: cart.restaurantName,
      restaurantLocation: realRestLoc,
      customerLocation: { lat: loc.lat, lng: loc.lng, address: loc.fullTitle },
      items: cart.items,
      itemTotal: total,
      deliveryFee,
      speedFee,
      giftFee,
      deliverySpeed: selectedDeliverySpeed,
      isNoCutlery,
      isGiftPackaging,
      tax,
      platformFee,
      tip: tipAmount,
      discount: discount + coinsDiscount,
      grandTotal,
      deliveryAddress: loc.fullTitle,
      deliveryInstruction: selectedInstruction,
      paymentMethod: selectedPayment,
      schedule: getDeliverySchedule()
    };

    closeCartDrawer();
    openPaymentPortal(orderPayload);
  });
}

async function applyCoupon(code, itemTotal, onGoHome) {
  if (code === 'SPIN50') {
    appliedDiscount = Math.min(150, Math.round(itemTotal * 0.5));
    appliedCouponCode = 'SPIN50';
    sounds.playSuccess();
    showToast('Lucky Spin 50% discount applied!', '🎯');
    renderDrawerContent(onGoHome);
    return;
  }

  try {
    const res = await fetch('/api/orders/meta/promos/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, itemTotal })
    }).then(r => r.json());

    if (res.success) {
      appliedDiscount = res.discount;
      appliedCouponCode = res.code;
      sounds.playSuccess();
      showToast(res.message, '🎉');
      renderDrawerContent(onGoHome);
    } else {
      showToast(res.message || 'Invalid coupon code', '⚠️');
    }
  } catch (e) {
    showToast('Failed to apply coupon', '❌');
  }
}
