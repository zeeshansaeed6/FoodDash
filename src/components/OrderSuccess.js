// ============================================================
// Order Success Overlay (With Live GPS Tracking Modal Link)
// ============================================================
import { openLiveTracking } from './LiveTrackingModal.js';
import { sounds } from '../utils/audio.js';

export function showOrderSuccess(onGoHome, order = null) {
  const overlay = document.createElement('div');
  overlay.className = 'order-success-overlay';
  overlay.id = 'order-success';

  sounds.playSuccess();

  const orderId = order?.id || 'FD-889922';

  overlay.innerHTML = `
    <div class="order-success">
      <div class="order-success__animation">
        <div class="order-success__check">
          <svg viewBox="0 0 52 52" class="order-success__svg">
            <circle class="order-success__circle" cx="26" cy="26" r="24" fill="none" />
            <path class="order-success__tick" fill="none" d="M14 27l7 7 16-16" />
          </svg>
        </div>
      </div>

      <h2 class="order-success__title">Order Placed! 🎉</h2>
      <p class="order-success__subtitle">Payment verified • Ref ID: <b>${orderId}</b></p>

      <div class="order-success__details">
        <div class="order-success__track-steps">
          <div class="order-success__step active">
            <div class="order-success__step-dot"></div>
            <div class="order-success__step-info">
              <div class="order-success__step-label">Order Confirmed</div>
              <div class="order-success__step-time">Just now</div>
            </div>
          </div>
          <div class="order-success__step-line"></div>
          <div class="order-success__step active">
            <div class="order-success__step-dot"></div>
            <div class="order-success__step-info">
              <div class="order-success__step-label">Kitchen Preparing Food</div>
              <div class="order-success__step-time">~5 min</div>
            </div>
          </div>
          <div class="order-success__step-line"></div>
          <div class="order-success__step">
            <div class="order-success__step-dot"></div>
            <div class="order-success__step-info">
              <div class="order-success__step-label">Out for delivery</div>
              <div class="order-success__step-time">~20 min</div>
            </div>
          </div>
        </div>
      </div>

      <div class="order-success__delivery-anim">
        <span class="order-success__bike">🛵</span>
        <span class="order-success__dots">· · · · · · ·</span>
        <span class="order-success__house">🏠</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 10px;">
        <button class="btn btn-primary btn-lg" id="order-track-gps-btn" style="background: linear-gradient(135deg, #00b09b, #96c93d); border: none; font-weight: bold;">
          🗺️ Track Live on GPS Map →
        </button>
        <button class="btn btn-ghost btn-sm" id="order-success-home" style="color: var(--clr-text-muted);">
          Back to Home
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('active'));

  overlay.querySelector('#order-track-gps-btn')?.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      openLiveTracking(orderId);
    }, 300);
  });

  overlay.querySelector('#order-success-home')?.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => {
      overlay.remove();
      onGoHome();
    }, 300);
  });
}
