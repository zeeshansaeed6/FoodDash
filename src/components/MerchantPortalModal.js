// ============================================================
// Restaurant Partner & Kitchen Dashboard Portal
// ============================================================
import { showToast } from './Toast.js';

let isOpen = false;
let merchantModalEl = null;

export function createMerchantPortalModal(onRefreshHome) {
  merchantModalEl = document.createElement('div');
  merchantModalEl.className = 'login-overlay';
  merchantModalEl.id = 'merchant-portal-overlay';
  document.body.appendChild(merchantModalEl);
}

export function openMerchantPortal() {
  isOpen = true;
  merchantModalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderMerchantContent();
}

export function closeMerchantPortal() {
  isOpen = false;
  if (merchantModalEl) {
    merchantModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

async function fetchMerchantOrders() {
  try {
    const res = await fetch('/api/orders/merchant/all').then(r => r.json());
    return res.orders || [];
  } catch (e) {
    return [];
  }
}

async function renderMerchantContent() {
  if (!merchantModalEl) return;

  const orders = await fetchMerchantOrders();

  merchantModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 760px; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1f2430 0%, #151821 100%); padding: 20px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="merchant-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">✕</button>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 28px;">🧑‍🍳</span>
          <div>
            <h2 style="font-size: 20px; font-weight: bold; margin: 0; color: white;">Restaurant Partner Dashboard</h2>
            <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0;">Add new restaurants, add custom dishes, and manage live incoming kitchen orders</p>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 8px; margin-top: 16px;" id="merchant-tabs">
          <button class="filter-chip active" data-tab="live-orders">🛵 Live Kitchen Orders (${orders.length})</button>
          <button class="filter-chip" data-tab="add-restaurant">🏪 Register New Restaurant</button>
          <button class="filter-chip" data-tab="add-dish">🍲 Add Dish to Menu</button>
        </div>
      </div>

      <!-- Main Body -->
      <div style="flex: 1; overflow-y: auto; padding: 24px;" id="merchant-body">
        <!-- Tab 1: Live Kitchen Orders -->
        <div id="tab-live-orders" class="merchant-tab-pane">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 15px; font-weight: bold; margin: 0;">Incoming Customer Orders</h3>
            <button class="btn btn-secondary btn-sm" id="refresh-orders-btn">🔄 Refresh Orders</button>
          </div>

          ${orders.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: var(--clr-text-muted);">
              <div style="font-size: 40px; margin-bottom: 8px;">🍳</div>
              <div style="font-size: 14px; font-weight: bold;">No active orders right now</div>
              <div style="font-size: 12px;">Customer orders placed on the frontend will appear here in real time.</div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${orders.map(order => `
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-family: monospace; font-weight: bold; color: var(--clr-primary-light);">${order.id}</span>
                        <span class="badge" style="background: ${getStatusBg(order.status)}; color: white; padding: 2px 8px; font-size: 11px; border-radius: var(--radius-sm);">${order.status.toUpperCase()}</span>
                      </div>
                      <div style="font-size: 12px; color: var(--clr-text-muted); margin-top: 4px;">
                        👤 <b>${order.userName || 'Customer'}</b> • 📍 ${order.deliveryAddress || 'Delivery Address'}
                      </div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 16px; font-weight: 800; color: hsl(140, 90%, 65%);">₹${order.bill?.grandTotal || 0}</div>
                      <div style="font-size: 11px; color: var(--clr-text-muted);">${order.paymentMethod?.toUpperCase()} (${order.paymentStatus || 'PAID'})</div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div style="background: var(--clr-bg-elevated); padding: 10px; border-radius: var(--radius-md); margin-bottom: 12px; font-size: 13px;">
                    ${(order.items || []).map(i => `
                      <div style="display: flex; justify-content: space-between; padding: 2px 0;">
                        <span>• <b>${i.qty}x</b> ${i.name}</span>
                        <span>₹${i.price * i.qty}</span>
                      </div>
                    `).join('')}
                  </div>

                  <!-- Action Status Buttons for Kitchen -->
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-secondary btn-sm order-action-btn" data-id="${order.id}" data-status="preparing" ${order.status === 'preparing' ? 'disabled' : ''}>
                      👨‍🍳 Mark Preparing
                    </button>
                    <button class="btn btn-secondary btn-sm order-action-btn" data-id="${order.id}" data-status="out_for_delivery" ${order.status === 'out_for_delivery' ? 'disabled' : ''}>
                      🛵 Dispatch Driver
                    </button>
                    <button class="btn btn-primary btn-sm order-action-btn" data-id="${order.id}" data-status="delivered" ${order.status === 'delivered' ? 'disabled' : ''}>
                      ✅ Mark Delivered
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Tab 2: Register New Restaurant -->
        <div id="tab-add-restaurant" class="merchant-tab-pane" style="display: none;">
          <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 14px;">Register a New Restaurant on FoodDash</h3>
          <form id="merchant-restaurant-form" style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="login-modal__label">Restaurant Name</label>
                <input type="text" id="m-rest-name" class="login-modal__input" placeholder="e.g. Royal Biryani House" required />
              </div>
              <div>
                <label class="login-modal__label">Cuisines (Comma Separated)</label>
                <input type="text" id="m-rest-cuisines" class="login-modal__input" placeholder="Biryani, North Indian, Mughlai" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="login-modal__label">City</label>
                <input type="text" id="m-rest-city" class="login-modal__input" placeholder="e.g. Mumbai, Delhi, Bangalore" required />
              </div>
              <div>
                <label class="login-modal__label">Area / Locality</label>
                <input type="text" id="m-rest-area" class="login-modal__input" placeholder="e.g. Bandra West, Connaught Place" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div>
                <label class="login-modal__label">Price for Two (₹)</label>
                <input type="number" id="m-rest-price" class="login-modal__input" placeholder="400" required />
              </div>
              <div>
                <label class="login-modal__label">Delivery Time</label>
                <input type="text" id="m-rest-time" class="login-modal__input" placeholder="20-25 min" value="25-30 min" />
              </div>
              <div>
                <label class="login-modal__label">Delivery Fee (₹)</label>
                <input type="number" id="m-rest-fee" class="login-modal__input" placeholder="0" value="0" />
              </div>
            </div>

            <div>
              <label class="login-modal__label">Promotional Offer</label>
              <input type="text" id="m-rest-offer" class="login-modal__input" placeholder="e.g. FLAT 20% OFF or FLAT ₹100 OFF" value="FLAT 20% OFF" />
            </div>

            <button type="submit" class="login-modal__submit" id="save-restaurant-btn">
              ✨ Publish Restaurant Online →
            </button>
          </form>
        </div>

        <!-- Tab 3: Add Dish to Restaurant Menu -->
        <div id="tab-add-dish" class="merchant-tab-pane" style="display: none;">
          <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 14px;">Add New Food Dish to Menu</h3>
          <form id="merchant-dish-form" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label class="login-modal__label">Select Target Restaurant ID / Name</label>
              <input type="text" id="m-dish-restid" class="login-modal__input" placeholder="Restaurant ID (e.g. 101 or 1)" value="1" required />
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
              <div>
                <label class="login-modal__label">Dish Name</label>
                <input type="text" id="m-dish-name" class="login-modal__input" placeholder="e.g. Gourmet Truffle Pasta" required />
              </div>
              <div>
                <label class="login-modal__label">Price (₹)</label>
                <input type="number" id="m-dish-price" class="login-modal__input" placeholder="299" required />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label class="login-modal__label">Category</label>
                <select id="m-dish-category" class="login-modal__input" style="background: var(--clr-surface);">
                  <option value="Recommended">Recommended</option>
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Breads">Breads & Sides</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div style="display: flex; align-items: center; gap: 16px; margin-top: 20px;">
                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                  <input type="checkbox" id="m-dish-isveg" checked /> 🟢 Pure Veg
                </label>
                <label style="display: flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;">
                  <input type="checkbox" id="m-dish-isbestseller" checked /> ⭐ Bestseller
                </label>
              </div>
            </div>

            <div>
              <label class="login-modal__label">Dish Description</label>
              <input type="text" id="m-dish-desc" class="login-modal__input" placeholder="Rich ingredients, slow cooked with chef's secret spices" />
            </div>

            <button type="submit" class="login-modal__submit" id="save-dish-btn">
              🍲 Add Dish to Live Menu →
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  function getStatusBg(st) {
    if (st === 'delivered') return '#00e676';
    if (st === 'out_for_delivery') return '#2979ff';
    if (st === 'preparing') return '#ff9100';
    return '#e53935';
  }

  // Bind close
  merchantModalEl.querySelector('#merchant-close-btn').addEventListener('click', closeMerchantPortal);

  // Bind Tab switching
  merchantModalEl.querySelectorAll('#merchant-tabs .filter-chip').forEach(tab => {
    tab.addEventListener('click', () => {
      merchantModalEl.querySelectorAll('#merchant-tabs .filter-chip').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      merchantModalEl.querySelectorAll('.merchant-tab-pane').forEach(pane => pane.style.display = 'none');
      merchantModalEl.querySelector(`#tab-${target}`).style.display = 'block';
    });
  });

  // Refresh orders button
  merchantModalEl.querySelector('#refresh-orders-btn')?.addEventListener('click', () => {
    renderMerchantContent();
    showToast('Kitchen orders refreshed!', '🔄');
  });

  // Bind order status update buttons
  merchantModalEl.querySelectorAll('.order-action-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const status = btn.dataset.status;
      btn.disabled = true;

      try {
        const res = await fetch(`/api/orders/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }).then(r => r.json());

        if (res.success) {
          showToast(`Order ${id} is now ${status.replace(/_/g, ' ').toUpperCase()}`, '👨‍🍳');
          renderMerchantContent();
        }
      } catch (err) {
        showToast('Failed to update order status', '❌');
      }
    });
  });

  // Handle Add Restaurant Form
  merchantModalEl.querySelector('#merchant-restaurant-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = merchantModalEl.querySelector('#m-rest-name').value.trim();
    const cuisines = merchantModalEl.querySelector('#m-rest-cuisines').value.trim();
    const cityName = merchantModalEl.querySelector('#m-rest-city').value.trim();
    const area = merchantModalEl.querySelector('#m-rest-area').value.trim();
    const priceForTwo = merchantModalEl.querySelector('#m-rest-price').value;
    const deliveryTime = merchantModalEl.querySelector('#m-rest-time').value;
    const deliveryFee = merchantModalEl.querySelector('#m-rest-fee').value;
    const offer = merchantModalEl.querySelector('#m-rest-offer').value;

    const res = await fetch('/api/restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        cuisines,
        cityName,
        area,
        priceForTwo,
        deliveryTime,
        deliveryFee,
        offer
      })
    }).then(r => r.json());

    if (res.success) {
      showToast(`Restaurant "${res.restaurant.name}" registered successfully! 🎉`, '✅', 4000);
      closeMerchantPortal();
      window.location.reload();
    } else {
      showToast(res.message || 'Error registering restaurant', '❌');
    }
  });

  // Handle Add Dish Form
  merchantModalEl.querySelector('#merchant-dish-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const restId = merchantModalEl.querySelector('#m-dish-restid').value.trim();
    const name = merchantModalEl.querySelector('#m-dish-name').value.trim();
    const price = merchantModalEl.querySelector('#m-dish-price').value;
    const category = merchantModalEl.querySelector('#m-dish-category').value;
    const isVeg = merchantModalEl.querySelector('#m-dish-isveg').checked;
    const isBestseller = merchantModalEl.querySelector('#m-dish-isbestseller').checked;
    const desc = merchantModalEl.querySelector('#m-dish-desc').value.trim();

    const res = await fetch(`/api/restaurants/${restId}/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price,
        category,
        isVeg,
        isBestseller,
        desc
      })
    }).then(r => r.json());

    if (res.success) {
      showToast(`Dish "${name}" added to menu successfully! 🍲`, '✅', 4000);
      closeMerchantPortal();
    } else {
      showToast(res.message || 'Error adding dish', '❌');
    }
  });
}
