// ============================================================
// Real-Time GPS Delivery Tracking & Live Moving Map Modal
// ============================================================
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { mountActiveGoogleMap } from '../utils/googleMaps.js';
import { trackOrderLive } from '../api/client.js';

let trackingModalEl = null;
let currentOrderId = null;
let pollTimer = null;
let lastStatus = null;

export function initLiveTrackingModal() {
  trackingModalEl = document.createElement('div');
  trackingModalEl.className = 'login-overlay';
  trackingModalEl.id = 'live-tracking-modal-overlay';
  document.body.appendChild(trackingModalEl);
}

export function openLiveTracking(orderId) {
  currentOrderId = orderId;
  trackingModalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderLiveTracking();
}

export function closeLiveTracking() {
  if (trackingModalEl) {
    trackingModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (pollTimer) clearInterval(pollTimer);
}

async function renderLiveTracking() {
  if (!trackingModalEl) return;

  const data = await trackOrderLive(currentOrderId);
  if (!data || !data.success) return;

  const driver = data.driver || { name: 'Ramesh Kumar', phone: '+91 98765 43210', rating: 4.9, vehicle: 'Hero Electric (KA-01-FD-2026)' };
  const restLoc = data.restaurantLocation || { lat: 12.9352, lng: 77.6245, address: data.restaurantName };
  const custLoc = data.customerLocation || { lat: 12.9279, lng: 77.6271, address: 'Your Doorstep' };
  const driverLoc = data.driverLocation || { lat: restLoc.lat, lng: restLoc.lng, speed: 28, heading: 45 };

  lastStatus = data.status;

  trackingModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 660px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; padding: 0; border: 1px solid var(--clr-border);">
      <!-- Top Header -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 16px 22px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="track-close-btn" style="position: absolute; right: 16px; top: 16px; background: rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; border: 1px solid rgba(255,255,255,0.15);">✕</button>
        <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 42px;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: blink 1.2s infinite;"></span>
              <span style="font-size: 11px; color: var(--clr-text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Real-Time GPS Live Radar • ${data.orderId}</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 800; margin: 3px 0 0; color: white;">${data.restaurantName}</h3>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--clr-text-muted);">Estimated Arrival</div>
            <div style="font-size: 18px; font-weight: 800; color: hsl(140, 90%, 65%);" id="track-eta">${data.etaMins > 0 ? `${data.etaMins} mins` : 'Arrived! 🎉'}</div>
          </div>
        </div>
      </div>

      <!-- Real-Time Interactive Radar Container -->
      <div id="gmaps-live-track-container" style="position: relative; height: 260px; background: #0f172a; border-bottom: 1px solid var(--clr-border);">
        <!-- Mounted dynamically with smooth GPS interpolation -->
      </div>

      <!-- Live Telemetry Quick Badges Bar -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; background: rgba(15, 23, 42, 0.85); border-bottom: 1px solid var(--clr-border); padding: 10px 16px; text-align: center; font-size: 12px;">
        <div style="border-right: 1px solid var(--clr-border); padding: 2px;">
          <div style="color: var(--clr-text-muted); font-size: 10px; font-weight: bold; text-transform: uppercase;">Distance Remaining</div>
          <div style="font-weight: 800; color: #fde047; font-size: 14px; margin-top: 2px;" id="track-distance-text">${data.distanceRemainingKm || 0.8} km</div>
        </div>
        <div style="border-right: 1px solid var(--clr-border); padding: 2px;">
          <div style="color: var(--clr-text-muted); font-size: 10px; font-weight: bold; text-transform: uppercase;">Live Speed</div>
          <div style="font-weight: 800; color: #60a5fa; font-size: 14px; margin-top: 2px;" id="track-speed-text">${data.speedKmh || 28} km/h</div>
        </div>
        <div style="padding: 2px;">
          <div style="color: var(--clr-text-muted); font-size: 10px; font-weight: bold; text-transform: uppercase;">Delivery Status</div>
          <div style="font-weight: 800; color: #34d399; font-size: 13px; margin-top: 2px; text-transform: capitalize;" id="track-status-badge">${(data.status || 'On Way').replace(/_/g, ' ')}</div>
        </div>
      </div>

      <!-- Stepper & Driver Info Body -->
      <div style="flex: 1; overflow-y: auto; padding: 18px 22px;">
        <!-- Driver Profile Card -->
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 14px 16px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #2b5876, #4e4376); display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
              🛵
            </div>
            <div>
              <div style="font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                ${driver.name} <span class="badge" style="background: var(--clr-success); color: white; font-size: 11px; padding: 2px 6px;">★ ${driver.rating}</span>
              </div>
              <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 2px;">
                ${driver.vehicle} • 🌡️ Vaccinated & Sanitized
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" id="call-driver-btn" title="Call Delivery Partner" style="padding: 6px 12px; font-size: 12px; border-radius: var(--radius-md);">
              📞 Call
            </button>
            <button class="btn btn-secondary btn-sm" id="chat-driver-btn" title="Chat with Partner" style="padding: 6px 12px; font-size: 12px; border-radius: var(--radius-md);">
              💬 Chat
            </button>
          </div>
        </div>

        <!-- Milestones Stepper -->
        <div style="display: flex; flex-direction: column; gap: 12px; position: relative; padding-left: 8px;">
          ${data.steps.map(step => `
            <div style="display: flex; align-items: center; gap: 14px; opacity: ${step.completed ? '1' : '0.45'};">
              <div style="width: 26px; height: 26px; border-radius: 50%; background: ${step.completed ? 'var(--clr-success)' : 'var(--clr-border)'}; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">
                ${step.completed ? '✓' : step.id + 1}
              </div>
              <div style="flex: 1;">
                <div style="font-weight: bold; font-size: 13px;">${step.label}</div>
                <div style="font-size: 11px; color: var(--clr-text-muted);">${step.time}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Tax Invoice & Delivery Address Footer -->
        <div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--clr-border); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 12px; color: var(--clr-text-muted);">
            📍 Destination: <b>${custLoc.address || 'Doorstep'}</b>
          </div>
          <button class="btn btn-secondary btn-sm" id="view-invoice-btn" style="font-size: 12px; border-radius: var(--radius-md);">
            📄 Invoice
          </button>
        </div>
      </div>
    </div>
  `;

  // Bind close
  trackingModalEl.querySelector('#track-close-btn').addEventListener('click', closeLiveTracking);

  // Call Driver
  trackingModalEl.querySelector('#call-driver-btn')?.addEventListener('click', () => {
    showToast(`Calling ${driver.name} at ${driver.phone}... 📱`, '📞');
  });

  // Chat Driver Simulator
  trackingModalEl.querySelector('#chat-driver-btn')?.addEventListener('click', () => {
    const msg = prompt(`Send a quick message to ${driver.name}:`, 'Please ring the doorbell upon arrival');
    if (msg) {
      showToast(`Sent to ${driver.name}: "${msg}" ✅`, '💬');
    }
  });

  // Mount Real-Time Active Map Radar
  const mapContainer = trackingModalEl.querySelector('#gmaps-live-track-container');
  if (mapContainer) {
    mountActiveGoogleMap(mapContainer, {
      origin: { lat: restLoc.lat, lng: restLoc.lng, label: data.restaurantName },
      destination: { lat: custLoc.lat, lng: custLoc.lng, label: 'Delivery Location' },
      driverPos: { lat: driverLoc.lat, lng: driverLoc.lng, label: 'Delivery Partner' },
      speed: data.speedKmh || 28,
      heading: data.headingDeg || 45,
      distanceRemaining: `${data.distanceRemainingKm || 0.8} km`,
      etaMins: data.etaMins,
      status: data.status,
      waypoints: data.waypoints || [],
      height: '260px'
    });
  }

  // Active Polling Loop (Every 3 seconds) for live vehicle movement & telemetry
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(async () => {
    const updated = await trackOrderLive(currentOrderId);
    if (updated && updated.success) {
      const etaEl = trackingModalEl.querySelector('#track-eta');
      const distEl = trackingModalEl.querySelector('#track-distance-text');
      const spdEl = trackingModalEl.querySelector('#track-speed-text');
      const statusEl = trackingModalEl.querySelector('#track-status-badge');

      if (etaEl) etaEl.textContent = updated.etaMins > 0 ? `${updated.etaMins} mins` : 'Arrived! 🎉';
      if (distEl) distEl.textContent = `${updated.distanceRemainingKm} km`;
      if (spdEl) spdEl.textContent = `${updated.speedKmh} km/h`;
      if (statusEl) statusEl.textContent = (updated.status || '').replace(/_/g, ' ');

      // Check arrival sound
      if (updated.status === 'delivered' && lastStatus !== 'delivered') {
        sounds?.success();
        showToast('🎉 Your food has been delivered to your doorstep! Enjoy your feast!', '🍕', 5000);
      }
      lastStatus = updated.status;
    }
  }, 3000);
}
