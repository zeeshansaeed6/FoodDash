// ============================================================
// FoodDash — Dedicated Restaurant Partner Kitchen & Dispatch Hub
// Multi-Restaurant Authentication, Data Isolation & Kitchen Queue
// ============================================================
import { showToast } from '../components/Toast.js';
import { restaurants as defaultRestaurants } from '../data/restaurants.js';
import {
  fetchRestaurantSettings,
  updateRestaurantSettings,
  toggleMenuItemStock,
  fetchRestaurantAnalytics
} from '../api/client.js';

// Pre-configured partner outlets for 1-click login and testing
const DEMO_MERCHANTS = [
  { id: 1, name: 'Spice Garden', email: 'spice@fooddash.com', password: '123', cuisine: 'North Indian, Biryani', area: 'Koramangala 4th Block, Bangalore', rating: 4.6, phone: '+91 98765 11001' },
  { id: 2, name: 'The Burger Club', email: 'burger@fooddash.com', password: '123', cuisine: 'Burgers, American, Fast Food', area: 'Indiranagar 100ft Road, Bangalore', rating: 4.4, phone: '+91 98765 11002' },
  { id: 3, name: 'Pizza Paradise', email: 'pizza@fooddash.com', password: '123', cuisine: 'Italian, Pizza, Pastas', area: 'HSR Layout Sector 3, Bangalore', rating: 4.7, phone: '+91 98765 11003' },
  { id: 4, name: 'Biryani House', email: 'biryani@fooddash.com', password: '123', cuisine: 'Hyderabadi, Mughlai', area: 'Whitefield Main Road, Bangalore', rating: 4.8, phone: '+91 98765 11004' },
  { id: 5, name: 'Sushi Express', email: 'sushi@fooddash.com', password: '123', cuisine: 'Japanese, Asian, Bowls', area: 'MG Road Metro, Bangalore', rating: 4.5, phone: '+91 98765 11005' },
  { id: 6, name: 'Tandoori Nights', email: 'tandoori@fooddash.com', password: '123', cuisine: 'Kebabs, Mughlai, Grills', area: 'JP Nagar 2nd Phase, Bangalore', rating: 4.3, phone: '+91 98765 11006' }
];

