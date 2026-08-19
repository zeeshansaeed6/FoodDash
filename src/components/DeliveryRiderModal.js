// ============================================================
// Delivery Fleet (Rider) Portal Component
// ============================================================
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';

let isOpen = false;
let riderModalEl = null;
let isDutyOnline = true;
let currentShiftEarnings = 1480;
let completedTripsCount = 8;

export function createDeliveryRiderModal() {
  riderModalEl = document.createElement('div');
  riderModalEl.className = 'login-overlay';
  riderModalEl.id = 'delivery-rider-overlay';
  document.body.appendChild(riderModalEl);
}

export function openDeliveryRiderPortal() {
  isOpen = true;
  riderModalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderRiderContent();
}

export function closeDeliveryRiderPortal() {
  isOpen = false;
  if (riderModalEl) {
    riderModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

async function fetchRiderOrders() {
  try {
    const res = await fetch('/api/orders/delivery/feed').then(r => r.json());
    return res.orders || [];
  } catch (e) {
    return [];
  }
}

async function renderRiderContent() {
  if (!riderModalEl) return;

  const orders = await fetchRiderOrders();

  riderModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 780px; max-height: 90vh; display: flex; flex-direction: column; padding: 0; overflow: hidden;">
      
      <!-- Top Rider Header -->
      <div style="background: linear-gradient(135deg, #101c24 0%, #0d131a 100%); padding: 20px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="rider-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">✕</button>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #00b09b, #96c93d); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 12px rgba(0,176,155,0.3);">
              🛵
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h2 style="font-size: 18px; font-weight: bold; margin: 0; color: white;">Ramesh Kumar</h2>
                <span class="badge badge-success" style="font-size: 11px;">4.9 ★ (128 Trips)</span>
              </div>
              <div style="font-size: 12px; color: var(--clr-text-muted);">Hero Electric • KA-01-FD-2026</div>
            </div>
          </div>

          <!-- Duty Toggle & Payout -->
          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="toggle-duty-btn" class="btn btn-sm" style="background: ${isDutyOnline ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255, 82, 82, 0.15)'}; border: 1px solid ${isDutyOnline ? 'var(--clr-success)' : '#ff5252'}; color: ${isDutyOnline ? 'var(--clr-success)' : '#ff5252'}; font-weight: bold;">
              ${isDutyOnline ? '🟢 Online & Ready' : '🔴 Off Duty'}
            </button>
            <div style="background: rgba(255,255,255,0.06); padding: 6px 14px; border-radius: var(--radius-md); text-align: right;">
              <div style="font-size: 10px; color: var(--clr-text-muted);">Today's Earnings</div>
              <div style="font-size: 16px; font-weight: 800; color: hsl(140, 90%, 65%);">₹${currentShiftEarnings}</div>
            </div>
          </div>
        </div>

        <!-- Rider Navigation Tabs -->
        <div style="display: flex; gap: 8px; margin-top: 18px;" id="rider-tabs">
          <button class="filter-chip active" data-tab="active-jobs">📦 Live Delivery Queue (${orders.filter(o => o.status !== 'delivered').length})</button>
          <button class="filter-chip" data-tab="completed-jobs">✅ Completed Deliveries (${orders.filter(o => o.status === 'delivered').length})</button>
        </div>
      </div>

      <!-- Main Body -->
      <div style="flex: 1; overflow-y: auto; padding: 24px;" id="rider-body">
        
        <!-- Live Delivery Tasks -->
        <div id="tab-active-jobs" class="rider-tab-pane">
          ${orders.filter(o => o.status !== 'delivered').length === 0 ? `
            <div style="text-align: center; padding: 50px 20px; color: var(--clr-text-muted);">
              <div style="font-size: 48px; margin-bottom: 12px;">🛵</div>
              <div style="font-size: 16px; font-weight: bold; color: var(--clr-text); margin-bottom: 4px;">All caught up!</div>
              <div style="font-size: 13px;">New pickup requests from restaurants will appear here in real time.</div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${orders.filter(o => o.status !== 'delivered').map(order => `
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 18px; position: relative;">
                  
                  <!-- Card Header -->
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-family: monospace; font-weight: bold; color: var(--clr-primary-light); font-size: 14px;">#${order.id}</span>
                        <span class="badge" style="background: ${getStatusColor(order.status)}; color: white; padding: 2px 8px; font-size: 11px;">${order.status.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 2px;">Placed ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-size: 16px; font-weight: 800; color: hsl(140, 90%, 65%);">Earn ₹${Math.round(45 + (order.bill?.grandTotal || 200) * 0.08)}</div>
                      <div style="font-size: 11px; color: var(--clr-text-muted);">Delivery Payout + Tip</div>
                    </div>
                  </div>

                  <!-- Route Points: Pickup & Drop -->
                  <div style="display: flex; flex-direction: column; gap: 10px; background: var(--clr-bg-elevated); padding: 14px; border-radius: var(--radius-md); margin-bottom: 14px;">
                    <!-- Pickup -->
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                      <span style="font-size: 18px;">🏪</span>
                      <div style="flex: 1;">
                        <div style="font-weight: bold; font-size: 13px; color: var(--clr-text);">PICKUP: ${order.restaurantName}</div>
                        <div style="font-size: 11px; color: var(--clr-text-muted);">${order.items.length} items to collect (${order.items.map(i => `${i.qty}x ${i.name}`).join(', ')})</div>
                      </div>
                    </div>

                    <div style="border-left: 2px dashed var(--clr-border); margin-left: 9px; height: 12px;"></div>

                    <!-- Dropoff -->
                    <div style="display: flex; gap: 12px; align-items: flex-start;">
                      <span style="font-size: 18px;">🏠</span>
                      <div style="flex: 1;">
                        <div style="font-weight: bold; font-size: 13px; color: var(--clr-text);">DELIVER TO: ${order.userName || 'Customer'}</div>
                        <div style="font-size: 11px; color: var(--clr-text-muted);">📍 ${order.deliveryAddress || 'Doorstep Address'}</div>
                        <div style="font-size: 11px; color: #ffb74d; margin-top: 2px;">📝 Note: "${order.deliveryInstruction || 'Leave at door'}"</div>
                      </div>
                    </div>
                  </div>

                  <!-- Rider Action Buttons -->
                  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${order.status === 'confirmed' || order.status === 'preparing' ? `
                      <button class="btn btn-primary btn-sm rider-action-btn" data-id="${order.id}" data-action="accept" style="flex: 1; min-width: 180px; background: linear-gradient(135deg, #00b09b, #96c93d); border: none; font-weight: bold;">
                        ⚡ Accept Delivery Job
                      </button>
                    ` : ''}

                    ${order.status === 'rider_assigned' ? `
                      <button class="btn btn-secondary btn-sm rider-action-btn" data-id="${order.id}" data-action="pickup" style="flex: 1; min-width: 180px; font-weight: bold;">
                        🛍️ Picked Up from Kitchen → Start Navigation
                      </button>
                    ` : ''}

                    ${order.status === 'out_for_delivery' ? `
                      <button class="btn btn-primary btn-sm rider-action-btn" data-id="${order.id}" data-action="deliver" style="flex: 1; min-width: 180px; background: #00e676; border: none; color: black; font-weight: bold;">
                        🏠 Mark Delivered (Collect ₹${order.bill?.grandTotal || 0})
                      </button>
                    ` : ''}

                    <button class="btn btn-ghost btn-sm" onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress || 'Bangalore')}', '_blank')" style="border: 1px solid var(--clr-border);">
                      🗺️ Open Navigation
                    </button>
                  </div>

                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- Completed Tasks -->
        <div id="tab-completed-jobs" class="rider-tab-pane" style="display: none;">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${orders.filter(o => o.status === 'delivered').map(order => `
              <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 14px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: bold; font-size: 13px;">✅ Order #${order.id} • ${order.restaurantName}</div>
                  <div style="font-size: 11px; color: var(--clr-text-muted);">Delivered to ${order.userName || 'Customer'} at ${order.deliveryAddress}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: bold; color: var(--clr-success); font-size: 14px;">+₹${Math.round(45 + (order.bill?.grandTotal || 200) * 0.08)}</div>
                  <div style="font-size: 10px; color: var(--clr-text-muted);">Completed</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;

  function getStatusColor(st) {
    if (st === 'delivered') return '#00e676';
    if (st === 'out_for_delivery') return '#2979ff';
    if (st === 'rider_assigned') return '#9c27b0';
    if (st === 'preparing') return '#ff9100';
    return '#ff5252';
  }

  // Bind close
  riderModalEl.querySelector('#rider-close-btn').addEventListener('click', closeDeliveryRiderPortal);

  // Bind Duty Toggle
  riderModalEl.querySelector('#toggle-duty-btn')?.addEventListener('click', () => {
    isDutyOnline = !isDutyOnline;
    showToast(isDutyOnline ? 'You are now ONLINE for deliveries!' : 'You are now OFFLINE', isDutyOnline ? '🟢' : '🔴');
    renderRiderContent();
  });

  // Bind Tabs
  riderModalEl.querySelectorAll('#rider-tabs .filter-chip').forEach(tab => {
    tab.addEventListener('click', () => {
      riderModalEl.querySelectorAll('#rider-tabs .filter-chip').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      riderModalEl.querySelectorAll('.rider-tab-pane').forEach(p => p.style.display = 'none');
      riderModalEl.querySelector(`#tab-${target}`).style.display = 'block';
    });
  });

  // Bind Action Buttons
  riderModalEl.querySelectorAll('.rider-action-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      btn.disabled = true;

      try {
        const res = await fetch(`/api/orders/${id}/delivery-action`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            driverName: 'Ramesh Kumar',
            driverPhone: '+91 98765 43210'
          })
        }).then(r => r.json());

        if (res.success) {
          sounds.playSuccess();
          if (action === 'deliver') {
            currentShiftEarnings += 65;
            completedTripsCount += 1;
            showToast(`Delivery completed! +₹65 credited to your wallet 💰`, '🎉', 4000);
          } else if (action === 'pickup') {
            showToast('Order marked Picked Up! Head towards customer doorstep 🛵', '🛍️');
          } else {
            showToast('Delivery job accepted! Proceed to restaurant kitchen 🏪', '⚡');
          }
          renderRiderContent();
        }
      } catch (err) {
        showToast('Failed to update delivery action', '❌');
      }
    });
  });
}
