// ============================================================
// FoodDash — Multi-Rider Fleet & Delivery Partner Portal
// ============================================================
import { showToast } from '../components/Toast.js';
import { mountActiveGoogleMap } from '../utils/googleMaps.js';
import {
  fetchRegisteredDrivers,
  updateDriverDutyStatus,
  recordDriverPayout,
  sendDriverDeliveryAction
} from '../api/client.js';
import { openRiderRegisterModal } from '../components/RiderRegisterModal.js';

export async function renderDriverPage(container, onNavigate) {
  let activeTab = 'tasks';
  let activeOrder = null;
  let driversList = [];
  let currentDriver = null;

  // Load registered drivers from backend
  async function loadFleetDrivers() {
    try {
      const res = await fetchRegisteredDrivers();
      if (res && res.success && res.drivers?.length > 0) {
        driversList = res.drivers;
        if (!currentDriver) {
          currentDriver = driversList[0];
        } else {
          // Re-sync current driver stats
          currentDriver = driversList.find(d => d.id === currentDriver.id) || driversList[0];
        }
      }
    } catch (e) {
      console.warn('Could not load fleet drivers, using default:', e);
      if (!currentDriver) {
        currentDriver = {
          id: 'dr_101',
          name: 'Ramesh Kumar',
          phone: '+91 98765 43210',
          vehicleType: 'Electric Scooter',
          vehicleNumber: 'KA-01-FD-2026',
          city: 'Bangalore',
          zone: 'Central Metro Hub',
          rating: 4.98,
          totalTrips: 142,
          totalEarnings: 8420,
          status: 'online',
          avatar: '🛵'
        };
        driversList = [currentDriver];
      }
    }
  }

  await loadFleetDrivers();

  function renderPageShell() {
    const isOnline = currentDriver?.status === 'online';

    container.innerHTML = `
      <div class="driver-page-container" style="min-height: calc(100vh - var(--nav-h)); padding-top: var(--nav-h); background: var(--clr-bg); color: var(--clr-text);">
        
        <!-- Top Portal Switcher Bar -->
        <div style="background: linear-gradient(90deg, #064e3b, #0f172a); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 12px 24px;">
          <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="portal-badge-pill" style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4);">
                🛵 DRIVER FLEET PORTAL
              </span>
              <span style="font-size: 13px; color: var(--clr-text-muted);">
                Multi-rider fleet radar, real-time GPS tracking, and instant earnings ledger
              </span>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="btn btn-primary btn-sm" id="btn-open-rider-register" style="font-size: 12px; border-radius: var(--radius-full); background: #10b981; border: none; font-weight: 800; padding: 6px 14px; display: flex; align-items: center; gap: 6px;">
                <span>➕</span> Register as New Rider
              </button>
              <button class="btn btn-ghost btn-sm" id="driver-switch-customer" style="font-size: 12px; border-radius: var(--radius-full);">
                🛍️ Customer App
              </button>
              <button class="btn btn-ghost btn-sm" id="driver-switch-merchant" style="font-size: 12px; color: #f87171; border-radius: var(--radius-full);">
                🧑‍🍳 Restaurant Hub
              </button>
            </div>
          </div>
        </div>

        <!-- Driver Dashboard Header -->
        <div style="background: linear-gradient(180deg, rgba(6, 78, 59, 0.3) 0%, transparent 100%); padding: 28px 0 16px;">
          <div class="container">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);">
                  ${currentDriver?.avatar || '🛵'}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <!-- Driver Selector Dropdown -->
                    <div style="position: relative; display: inline-block;">
                      <select id="rider-profile-select" style="background: rgba(15, 23, 42, 0.85); color: white; border: 1.5px solid #22c55e; border-radius: 8px; padding: 4px 10px; font-weight: 800; font-size: 16px; cursor: pointer; outline: none;">
                        ${driversList.map(d => `
                          <option value="${d.id}" ${d.id === currentDriver?.id ? 'selected' : ''}>
                            ${d.name} (${d.vehicleType || 'EV Scooter'} • ${d.city || 'City'})
                          </option>
                        `).join('')}
                      </select>
                    </div>

                    <span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #22c55e; padding: 3px 8px; border-radius: 99px; font-size: 11px; font-weight: bold;">
                      ⭐ ${currentDriver?.rating || 4.9} Rating
                    </span>
                  </div>
                  <div style="font-size: 13px; color: var(--clr-text-muted); margin-top: 4px;">
                    ${currentDriver?.vehicleNumber || 'KA-01-FD-2026'} • Zone: ${currentDriver?.zone || 'Metro Hub'} • ${currentDriver?.phone || ''}
                  </div>
                </div>
              </div>

              <!-- Duty Status & Shift Earnings -->
              <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 10px 16px; border-radius: var(--radius-lg); text-align: center; min-width: 100px;">
                  <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Completed Trips</div>
                  <div style="font-size: 18px; font-weight: 800; color: white;" id="rider-trips-count">${currentDriver?.totalTrips || 0}</div>
                </div>
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); padding: 10px 16px; border-radius: var(--radius-lg); text-align: center; min-width: 110px;">
                  <div style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700;">Total Payout</div>
                  <div style="font-size: 18px; font-weight: 800; color: #4ade80;" id="rider-earnings-val">₹${currentDriver?.totalEarnings || 0}</div>
                </div>
                <button class="btn btn-sm" id="btn-toggle-duty" style="background: ${isOnline ? '#10b981' : '#64748b'}; color: white; border: none; padding: 10px 18px; border-radius: var(--radius-full); font-weight: 800; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <span>${isOnline ? '🟢' : '⚪'}</span> <span id="duty-text">${isOnline ? 'ONLINE & READY' : 'OFFLINE'}</span>
                </button>
              </div>
            </div>

            <!-- Navigation Tabs -->
            <div style="display: flex; gap: 10px; margin-top: 24px; border-bottom: 1px solid var(--clr-border); padding-bottom: 2px; overflow-x: auto;">
              <button class="driver-tab-btn ${activeTab === 'tasks' ? 'active' : ''}" data-tab="tasks" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'tasks' ? '#4ade80' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'tasks' ? '#22c55e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>📍</span> Available Pickup Radar <span class="badge" id="driver-radar-badge" style="background: #22c55e; color: black; font-weight: 800; padding: 2px 7px; border-radius: 99px; font-size: 11px;">0</span>
              </button>
              <button class="driver-tab-btn ${activeTab === 'active' ? 'active' : ''}" data-tab="active" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'active' ? '#4ade80' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'active' ? '#22c55e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>🗺️</span> Active Trip Navigator
              </button>
              <button class="driver-tab-btn ${activeTab === 'fleet' ? 'active' : ''}" data-tab="fleet" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'fleet' ? '#4ade80' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'fleet' ? '#22c55e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>👥</span> Fleet Directory (${driversList.length})
              </button>
              <button class="driver-tab-btn ${activeTab === 'earnings' ? 'active' : ''}" data-tab="earnings" style="padding: 10px 18px; font-size: 13px; font-weight: 700; background: transparent; border: none; color: ${activeTab === 'earnings' ? '#4ade80' : 'var(--clr-text-muted)'}; border-bottom: 3px solid ${activeTab === 'earnings' ? '#22c55e' : 'transparent'}; cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <span>💰</span> Payouts & Tips
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Content Area -->
        <div class="container" style="padding: 24px 0 60px;">
          <div id="driver-tab-pane">
            <!-- Dynamic Content -->
          </div>
        </div>
      </div>
    `;

    bindHeaderEvents();
    renderTabPane();
  }

  function bindHeaderEvents() {
    // Portal Switchers
    container.querySelector('#driver-switch-customer')?.addEventListener('click', () => {
      onNavigate('home');
      showToast('Switched to Customer App 🛍️', '👤');
    });

    container.querySelector('#driver-switch-merchant')?.addEventListener('click', () => {
      onNavigate('merchant');
      showToast('Switched to Restaurant Partner Hub 🧑‍🍳', '🧑‍🍳');
    });

    // Register New Rider Modal
    container.querySelector('#btn-open-rider-register')?.addEventListener('click', () => {
      openRiderRegisterModal((newRider) => {
        driversList.unshift(newRider);
        currentDriver = newRider;
        renderPageShell();
      });
    });

    // Switch Active Rider Dropdown
    container.querySelector('#rider-profile-select')?.addEventListener('change', (e) => {
      const selected = driversList.find(d => d.id === e.target.value);
      if (selected) {
        currentDriver = selected;
        showToast(`Switched active profile to ${currentDriver.name} 🛵`, '✅');
        renderPageShell();
      }
    });

    // Duty Toggle
    const dutyBtn = container.querySelector('#btn-toggle-duty');
    dutyBtn?.addEventListener('click', async () => {
      if (!currentDriver) return;
      const nextStatus = currentDriver.status === 'online' ? 'offline' : 'online';
      currentDriver.status = nextStatus;
      await updateDriverDutyStatus(currentDriver.id, nextStatus);
      showToast(`${currentDriver.name} is now ${nextStatus.toUpperCase()} ${nextStatus === 'online' ? '🟢' : '⚪'}`, '🛵');
      renderPageShell();
    });

    // Tab Navigation
    container.querySelectorAll('.driver-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        renderPageShell();
      });
    });
  }

  async function renderTabPane() {
    const pane = container.querySelector('#driver-tab-pane');
    if (!pane) return;

    if (activeTab === 'tasks') {
      pane.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 800; margin: 0 0 4px;">Available Delivery Orders Radar</h2>
            <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0;">Orders ready for pickup in ${currentDriver?.city || 'your area'}</p>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-driver-refresh" style="border-radius: var(--radius-full); font-size: 12px;">
            🔄 Refresh Feed
          </button>
        </div>
        <div id="driver-tasks-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 18px;">
          <div style="padding: 40px; text-align: center; color: var(--clr-text-muted);">Loading pickup radar...</div>
        </div>
      `;

      pane.querySelector('#btn-driver-refresh')?.addEventListener('click', renderTabPane);

      // Fetch live orders
      try {
        const res = await fetch('http://localhost:5000/api/orders/delivery/feed');
        const data = await res.json();
        const orders = data.orders || [];
        const availableOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'rider_assigned');

        const radarBadge = container.querySelector('#driver-radar-badge');
        if (radarBadge) radarBadge.textContent = availableOrders.length;

        const grid = pane.querySelector('#driver-tasks-grid');
        if (availableOrders.length === 0) {
          grid.innerHTML = `
            <div style="grid-column: 1 / -1; background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 48px 20px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 12px;">🎯</div>
              <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px;">Pickup Radar is Active</h3>
              <p style="font-size: 13px; color: var(--clr-text-muted); max-width: 420px; margin: 0 auto 16px;">
                Searching for orders near ${currentDriver?.zone || 'your zone'}. Place a test order in the Customer App to see it appear here instantly!
              </p>
              <button class="btn btn-secondary btn-sm" id="btn-driver-place-demo" style="border-radius: var(--radius-full);">
                🛍️ Open Customer App to Order
              </button>
            </div>
          `;
          grid.querySelector('#btn-driver-place-demo')?.addEventListener('click', () => onNavigate('home'));
          return;
        }

        grid.innerHTML = availableOrders.map(order => `
          <div style="background: var(--clr-surface); border: 1px solid rgba(34, 197, 94, 0.4); border-radius: var(--radius-xl); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: var(--shadow-md);">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-family: monospace; font-size: 12px; font-weight: bold; background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 4px;">#${(order.id || '').toString().slice(-6)}</span>
                    <span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; font-weight: bold; font-size: 11px; padding: 3px 8px; border-radius: 4px;">
                      ${order.status === 'rider_assigned' ? '🛵 ASSIGNED' : '🍳 IN KITCHEN'}
                    </span>
                  </div>
                  <h3 style="font-size: 16px; font-weight: 800; color: white; margin: 8px 0 0;">
                    🏪 ${order.restaurantName || 'Restaurant Outlet'}
                  </h3>
                </div>
                <div style="text-align: right;">
                  <div style="font-size: 16px; font-weight: 900; color: #4ade80;">₹${(order.bill?.grandTotal || 0)}</div>
                  <div style="font-size: 11px; color: #38bdf8; font-weight: bold;">+ ₹60 Payout</div>
                </div>
              </div>

              <!-- Pickup & Drop Locations -->
              <div style="background: rgba(0,0,0,0.3); border-radius: var(--radius-md); padding: 12px; margin-bottom: 14px; font-size: 12px;">
                <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px;">
                  <span style="color: #f87171;">🟢</span>
                  <div>
                    <div style="font-size: 10px; text-transform: uppercase; color: var(--clr-text-muted); font-weight: 700;">PICKUP RESTAURANT</div>
                    <div style="font-weight: 600;">${order.restaurantName || 'Restaurant'} • 1.1 km away</div>
                  </div>
                </div>
                <div style="display: flex; align-items: flex-start; gap: 8px;">
                  <span style="color: #38bdf8;">📍</span>
                  <div>
                    <div style="font-size: 10px; text-transform: uppercase; color: var(--clr-text-muted); font-weight: 700;">CUSTOMER DROP LOCATION</div>
                    <div style="font-weight: 600;">${order.deliveryAddress || 'Customer Doorstep'}</div>
                    <div style="font-size: 11px; color: var(--clr-text-muted);">Customer: <b>${order.userName || 'Foodie'}</b></div>
                  </div>
                </div>
              </div>

              <!-- Item Summary -->
              <div style="font-size: 12px; color: var(--clr-text-muted); margin-bottom: 14px;">
                🛍️ ${(order.items || []).length} items: ${(order.items || []).map(i => `${i.qty || 1}x ${i.name}`).join(', ')}
              </div>
            </div>

            <!-- Accept Delivery Task Button -->
            <button class="btn btn-primary btn-accept-task" data-id="${order.id}" style="width: 100%; border-radius: var(--radius-md); font-weight: 800; padding: 12px; background: #10b981; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>🛵</span> Accept Delivery as ${currentDriver?.name || 'Rider'} (₹60)
            </button>
          </div>
        `).join('');

        grid.querySelectorAll('.btn-accept-task').forEach(btn => {
          btn.addEventListener('click', async () => {
            const orderId = btn.dataset.id;
            const found = orders.find(o => o.id === orderId);
            if (found) {
              activeOrder = found;
              await sendDriverDeliveryAction(orderId, 'accept', {
                driverName: currentDriver.name,
                driverPhone: currentDriver.phone,
                vehicle: `${currentDriver.vehicleType} (${currentDriver.vehicleNumber})`
              });
              showToast(`Accepted Order #${orderId.slice(-6)} as ${currentDriver.name}! 🗺️`, '🛵');
              activeTab = 'active';
              renderPageShell();
            }
          });
        });

      } catch (err) {
        pane.querySelector('#driver-tasks-grid').innerHTML = `<div style="color: #f87171; padding: 20px;">Could not connect to live order feed.</div>`;
      }

    } else if (activeTab === 'active') {
      if (!activeOrder) {
        pane.innerHTML = `
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 60px 20px; text-align: center;">
            <div style="font-size: 54px; margin-bottom: 12px;">🗺️</div>
            <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 6px;">No Active Trip</h3>
            <p style="font-size: 13px; color: var(--clr-text-muted); max-width: 400px; margin: 0 auto 18px;">
              Select an available order from the Pickup Radar to start active GPS navigation as <b>${currentDriver?.name}</b>.
            </p>
            <button class="btn btn-primary btn-sm" id="btn-to-radar" style="border-radius: var(--radius-full); background: #10b981; border: none; padding: 8px 18px;">
              📍 Open Pickup Radar
            </button>
          </div>
        `;
        pane.querySelector('#btn-to-radar')?.addEventListener('click', () => {
          activeTab = 'tasks';
          renderPageShell();
        });
        return;
      }

      pane.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 24px;">
          <!-- GPS Route Visualizer -->
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); overflow: hidden;">
            <div style="background: #0f172a; padding: 18px 22px; border-bottom: 1px solid var(--clr-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 11px; color: #4ade80; font-weight: 800; text-transform: uppercase;">ACTIVE TRIP NAVIGATOR • ASSIGNED TO ${currentDriver?.name?.toUpperCase()}</div>
                <h2 style="font-size: 18px; font-weight: 800; margin: 2px 0 0;">Navigating to ${activeOrder.deliveryAddress || 'Customer Doorstep'}</h2>
              </div>
              <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; padding: 6px 14px; border-radius: var(--radius-full); font-weight: 800; color: #4ade80; font-size: 13px;">
                ⏱️ 8 Mins ETA
              </div>
            </div>

            <!-- Active Map Canvas -->
            <div id="gmaps-driver-nav-container" style="position: relative; height: 320px; background: #020617; overflow: hidden;">
              <!-- Loaded via mountActiveGoogleMap -->
            </div>

            <!-- Steps Progression -->
            <div style="padding: 22px 24px;">
              <h3 style="font-size: 15px; font-weight: 800; margin: 0 0 14px;">Trip Milestones</h3>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px;">
                  <span style="color: #4ade80;">✅</span>
                  <span>Picked up from <b>${activeOrder.restaurantName || 'Restaurant'}</b></span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px;">
                  <span style="color: #38bdf8;">🛵</span>
                  <span>Rider <b>${currentDriver?.name}</b> in transit with GPS Stream</span>
                </div>
                <div style="display: flex; align-items: center; gap: 12px; font-size: 13px;">
                  <span style="color: var(--clr-text-muted);">⏳</span>
                  <span style="color: var(--clr-text-muted);">Arriving at ${activeOrder.deliveryAddress || 'Doorstep'}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trip Controls Card -->
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 11px; color: var(--clr-text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">Customer Details</div>
              <h3 style="font-size: 18px; font-weight: 800; margin: 0 0 4px;">${activeOrder.userName || 'Customer'}</h3>
              <div style="font-size: 13px; color: var(--clr-text-muted); margin-bottom: 14px;">📍 ${activeOrder.deliveryAddress || 'Doorstep'}</div>

              <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px;">
                <div style="font-size: 11px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 6px;">ITEMS IN BAG</div>
                ${(activeOrder.items || []).map(i => `
                  <div style="font-size: 13px; padding: 2px 0;"><b>${i.qty || 1}x</b> ${i.name}</div>
                `).join('')}
              </div>

              <!-- Quick Communication -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">
                <button class="btn btn-secondary btn-sm" id="btn-call-cust" style="border-radius: var(--radius-md); font-weight: bold; font-size: 12px;">
                  📞 Call
                </button>
                <button class="btn btn-secondary btn-sm" id="btn-sms-cust" style="border-radius: var(--radius-md); font-weight: bold; font-size: 12px;">
                  💬 SMS
                </button>
              </div>
            </div>

            <!-- Complete Drop-off Action -->
            <div>
              <button class="btn btn-primary" id="btn-complete-delivery" style="width: 100%; border-radius: var(--radius-md); padding: 14px; font-weight: 800; background: #10b981; border: none; font-size: 14px; cursor: pointer;">
                ✅ Mark Delivered & Collect ₹60 Payout
              </button>
            </div>
          </div>
        </div>
      `;

      // Mount Map
      const navMapContainer = pane.querySelector('#gmaps-driver-nav-container');
      if (navMapContainer) {
        mountActiveGoogleMap(navMapContainer, {
          origin: { lat: 12.9352, lng: 77.6245, label: activeOrder.restaurantName || 'Restaurant' },
          destination: { lat: 12.9279, lng: 77.6271, label: activeOrder.userName || 'Customer' },
          driverPos: { lat: 12.9315, lng: 77.6258, label: currentDriver?.name || 'Rider' },
          height: '320px'
        });
      }

      pane.querySelector('#btn-call-cust')?.addEventListener('click', () => {
        showToast(`📞 Dialing ${activeOrder.userName || 'Customer'}...`, '📱');
      });
      pane.querySelector('#btn-sms-cust')?.addEventListener('click', () => {
        showToast(`💬 SMS sent: "${currentDriver.name} is arriving in 5 minutes with your order"`, '📩');
      });

      pane.querySelector('#btn-complete-delivery')?.addEventListener('click', async () => {
        await sendDriverDeliveryAction(activeOrder.id, 'deliver');
        await recordDriverPayout(currentDriver.id, 60);
        showToast(`Order #${activeOrder.id.slice(-6)} Delivered! ₹60 credited to ${currentDriver.name} 🎉`, '💰', 4000);
        activeOrder = null;
        await loadFleetDrivers();
        activeTab = 'tasks';
        renderPageShell();
      });

    } else if (activeTab === 'fleet') {
      // Fleet Directory
      pane.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 18px; font-weight: 800; margin: 0 0 4px;">Registered Fleet Directory</h2>
            <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0;">All onboarded delivery riders across cities</p>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-fleet-add-rider" style="background: #10b981; border: none; font-weight: 800; border-radius: var(--radius-full);">
            ➕ Onboard New Rider
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px;">
          ${driversList.map(d => `
            <div style="background: var(--clr-surface); border: 1.5px solid ${d.id === currentDriver?.id ? '#10b981' : 'var(--clr-border)'}; border-radius: var(--radius-xl); padding: 18px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
              ${d.id === currentDriver?.id ? `
                <span style="position: absolute; right: 14px; top: 14px; background: #10b981; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 99px;">
                  ACTIVE PROFILE
                </span>
              ` : ''}
              <div>
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                  <div style="width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, #1e293b, #0f172a); display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid var(--clr-border);">
                    ${d.avatar || '🛵'}
                  </div>
                  <div>
                    <h3 style="font-size: 15px; font-weight: 800; margin: 0; color: white;">${d.name}</h3>
                    <div style="font-size: 12px; color: var(--clr-text-muted);">${d.city} • ${d.vehicleType}</div>
                  </div>
                </div>

                <div style="background: rgba(255,255,255,0.03); border-radius: var(--radius-md); padding: 10px 12px; font-size: 12px; margin-bottom: 14px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: var(--clr-text-muted);">Plate:</span>
                    <b style="font-family: monospace;">${d.vehicleNumber}</b>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="color: var(--clr-text-muted);">Completed Trips:</span>
                    <b>${d.totalTrips || 0} trips</b>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: var(--clr-text-muted);">Total Earnings:</span>
                    <b style="color: #4ade80;">₹${d.totalEarnings || 0}</b>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 8px;">
                ${d.id !== currentDriver?.id ? `
                  <button class="btn btn-secondary btn-sm btn-switch-rider" data-id="${d.id}" style="flex: 1; border-radius: var(--radius-md); font-size: 12px; font-weight: bold;">
                    ⚡ Switch to ${d.name.split(' ')[0]}
                  </button>
                ` : `
                  <div style="flex: 1; text-align: center; font-size: 12px; font-weight: bold; color: #4ade80; padding: 6px;">
                    ✓ Currently Operating
                  </div>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      pane.querySelector('#btn-fleet-add-rider')?.addEventListener('click', () => {
        openRiderRegisterModal((newRider) => {
          driversList.unshift(newRider);
          currentDriver = newRider;
          renderPageShell();
        });
      });

      pane.querySelectorAll('.btn-switch-rider').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = driversList.find(d => d.id === btn.dataset.id);
          if (selected) {
            currentDriver = selected;
            showToast(`Switched active profile to ${currentDriver.name} 🛵`, '✅');
            renderPageShell();
          }
        });
      });

    } else if (activeTab === 'earnings') {
      pane.innerHTML = `
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2 style="font-size: 18px; font-weight: 800; margin: 0 0 4px;">Rider Payouts & Tip Ledger: ${currentDriver?.name}</h2>
              <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0;">Instant daily and weekly payout statements</p>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-request-payout" style="background: #10b981; border: none; font-weight: 800; border-radius: var(--radius-full);">
              💸 Instant UPI Payout
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); padding: 16px; border-radius: var(--radius-lg);">
              <div style="font-size: 12px; color: var(--clr-text-muted);">Trip Delivery Earnings</div>
              <div style="font-size: 22px; font-weight: 800; color: white; margin-top: 4px;">₹${currentDriver?.totalEarnings || 0}</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); padding: 16px; border-radius: var(--radius-lg);">
              <div style="font-size: 12px; color: var(--clr-text-muted);">100% Customer Tips</div>
              <div style="font-size: 22px; font-weight: 800; color: #4ade80; margin-top: 4px;">₹940</div>
            </div>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); padding: 16px; border-radius: var(--radius-lg);">
              <div style="font-size: 12px; color: var(--clr-text-muted);">Welcome Bonus Credited</div>
              <div style="font-size: 22px; font-weight: 800; color: #38bdf8; margin-top: 4px;">₹500</div>
            </div>
          </div>
        </div>
      `;

      pane.querySelector('#btn-request-payout')?.addEventListener('click', () => {
        showToast(`Instant UPI transfer of ₹${currentDriver?.totalEarnings || 0} initiated to ${currentDriver?.phone}! 💸`, '✅', 4000);
      });
    }
  }

  renderPageShell();
}