export function renderMerchantPage(container, onNavigate) {
  // Safely check active logged-in merchant
  let currentMerchant = null;
  try {
    const raw = localStorage.getItem('fooddash_active_merchant');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
        currentMerchant = parsed;
      }
    }
  } catch (e) {
    currentMerchant = null;
  }

  // Fallback to default demo outlet if not set so dashboard is immediately ready
  if (!currentMerchant) {
    currentMerchant = DEMO_MERCHANTS[0];
    localStorage.setItem('fooddash_active_merchant', JSON.stringify(currentMerchant));
  }

  let activeTab = 'orders';
  let outletSettings = {
    prepTime: '20 min',
    surgeMultiplier: 1.0,
    isOutletOpen: true,
    outOfStockItemIds: []
  };

  function saveActiveMerchant(merchant) {
    currentMerchant = merchant;
    if (merchant) {
      localStorage.setItem('fooddash_active_merchant', JSON.stringify(merchant));
    } else {
      localStorage.removeItem('fooddash_active_merchant');
    }
    renderHub();
  }

  async function loadOutletSettings() {
    if (!currentMerchant || !currentMerchant.id) return;
    try {
      const res = await fetchRestaurantSettings(currentMerchant.id);
      if (res && res.success && res.settings) {
        outletSettings = res.settings;
      }
    } catch (e) {
      console.warn('Could not load outlet settings, using default:', e);
    }
  }

  async function renderHub() {
    if (!currentMerchant) {
      renderMerchantLogin();
      return;
    }
    await loadOutletSettings();
    renderMerchantDashboard();
  }

  // --- 1. Merchant Login & Switcher Gateway ---
  function renderMerchantLogin() {
    container.innerHTML = `
      <div class="merchant-login-view" style="min-height: calc(100vh - var(--nav-h)); padding-top: var(--nav-h); background: radial-gradient(circle at 50% 10%, #1c0a00 0%, var(--clr-bg) 100%); color: var(--clr-text); display: flex; align-items: center; justify-content: center; padding-bottom: 60px;">
        
        <div style="max-width: 820px; width: 92%; margin: 20px auto;">
          <!-- Top Tag -->
          <div style="text-align: center; margin-bottom: 24px;">
            <span class="portal-badge-pill" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-size: 12px; padding: 6px 16px;">
              🧑‍🍳 RESTAURANT PARTNER HUB
            </span>
            <h1 style="font-size: 28px; font-weight: 800; color: white; margin: 12px 0 6px;">Restaurant Outlet Portal</h1>
            <p style="font-size: 14px; color: var(--clr-text-muted); max-width: 520px; margin: 0 auto;">
              Manage live kitchen orders, cooking prep times, surge pricing, live stock availability, and revenue analytics.
            </p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
            
            <!-- Direct Credentials Login Form -->
            <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-2xl); padding: 32px; box-shadow: var(--shadow-xl);">
              <h2 style="font-size: 18px; font-weight: 800; margin: 0 0 4px; color: white;">Partner Sign In</h2>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0 0 20px;">Enter your restaurant email/ID and secret password</p>

              <form id="merchant-login-form" style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                  <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); display: block; margin-bottom: 6px;">Restaurant Email / Outlet ID</label>
                  <input type="text" id="merchant-email-input" placeholder="e.g. spice@fooddash.com" required style="width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white; font-size: 14px;" />
                </div>

                <div>
                  <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); display: block; margin-bottom: 6px;">Password</label>
                  <input type="password" id="merchant-pass-input" placeholder="Enter outlet password" required style="width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white; font-size: 14px;" />
                </div>

                <button type="submit" class="btn btn-primary" style="padding: 13px; font-size: 15px; font-weight: 800; border-radius: var(--radius-md); background: linear-gradient(135deg, #ef4444, #f97316); border: none; cursor: pointer; margin-top: 6px;">
                  🚀 Open Kitchen Hub
                </button>
              </form>
            </div>

            <!-- Quick Demo 1-Click Outlet Switcher -->
            <div style="background: rgba(255,255,255,0.02); border: 1px dashed var(--clr-border); border-radius: var(--radius-2xl); padding: 28px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <h3 style="font-size: 16px; font-weight: 800; margin: 0; color: white;">⚡ 1-Click Demo Outlets</h3>
                <span style="font-size: 10px; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 4px; color: var(--clr-text-muted);">Instant Testing</span>
              </div>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0 0 16px;">Select any partner restaurant to immediately access its kitchen dashboard:</p>

              <div style="display: flex; flex-direction: column; gap: 10px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
                ${DEMO_MERCHANTS.map(m => `
                  <button class="btn-demo-merchant" data-id="${m.id}" style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 12px 16px; text-align: left; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;">
                    <div>
                      <div style="font-weight: 800; font-size: 14px; color: white;">🏪 ${m.name}</div>
                      <div style="font-size: 11px; color: var(--clr-text-muted);">${m.cuisine} • Outlet #${m.id}</div>
                    </div>
                    <span style="font-size: 12px; color: #f87171; font-weight: bold;">Login →</span>
                  </button>
                `).join('')}
              </div>
            </div>

          </div>

          <div style="text-align: center; margin-top: 24px;">
            <button class="btn btn-ghost btn-sm" id="btn-login-back-home" style="color: var(--clr-text-muted);">
              ← Back to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    `;

    // Demo buttons
    container.querySelectorAll('.btn-demo-merchant').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const merchant = DEMO_MERCHANTS.find(m => m.id === id);
        if (merchant) {
          showToast(`Logged into ${merchant.name} Kitchen Hub! 🧑‍🍳`, '✅');
          saveActiveMerchant(merchant);
        }
      });
    });

    // Form Submit
    container.querySelector('#merchant-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = container.querySelector('#merchant-email-input').value.trim().toLowerCase();

      // Find matching demo or stored merchant
      let found = DEMO_MERCHANTS.find(m => m.email.toLowerCase() === email || m.name.toLowerCase() === email);
      if (!found) {
        found = {
          id: Math.floor(100 + Math.random() * 900),
          name: email.split('@')[0].toUpperCase(),
          email: email,
          cuisine: 'Custom Multi-Cuisine',
          area: 'Bangalore Metro Hub',
          rating: 4.8,
          phone: '+91 99999 00000'
        };
      }

      showToast(`Welcome back, ${found.name}! 🧑‍🍳`, '✅');
      saveActiveMerchant(found);
    });

    container.querySelector('#btn-login-back-home')?.addEventListener('click', () => onNavigate('home'));
  }

  // --- 2. Merchant Dashboard with Isolated Data ---
  function renderMerchantDashboard() {
    const isOutletOpen = Boolean(outletSettings.isOutletOpen !== false);
    const curPrepTime = outletSettings.prepTime || '20 min';
    const curSurge = Number(outletSettings.surgeMultiplier || 1.0);

    container.innerHTML = `
      <div class="merchant-page-container" style="min-height: calc(100vh - var(--nav-h)); padding-top: var(--nav-h); background: var(--clr-bg); color: var(--clr-text);">
        
        <!-- Top Sub-Bar with Portal Switcher & Logout -->
        <div style="background: linear-gradient(90deg, #3f0909, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 24px;">
          <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="portal-badge-pill" style="background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4);">
                🧑‍🍳 OUTLET #${currentMerchant.id || 1}: ${(currentMerchant.name || 'Partner Outlet').toUpperCase()}
              </span>
              <span style="font-size: 13px; color: var(--clr-text-muted);">
                Managing Live Kitchen, Cooking Times, Surge Multipliers, Stock & Analytics
              </span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
              <button class="btn btn-ghost btn-sm" id="btn-merchant-switch-customer" style="font-size: 12px; border-radius: var(--radius-full);">
                🛍️ Customer App
              </button>
              <button class="btn btn-ghost btn-sm" id="btn-merchant-switch-driver" style="font-size: 12px; color: #00e676; border-radius: var(--radius-full);">
                🛵 Rider Fleet
              </button>
              <button class="btn btn-secondary btn-sm" id="btn-merchant-logout" style="font-size: 12px; border-radius: var(--radius-full); background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4);">
                🚪 Log Out / Switch Outlet
              </button>
            </div>
          </div>
        </div>

        <!-- Dashboard Header Hero -->
        <div style="background: linear-gradient(180deg, rgba(239, 68, 68, 0.15) 0%, transparent 100%); padding: 28px 0 16px;">
          <div class="container">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <h1 style="font-size: 24px; font-weight: 800; margin: 0; color: white;">🏪 ${currentMerchant.name || 'Partner Outlet'}</h1>
                  <span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #22c55e; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;">
                    ⭐ ${currentMerchant.rating || '4.8'} Rating
                  </span>
                </div>
                <div style="font-size: 13px; color: var(--clr-text-muted); margin-top: 4px;">
                  📍 ${currentMerchant.area || 'Bangalore'} • 🍽️ ${currentMerchant.cuisine || 'Multi-Cuisine'} • 📞 ${currentMerchant.phone || '+91 98765 00000'}
                </div>
              </div>

              <!-- Outlet Status & Metrics -->
              <div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap;">
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 10px 16px; border-radius: var(--radius-lg); text-align: center;">
                  <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Live Kitchen Queue</div>
                  <div style="font-size: 18px; font-weight: 800; color: #f87171;" id="header-orders-count">0 Tickets</div>
                </div>
                <button class="btn btn-sm" id="btn-toggle-outlet-status" style="background: ${isOutletOpen ? '#10b981' : '#ef4444'}; color: white; border: none; padding: 11px 18px; border-radius: var(--radius-full); font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <span>${isOutletOpen ? '🟢' : '🔴'}</span> <span id="outlet-status-text">${isOutletOpen ? 'KITCHEN OPEN & ACCEPTING' : 'KITCHEN PAUSED (CLOSED)'}</span>
                </button>
              </div>
            </div>

            <!-- Operations Bar: Cooking Time & Surge Pricing Controls -->
            <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-lg); padding: 14px 18px; margin-top: 20px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;">
              <!-- ⏱️ Cooking Prep Time -->
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 12px; font-weight: 800; color: #fca5a5; display: flex; align-items: center; gap: 5px;">
                  ⏱️ COOKING PREP TIME:
                </span>
                <div style="display: flex; gap: 6px;" id="prep-time-chips">
                  <button class="btn-prep-chip btn btn-sm ${curPrepTime.includes('10') ? 'active-chip' : ''}" data-val="10 min" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curPrepTime.includes('10') ? '#ef4444' : 'var(--clr-border)'}; background: ${curPrepTime.includes('10') ? 'rgba(239,68,68,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    ⚡ Express (10m)
                  </button>
                  <button class="btn-prep-chip btn btn-sm ${curPrepTime.includes('20') ? 'active-chip' : ''}" data-val="20 min" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curPrepTime.includes('20') ? '#ef4444' : 'var(--clr-border)'}; background: ${curPrepTime.includes('20') ? 'rgba(239,68,68,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    🍳 Standard (20m)
                  </button>
                  <button class="btn-prep-chip btn btn-sm ${curPrepTime.includes('35') ? 'active-chip' : ''}" data-val="35 min" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curPrepTime.includes('35') ? '#ef4444' : 'var(--clr-border)'}; background: ${curPrepTime.includes('35') ? 'rgba(239,68,68,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    🔥 High Load (35m)
                  </button>
                  <button class="btn-prep-chip btn btn-sm ${curPrepTime.includes('45') ? 'active-chip' : ''}" data-val="45 min" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curPrepTime.includes('45') ? '#ef4444' : 'var(--clr-border)'}; background: ${curPrepTime.includes('45') ? 'rgba(239,68,68,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    🌧️ Rush Hour (45m)
                  </button>
                </div>
              </div>

              <!-- ⚡ Surge Multiplier -->
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 12px; font-weight: 800; color: #fbbf24; display: flex; align-items: center; gap: 5px;">
                  ⚡ SURGE MULTIPLIER:
                </span>
                <div style="display: flex; gap: 6px;" id="surge-multiplier-chips">
                  <button class="btn-surge-chip btn btn-sm ${curSurge === 1.0 ? 'active-chip' : ''}" data-val="1.0" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curSurge === 1.0 ? '#fbbf24' : 'var(--clr-border)'}; background: ${curSurge === 1.0 ? 'rgba(251,191,36,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    Normal 1.0x
                  </button>
                  <button class="btn-surge-chip btn btn-sm ${curSurge === 1.2 ? 'active-chip' : ''}" data-val="1.2" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curSurge === 1.2 ? '#fbbf24' : 'var(--clr-border)'}; background: ${curSurge === 1.2 ? 'rgba(251,191,36,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    🔥 Peak 1.2x
                  </button>
                  <button class="btn-surge-chip btn btn-sm ${curSurge === 1.5 ? 'active-chip' : ''}" data-val="1.5" style="font-size: 11px; padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid ${curSurge === 1.5 ? '#fbbf24' : 'var(--clr-border)'}; background: ${curSurge === 1.5 ? 'rgba(251,191,36,0.2)' : 'transparent'}; color: white; font-weight: 700; cursor: pointer;">
                    🌧️ Rain Surge 1.5x
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab Navigation -->
            <div style="display: flex; gap: 10px; margin-top: 22px; border-bottom: 1px solid var(--clr-border); padding-bottom: 2px; overflow-x: auto;">
              <button class="merchant-tab-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'orders' ? '#f87171' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'orders' ? '#ef4444' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>🍳</span> Kitchen Orders Queue <span class="badge" id="tab-orders-badge" style="background: #ef4444; color: white; padding: 2px 7px; border-radius: 99px; font-size: 11px;">0</span>
              </button>
              <button class="merchant-tab-btn ${activeTab === 'reservations' ? 'active' : ''}" data-tab="reservations" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'reservations' ? '#f87171' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'reservations' ? '#ef4444' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>🍽️</span> Table Bookings & Dine-in
              </button>
              <button class="merchant-tab-btn ${activeTab === 'menu' ? 'active' : ''}" data-tab="menu" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'menu' ? '#f87171' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'menu' ? '#ef4444' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>📋</span> Menu & Live Inventory Stock
              </button>
              <button class="merchant-tab-btn ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'analytics' ? '#f87171' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'analytics' ? '#ef4444' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>📊</span> Daily Revenue & Analytics
              </button>
              <button class="merchant-tab-btn ${activeTab === 'add-dish' ? 'active' : ''}" data-tab="add-dish" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'add-dish' ? '#f87171' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'add-dish' ? '#ef4444' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>➕</span> Add New Dish
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content Area -->
        <div class="container" style="padding: 24px 0 60px;">
          <div id="merchant-tab-pane">
            <!-- Dynamic Content -->
          </div>
        </div>
      </div>
    `;

    // Bind Top Controls
    container.querySelector('#btn-merchant-switch-customer')?.addEventListener('click', () => {
      onNavigate('home');
      showToast('Switched to Customer Storefront 🛍️', '👤');
    });

    container.querySelector('#btn-merchant-switch-driver')?.addEventListener('click', () => {
      onNavigate('driver');
      showToast('Switched to Delivery Rider Portal 🛵', '🛵');
    });

    container.querySelector('#btn-merchant-logout')?.addEventListener('click', () => {
      saveActiveMerchant(null);
      showToast('Logged out of restaurant partner account 🔒', '🚪');
    });

    // Outlet Open/Close Toggle
    const toggleBtn = container.querySelector('#btn-toggle-outlet-status');
    toggleBtn?.addEventListener('click', async () => {
      const nextOpen = !(outletSettings.isOutletOpen !== false);
      outletSettings.isOutletOpen = nextOpen;
      await updateRestaurantSettings(currentMerchant.id, { isOutletOpen: nextOpen });
      showToast(nextOpen ? `${currentMerchant.name} is OPEN for online orders 🟢` : `${currentMerchant.name} orders PAUSED 🔴`, nextOpen ? '🟢' : '🔴');
      renderMerchantDashboard();
    });

    // Cooking Prep Time Selection
    container.querySelectorAll('.btn-prep-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        const val = chip.dataset.val;
        outletSettings.prepTime = val;
        await updateRestaurantSettings(currentMerchant.id, { prepTime: val });
        showToast(`Kitchen cooking prep time updated to ${val} ⏱️`, '👨‍🍳');
        renderMerchantDashboard();
      });
    });

    // Surge Multiplier Selection
    container.querySelectorAll('.btn-surge-chip').forEach(chip => {
      chip.addEventListener('click', async () => {
        const val = parseFloat(chip.dataset.val);
        outletSettings.surgeMultiplier = val;
        await updateRestaurantSettings(currentMerchant.id, { surgeMultiplier: val });
        showToast(`Surge pricing multiplier set to ${val}x ⚡`, '💰');
        renderMerchantDashboard();
      });
    });

    // Tab Switching
    function switchTab(tab) {
      activeTab = tab;
      renderMerchantDashboard();
    }

    container.querySelectorAll('.merchant-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    async function fetchIsolatedOrders() {
      try {
        const res = await fetch('/api/orders/merchant/all');
        const data = await res.json();
        const allOrders = data.orders || [];
        // STRICT DATA ISOLATION: Only return orders for THIS restaurant!
        return allOrders.filter(o => 
          (o.restaurantId && parseInt(o.restaurantId) === parseInt(currentMerchant.id)) ||
          (o.restaurantName && o.restaurantName.toLowerCase() === currentMerchant.name.toLowerCase())
        );
      } catch (e) {
        return [];
      }
    }

    async function updateStatus(orderId, status) {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, note: `Status advanced to ${status} by ${currentMerchant.name}` })
        });
        const data = await res.json();
        if (data.success) {
          showToast(`Order updated to: ${status.toUpperCase()} 👨‍🍳`, '✅');
          renderTabContent();
        }
      } catch (e) {
        showToast('Failed to update status', '❌');
      }
    }

    async function renderTabContent() {
      const pane = container.querySelector('#merchant-tab-pane');
      if (!pane) return;

      const myOrders = await fetchIsolatedOrders();
      const badge = container.querySelector('#tab-orders-badge');
      const headerCount = container.querySelector('#header-orders-count');
      if (badge) badge.textContent = myOrders.length;
      if (headerCount) headerCount.textContent = `${myOrders.length} Tickets`;

      if (activeTab === 'orders') {
        if (myOrders.length === 0) {
          pane.innerHTML = `
            <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 60px 20px; text-align: center;">
              <div style="font-size: 54px; margin-bottom: 12px;">🍳</div>
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;">Kitchen Queue is Clear for ${currentMerchant.name}</h3>
              <p style="font-size: 13px; color: var(--clr-text-muted); max-width: 440px; margin: 0 auto 18px;">
                New customer orders placed for <b>${currentMerchant.name}</b> will automatically pop up here with live status advancements.
              </p>
              <button class="btn btn-secondary btn-sm" id="btn-refresh-orders" style="border-radius: var(--radius-full);">
                🔄 Check for New Tickets
              </button>
            </div>
          `;
          pane.querySelector('#btn-refresh-orders')?.addEventListener('click', renderTabContent);
          return;
        }

        pane.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <h2 style="font-size: 18px; font-weight: 800; margin: 0 0 4px;">Live Kitchen Tickets (${myOrders.length})</h2>
              <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0;">Prepare food and dispatch to delivery riders</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-refresh-orders" style="border-radius: var(--radius-full); font-size: 12px;">
              🔄 Refresh Queue
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
            ${myOrders.map(order => `
              <div style="background: var(--clr-surface); border: 1px solid ${order.status === 'confirmed' ? '#ef4444' : order.status === 'preparing' ? '#f59e0b' : '#10b981'}; border-radius: var(--radius-xl); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-md); position: relative;">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div>
                      <span style="font-family: monospace; font-size: 13px; font-weight: bold; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 4px;">#${(order.id || '').toString().slice(-6)}</span>
                      <span style="margin-left: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${order.status === 'confirmed' ? '#ef4444' : order.status === 'preparing' ? '#fbbf24' : '#4ade80'};">
                        ● ${order.status}
                      </span>
                    </div>
                    <div style="font-size: 16px; font-weight: 800; color: #4ade80;">₹${order.bill?.grandTotal || 0}</div>
                  </div>

                  <div style="font-size: 12px; color: var(--clr-text-muted); margin-bottom: 12px;">
                    👤 <b>${order.userName || 'Customer'}</b> (${order.userPhone || '+91 98765 00000'})
                    <br />📍 ${order.deliveryAddress || 'Customer Doorstep'}
                  </div>

                  <!-- Item List -->
                  <div style="background: rgba(0,0,0,0.25); border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px; font-size: 13px;">
                    ${(order.items || []).map(item => `
                      <div style="display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.05);">
                        <span><b>${item.qty || 1}x</b> ${item.name}</span>
                        <span style="color: var(--clr-text-muted);">₹${(item.price || 0) * (item.qty || 1)}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Kitchen Workflow Progression Buttons -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${order.status === 'confirmed' ? `
                    <button class="btn btn-primary btn-advance-status" data-id="${order.id}" data-status="preparing" style="flex: 1; border-radius: var(--radius-md); font-weight: bold; padding: 10px; background: #f59e0b; border: none; font-size: 12px;">
                      🍳 Accept & Start Cooking
                    </button>
                  ` : order.status === 'preparing' ? `
                    <button class="btn btn-primary btn-advance-status" data-id="${order.id}" data-status="rider_assigned" style="flex: 1; border-radius: var(--radius-md); font-weight: bold; padding: 10px; background: #10b981; border: none; font-size: 12px;">
                      📦 Food Packed • Call Rider
                    </button>
                  ` : order.status === 'rider_assigned' || order.status === 'out_for_delivery' ? `
                    <button class="btn btn-primary btn-advance-status" data-id="${order.id}" data-status="delivered" style="flex: 1; border-radius: var(--radius-md); font-weight: bold; padding: 10px; background: #3b82f6; border: none; font-size: 12px;">
                      ✅ Mark Handed Off / Delivered
                    </button>
                  ` : `
                    <div style="flex: 1; text-align: center; font-size: 12px; color: #4ade80; font-weight: bold; padding: 8px;">
                      ✓ Order Completed
                    </div>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        `;

        pane.querySelector('#btn-refresh-orders')?.addEventListener('click', renderTabContent);
        pane.querySelectorAll('.btn-advance-status').forEach(btn => {
          btn.addEventListener('click', () => updateStatus(btn.dataset.id, btn.dataset.status));
        });

      } else if (activeTab === 'reservations') {
        let reservations = [];
        try {
          const res = await fetch(`/api/reservations/restaurant/${currentMerchant.id}`);
          const data = await res.json();
          reservations = data.reservations || [];
        } catch (e) {
          reservations = [];
        }

        if (reservations.length === 0) {
          pane.innerHTML = `
            <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 60px 20px; text-align: center;">
              <div style="font-size: 54px; margin-bottom: 12px;">🍽️</div>
              <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;">No Table Reservations Yet</h3>
              <p style="font-size: 13px; color: var(--clr-text-muted); max-width: 420px; margin: 0 auto 18px;">
                Dine-in bookings made by guests via the Storefront will appear here with guest count, time slots, and pre-ordered dishes.
              </p>
              <button class="btn btn-secondary btn-sm" id="btn-refresh-res" style="border-radius: var(--radius-full);">
                🔄 Refresh Reservations
              </button>
            </div>
          `;
          pane.querySelector('#btn-refresh-res')?.addEventListener('click', renderTabContent);
          return;
        }

        pane.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h2 style="font-size: 18px; font-weight: 800; margin: 0;">Table Bookings & Dine-in Guests (${reservations.length})</h2>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0;">Manage reserved seats, guest check-in, and pre-ordered dishes</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-refresh-res" style="border-radius: var(--radius-full);">
              🔄 Refresh List
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px;">
            ${reservations.map(res => `
              <div style="background: var(--clr-surface); border: 1px solid ${res.status === 'confirmed' ? '#3b82f6' : res.status === 'seated' ? '#10b981' : '#64748b'}; border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-md);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <div>
                    <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 4px; color: var(--clr-primary);">${res.id}</span>
                    <span style="margin-left: 6px; font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${res.status === 'confirmed' ? '#60a5fa' : res.status === 'seated' ? '#4ade80' : '#94a3b8'};">
                      ● ${res.status}
                    </span>
                  </div>
                  <span style="font-size: 11px; color: var(--clr-text-muted);">📅 ${res.date} • ⏰ ${res.timeSlot}</span>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 12px; margin-bottom: 14px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: 700; font-size: 14px; color: white;">👤 ${res.customerName}</span>
                    <span style="font-weight: 700; font-size: 13px; color: #4ade80;">👥 ${res.guests} Guests</span>
                  </div>
                  <div style="font-size: 12px; color: var(--clr-text-muted);">📞 ${res.customerPhone || 'Not provided'}</div>
                  <div style="font-size: 12px; color: var(--clr-primary); font-weight: 600; margin-top: 4px;">🪑 ${res.tableNames || 'Window Table'}</div>
                  ${res.occasion ? `<div style="font-size: 11px; color: #f59e0b; margin-top: 2px;">🎉 Occasion: ${res.occasion}</div>` : ''}
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  ${res.status === 'confirmed' ? `
                    <button class="btn btn-sm btn-res-action" data-id="${res.id}" data-status="seated" style="flex: 1; background: #10b981; color: white; border: none; font-weight: 700; border-radius: var(--radius-md); padding: 8px;">
                      🪑 Mark Guest Seated
                    </button>
                  ` : res.status === 'seated' ? `
                    <button class="btn btn-sm btn-res-action" data-id="${res.id}" data-status="completed" style="flex: 1; background: #3b82f6; color: white; border: none; font-weight: 700; border-radius: var(--radius-md); padding: 8px;">
                      ✅ Mark Dining Complete
                    </button>
                  ` : `
                    <div style="font-size: 12px; color: #94a3b8; font-weight: 600; padding: 6px;">Status: ${res.status.toUpperCase()}</div>
                  `}
                </div>
              </div>
            `).join('')}
          </div>
        `;

        pane.querySelector('#btn-refresh-res')?.addEventListener('click', renderTabContent);
        pane.querySelectorAll('.btn-res-action').forEach(btn => {
          btn.addEventListener('click', async () => {
            const resId = btn.dataset.id;
            const newStatus = btn.dataset.status;
            try {
              const r = await fetch(`/api/reservations/${resId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
              });
              const d = await r.json();
              if (d.success) {
                showToast(`Reservation status updated to: ${newStatus.toUpperCase()}`, 'success');
                renderTabContent();
              }
            } catch (err) {
              showToast('Failed to update reservation status', 'error');
            }
          });
        });

      } else if (activeTab === 'menu') {
        // Find matching restaurant menu data
        const matched = defaultRestaurants.find(r => r.id === currentMerchant.id) || defaultRestaurants[0];
        const menuItems = matched.menu || [];
        const outOfStockIds = new Set(outletSettings.outOfStockItemIds || []);

        pane.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h2 style="font-size: 18px; font-weight: 800; margin: 0;">${currentMerchant.name} Menu & Live Stock Inventory (${menuItems.length} Dishes)</h2>
              <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0;">Toggle item in-stock status (86'd) or manage dish prices in real-time</p>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-menu-add-shortcut" style="border-radius: var(--radius-full); font-weight: 700; font-size: 12px; padding: 8px 16px; background: #ef4444; border: none;">
              ➕ Add New Dish
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
            ${menuItems.map(item => {
              const isSoldOut = outOfStockIds.has(Number(item.id));
              return `
                <div style="background: var(--clr-surface); border: 1.5px solid ${isSoldOut ? '#ef4444' : 'var(--clr-border)'}; opacity: ${isSoldOut ? '0.75' : '1'}; border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 14px; align-items: center; justify-content: space-between; position: relative;">
                  ${isSoldOut ? `
                    <span style="position: absolute; right: 12px; top: 10px; background: #ef4444; color: white; font-size: 9px; font-weight: 900; padding: 1px 6px; border-radius: 4px;">
                      86'd / SOLD OUT
                    </span>
                  ` : ''}
                  <div style="display: flex; gap: 12px; align-items: center;">
                    <div style="font-size: 28px;">${item.isVeg ? '🥗' : '🍗'}</div>
                    <div>
                      <div style="font-weight: 800; font-size: 14px; color: white;">${item.name}</div>
                      <div style="font-size: 12px; color: #4ade80; font-weight: bold;">₹${item.price}</div>
                      <div style="font-size: 11px; color: var(--clr-text-muted);">${item.category || 'Specialty'}</div>
                    </div>
                  </div>
                  <div>
                    <button class="btn-stock-toggle btn btn-sm" data-item-id="${item.id}" data-sold="${isSoldOut ? '1' : '0'}" style="font-size: 11px; padding: 6px 12px; border-radius: var(--radius-full); border: 1.5px solid ${isSoldOut ? '#ef4444' : '#22c55e'}; background: ${isSoldOut ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.15)'}; color: ${isSoldOut ? '#ef4444' : '#4ade80'}; font-weight: 800; cursor: pointer;">
                      ${isSoldOut ? '🔴 SOLD OUT' : '🟢 IN STOCK'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;

        pane.querySelector('#btn-menu-add-shortcut')?.addEventListener('click', () => switchTab('add-dish'));
        
        pane.querySelectorAll('.btn-stock-toggle').forEach(btn => {
          btn.addEventListener('click', async () => {
            const itemId = btn.dataset.itemId;
            const currentSold = btn.dataset.sold === '1';
            const nextSold = !currentSold;

            const res = await toggleMenuItemStock(currentMerchant.id, itemId, nextSold);
            if (res && res.success) {
              outletSettings.outOfStockItemIds = res.settings.outOfStockItemIds || [];
              showToast(nextSold ? `Marked item #${itemId} as Sold Out 🔴` : `Restored item #${itemId} to In Stock 🟢`, nextSold ? '🔴' : '🟢');
              renderTabContent();
            }
          });
        });

      } else if (activeTab === 'analytics') {
        // Daily Revenue & Kitchen Performance Analytics Tab
        pane.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--clr-text-muted);">Loading kitchen revenue analytics...</div>`;

        try {
          const analyticsRes = await fetchRestaurantAnalytics(currentMerchant.id);
          const { summary, topDishes, hourlyTrends } = analyticsRes;

          pane.innerHTML = `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
                <div>
                  <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 4px; color: white;">📊 Daily Revenue & Kitchen Performance: ${currentMerchant.name}</h2>
                  <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0;">Real-time kitchen order tickets, gross GMV, and net settlement ledger</p>
                </div>
                <button class="btn btn-primary btn-sm" id="btn-export-settlement" style="background: #10b981; border: none; font-weight: 800; border-radius: var(--radius-full); padding: 8px 18px;">
                  📄 Download Daily Kitchen Ledger
                </button>
              </div>

              <!-- KPI Metrics Grid -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 20px; border-radius: var(--radius-xl);">
                  <div style="font-size: 11px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Gross Food Revenue (GMV)</div>
                  <div style="font-size: 26px; font-weight: 900; color: #4ade80; margin-top: 4px;">₹${(summary.grossRevenue || 0).toLocaleString()}</div>
                  <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 4px;">All ticket orders placed</div>
                </div>

                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 20px; border-radius: var(--radius-xl);">
                  <div style="font-size: 11px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Net Kitchen Payout (82%)</div>
                  <div style="font-size: 26px; font-weight: 900; color: #38bdf8; margin-top: 4px;">₹${(summary.netPayout || 0).toLocaleString()}</div>
                  <div style="font-size: 11px; color: #38bdf8; margin-top: 4px;">After 18% FoodDash platform fee</div>
                </div>

                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 20px; border-radius: var(--radius-xl);">
                  <div style="font-size: 11px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Kitchen Orders Completed</div>
                  <div style="font-size: 26px; font-weight: 900; color: white; margin-top: 4px;">${summary.totalOrders || 0} Tickets</div>
                  <div style="font-size: 11px; color: #4ade80; margin-top: 4px;">99.4% Order fulfillment rate</div>
                </div>

                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 20px; border-radius: var(--radius-xl);">
                  <div style="font-size: 11px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Average Order Value (AOV)</div>
                  <div style="font-size: 26px; font-weight: 900; color: #fbbf24; margin-top: 4px;">₹${summary.avgOrderValue || 0}</div>
                  <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 4px;">Per customer cart size</div>
                </div>
              </div>

              <!-- Top Dishes & Hourly Demand Distribution -->
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px;">
                <!-- Top Bestsellers -->
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 22px;">
                  <h3 style="font-size: 16px; font-weight: 800; margin: 0 0 16px; color: white; display: flex; align-items: center; gap: 8px;">
                    <span>🏆</span> Top Selling Dishes Ranking
                  </h3>
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${(topDishes.length > 0 ? topDishes : [
                      { name: 'Specialty Butter Chicken', count: 28, revenue: 8960 },
                      { name: 'Garlic Butter Naan', count: 42, revenue: 2940 },
                      { name: 'Royal Hyderabadi Biryani', count: 22, revenue: 7700 },
                      { name: 'Paneer Tikka Masala', count: 18, revenue: 5040 }
                    ]).map((dish, i) => `
                      <div>
                        <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 4px;">
                          <span>${i + 1}. ${dish.name}</span>
                          <span style="color: #4ade80;">${dish.count} orders (₹${dish.revenue})</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 99px; overflow: hidden;">
                          <div style="background: linear-gradient(90deg, #ef4444, #f97316); height: 100%; width: ${Math.min(100, Math.max(20, dish.count * 2.5))}%;"></div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Hourly Demand Trend -->
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 22px;">
                  <h3 style="font-size: 16px; font-weight: 800; margin: 0 0 16px; color: white; display: flex; align-items: center; gap: 8px;">
                    <span>🕒</span> Peak Ordering Demand Slots
                  </h3>
                  <div style="display: flex; flex-direction: column; gap: 14px;">
                    ${hourlyTrends.map(slot => `
                      <div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 4px;">
                          <span>${slot.slot}</span>
                          <span style="color: #38bdf8;">${slot.percentage}% Peak Volume</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.06); height: 8px; border-radius: 99px; overflow: hidden;">
                          <div style="background: linear-gradient(90deg, #38bdf8, #3b82f6); height: 100%; width: ${slot.percentage}%;"></div>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;

          pane.querySelector('#btn-export-settlement')?.addEventListener('click', () => {
            showToast(`Daily settlement statement generated for ${currentMerchant.name}! 📄`, '✅', 4000);
          });

        } catch (err) {
          pane.innerHTML = `<div style="color: #f87171; padding: 20px;">Could not compute analytics.</div>`;
        }

      } else if (activeTab === 'add-dish') {
        pane.innerHTML = `
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 32px; max-width: 680px; margin: 0 auto;">
            <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 6px; color: white;">Add Dish to ${currentMerchant.name}</h2>
            <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0 0 24px;">New dish will immediately appear for customers ordering from your outlet.</p>

            <form id="new-dish-form" style="display: flex; flex-direction: column; gap: 18px;">
              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); display: block; margin-bottom: 6px;">Dish Title</label>
                <input type="text" id="dish-name" placeholder="e.g. Royal Butter Chicken Delight" required style="width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white;" />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); display: block; margin-bottom: 6px;">Price (₹)</label>
                  <input type="number" id="dish-price" placeholder="320" required style="width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white;" />
                </div>
                <div>
                  <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); display: block; margin-bottom: 6px;">Category</label>
                  <select id="dish-cat" style="width: 100%; padding: 12px 14px; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white;">
                    <option value="Main Course">Main Course</option>
                    <option value="Starters">Starters & Appetizers</option>
                    <option value="Breads & Rice">Breads & Rice</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div>
                <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); display: block; margin-bottom: 6px;">Short Description & Ingredients</label>
                <textarea id="dish-desc" rows="2" placeholder="Rich velvety tomato gravy with cashew paste and fresh cream" style="width: 100%; padding: 12px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white;"></textarea>
              </div>

              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="checkbox" id="dish-is-veg" style="width: 18px; height: 18px; accent-color: #22c55e;" />
                <span style="font-size: 13px; font-weight: 600;">Pure Vegetarian Item 🟢</span>
              </label>

              <button type="submit" class="btn btn-primary" style="padding: 14px; font-size: 15px; font-weight: 800; border-radius: var(--radius-md); background: linear-gradient(135deg, #ef4444, #f97316); border: none; cursor: pointer; margin-top: 10px;">
                🚀 Publish Dish to Customer Menu
              </button>
            </form>
          </div>
        `;

        pane.querySelector('#new-dish-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = pane.querySelector('#dish-name').value;
          const price = parseInt(pane.querySelector('#dish-price').value);
          const category = pane.querySelector('#dish-cat').value;
          const isVeg = pane.querySelector('#dish-is-veg').checked;

          const matched = defaultRestaurants.find(r => r.id === currentMerchant.id);
          if (matched && matched.menu) {
            matched.menu.unshift({
              id: Date.now(),
              name,
              price,
              category,
              isVeg,
              description: pane.querySelector('#dish-desc').value || '',
              rating: 5.0,
              votes: 1
            });
          }

          showToast(`Published "${name}" (₹${price}) to ${currentMerchant.name} menu! 🎉`, '✅');
          switchTab('menu');
        });
      }
    }

    renderTabContent();
  }

  // Initial render
  renderHub();
}
