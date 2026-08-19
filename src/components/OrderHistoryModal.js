import { fetchOrderHistory } from '../api/client.js';
import { openLiveTracking } from './LiveTrackingModal.js';
import { showToast } from './Toast.js';

export function createOrderHistoryModal() {
  const overlay = document.createElement('div');
  overlay.className = 'login-overlay';
  overlay.id = 'orders-history-overlay';

  overlay.innerHTML = `
    <div class="login-modal" style="max-width: 580px; max-height: 85vh; display: flex; flex-direction: column;">
      <button class="login-modal__close" id="orders-close-btn" aria-label="Close orders modal">✕</button>
      
      <div style="margin-bottom: 16px;">
        <h2 style="font-family: var(--ff-heading); font-size: var(--fs-xl); font-weight: var(--fw-bold); margin-bottom: 2px;">
          🛵 My Order History
        </h2>
        <p style="font-size: var(--fs-xs); color: var(--clr-text-muted);">
          View past orders, delivery receipts and live order statuses
        </p>
      </div>

      <div id="orders-list-content" style="flex: 1; overflow-y: auto; padding-right: 4px;">
        <div style="text-align: center; padding: 40px; color: var(--clr-text-muted);">
          Loading your orders...
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#orders-close-btn').addEventListener('click', closeOrderHistoryModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOrderHistoryModal();
  });
}

export async function openOrderHistoryModal() {
  const overlay = document.getElementById('orders-history-overlay');
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const content = overlay.querySelector('#orders-list-content');
  content.innerHTML = `<div style="text-align: center; padding: 30px; color: var(--clr-text-muted);">Fetching orders from server...</div>`;

  const res = await fetchOrderHistory();
  if (res.success && res.orders && res.orders.length > 0) {
    content.innerHTML = res.orders.map(order => `
      <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: bold; font-size: 15px; color: var(--clr-text);">🏪 ${order.restaurantName}</div>
            <div style="font-size: 11px; color: var(--clr-text-muted);">Order #${order.id} • ${new Date(order.createdAt).toLocaleDateString()} at ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <span class="badge ${order.status === 'delivered' ? 'badge-success' : 'badge-accent'}" style="text-transform: capitalize;">
            ${order.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div style="font-size: 13px; color: var(--clr-text-secondary); margin: 8px 0; border-top: 1px dashed var(--clr-border); border-bottom: 1px dashed var(--clr-border); padding: 8px 0;">
          ${order.items.map(item => `<div style="display: flex; justify-content: space-between;"><span>${item.qty}x ${item.name}</span> <span>₹${item.price * item.qty}</span></div>`).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
          <div>
            <span style="color: var(--clr-text-muted);">Total Paid:</span> <b style="color: var(--clr-text);">₹${order.bill?.grandTotal || 0}</b>
          </div>
          <button class="btn btn-secondary btn-sm track-order-history-btn" data-id="${order.id}" style="font-size: 12px; display: flex; align-items: center; gap: 4px;">
            🗺️ Track GPS
          </button>
        </div>
      </div>
    `).join('');

    content.querySelectorAll('.track-order-history-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        closeOrderHistoryModal();
        openLiveTracking(id);
      });
    });
  } else {
    content.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🍽️</div>
        <div style="font-weight: bold; margin-bottom: 4px;">No past orders yet</div>
        <div style="font-size: 12px; color: var(--clr-text-muted);">When you place orders, they will show up here.</div>
      </div>
    `;
  }
}

export function closeOrderHistoryModal() {
  const overlay = document.getElementById('orders-history-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
