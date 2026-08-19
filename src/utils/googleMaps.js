// ============================================================
// FoodDash — Real-Time GPS & Live Map Platform Engine
// ============================================================
import { Loader } from '@googlemaps/js-api-loader';
import { showToast } from '../components/Toast.js';

let googleMapsLoaded = false;
let googleMapsPromise = null;

// Retrieve user's configured Google Maps API Key or fallback
export function getGoogleMapsApiKey() {
  return localStorage.getItem('fooddash_google_maps_key') || '';
}

export function setGoogleMapsApiKey(key) {
  if (key) {
    localStorage.setItem('fooddash_google_maps_key', key.trim());
  } else {
    localStorage.removeItem('fooddash_google_maps_key');
  }
}

export function openGoogleMapsKeyModal() {
  const existing = document.getElementById('gmaps-key-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'login-overlay active';
  overlay.id = 'gmaps-key-modal-overlay';

  const currentKey = getGoogleMapsApiKey();

  overlay.innerHTML = `
    <div class="login-modal" style="max-width: 480px; padding: 24px;">
      <button class="login-modal__close" id="gmaps-key-close">✕</button>
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; font-size: 22px;">
          🗺️
        </div>
        <div>
          <h3 style="font-size: 18px; font-weight: 800; margin: 0; color: white;">Google Maps Configuration</h3>
          <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0;">Connect your official Maps API Key or use built-in Live GPS Radar</p>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Google Maps JavaScript API Key</label>
        <input type="text" id="gmaps-key-input" placeholder="AIzaSy..." value="${currentKey}" class="login-modal__input" style="width: 100%; font-family: monospace; font-size: 13px;" />
        <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 6px;">
          💡 When empty, FoodDash automatically switches to the built-in <b>High-Tech Real-Time Radar Map</b> with live speed and moving rider telemetry.
        </div>
      </div>

      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn btn-secondary btn-sm" id="gmaps-key-clear">Clear Key</button>
        <button class="btn btn-primary btn-sm" id="gmaps-key-save">Save & Reload Map</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#gmaps-key-close').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#gmaps-key-clear').addEventListener('click', () => {
    setGoogleMapsApiKey('');
    overlay.remove();
    showToast('Switched to built-in High-Tech Live Radar Map 🛰️', 'ℹ️');
  });

  overlay.querySelector('#gmaps-key-save').addEventListener('click', () => {
    const val = overlay.querySelector('#gmaps-key-input').value;
    setGoogleMapsApiKey(val);
    overlay.remove();
    showToast('Google Maps settings updated successfully! 🗺️', '✅');
  });
}

// Load Google Maps JavaScript API
export async function loadGoogleMapsApi() {
  if (googleMapsLoaded && window.google && window.google.maps) {
    return window.google.maps;
  }

  if (googleMapsPromise) return googleMapsPromise;

  const apiKey = getGoogleMapsApiKey();

  googleMapsPromise = (async () => {
    try {
      const loader = new Loader({
        apiKey: apiKey || 'AIzaSyDemoKeyMockForPrototypingOnly',
        version: 'weekly',
        libraries: ['maps', 'marker', 'geometry']
      });

      const google = await loader.load();
      googleMapsLoaded = true;
      return google.maps;
    } catch (err) {
      console.warn('Google Maps JS API load notice:', err);
      return null;
    }
  })();

  return googleMapsPromise;
}

// --------------------------------------------------------------------------
// 1. MOUNT ACTIVE REAL-TIME DELIVERY GPS RADAR
// --------------------------------------------------------------------------
export async function mountActiveGoogleMap(container, {
  origin = { lat: 12.9352, lng: 77.6245, label: 'Restaurant' },
  destination = { lat: 12.9279, lng: 77.6271, label: 'Customer Doorstep' },
  driverPos = { lat: 12.9315, lng: 77.6258, label: 'Valet' },
  speed = 28,
  heading = 45,
  distanceRemaining = '1.2 km',
  etaMins = 8,
  status = 'out_for_delivery',
  waypoints = [],
  zoom = 15,
  showControls = true,
  height = '260px'
} = {}) {
  container.style.position = 'relative';
  container.style.height = height;
  container.style.width = '100%';
  container.style.borderRadius = '16px';
  container.style.overflow = 'hidden';
  container.style.background = '#0d1117';

  // Check if official Google Maps API is initialized
  const maps = await loadGoogleMapsApi();

  if (maps && window.google && window.google.maps && window.google.maps.Map) {
    try {
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      container.innerHTML = '';
      container.appendChild(mapDiv);

      const map = new maps.Map(mapDiv, {
        center: driverPos,
        zoom: zoom,
        disableDefaultUI: !showControls,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
        ]
      });

      new maps.Marker({
        position: origin,
        map,
        title: origin.label,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' }
      });

      new maps.Marker({
        position: destination,
        map,
        title: destination.label,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png' }
      });

      const driverMarker = new maps.Marker({
        position: driverPos,
        map,
        title: 'Delivery Partner (Live GPS)',
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' }
      });

      const routePath = new maps.Polyline({
        path: waypoints.length > 0 ? waypoints : [origin, driverPos, destination],
        geodesic: true,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.9,
        strokeWeight: 4
      });
      routePath.setMap(map);

      return { map, driverMarker, routePath, maps };
    } catch (e) {
      console.warn('Fallback to High-Tech Real-Time Radar Map View:', e);
    }
  }

  // Render High-Tech Real-Time GPS Radar Canvas & Telemetry HUD
  renderHighTechRadarView(container, {
    origin,
    destination,
    driverPos,
    speed,
    heading,
    distanceRemaining,
    etaMins,
    status,
    waypoints
  });
}

function renderHighTechRadarView(container, data) {
  const { origin, destination, driverPos, speed, heading, distanceRemaining, etaMins, status } = data;
  const gmapsDirUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;

  // Calculate relative map coordinates (normalized % inside container box)
  const minLat = Math.min(origin.lat, destination.lat, driverPos.lat) - 0.003;
  const maxLat = Math.max(origin.lat, destination.lat, driverPos.lat) + 0.003;
  const minLng = Math.min(origin.lng, destination.lng, driverPos.lng) - 0.003;
  const maxLng = Math.max(origin.lng, destination.lng, driverPos.lng) + 0.003;

  const latSpan = Math.max(0.001, maxLat - minLat);
  const lngSpan = Math.max(0.001, maxLng - minLng);

  const toX = (lng) => Math.min(90, Math.max(10, ((lng - minLng) / lngSpan) * 100));
  const toY = (lat) => Math.min(85, Math.max(15, (1 - ((lat - minLat) / latSpan)) * 100));

  const origX = toX(origin.lng);
  const origY = toY(origin.lat);
  const destX = toX(destination.lng);
  const destY = toY(destination.lat);
  const drivX = toX(driverPos.lng);
  const drivY = toY(driverPos.lat);

  // Generate smooth curved road path SVG
  const midX1 = origX + (destX - origX) * 0.35 + 8;
  const midY1 = origY + (destY - origY) * 0.25 - 6;
  const midX2 = origX + (destX - origX) * 0.7 - 6;
  const midY2 = origY + (destY - origY) * 0.75 + 8;
  const pathD = `M ${origX} ${origY} C ${midX1} ${midY1}, ${midX2} ${midY2}, ${destX} ${destY}`;

  container.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%; background: radial-gradient(circle at center, #111827 0%, #030712 100%); overflow: hidden; font-family: sans-serif; user-select: none;">
      <!-- Grid Radar Overlay Background -->
      <div style="position: absolute; inset: 0; background-size: 28px 28px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);"></div>

      <!-- Radar Pulse Rings from Driver -->
      <div style="position: absolute; left: ${drivX}%; top: ${drivY}%; transform: translate(-50%, -50%); width: 140px; height: 140px; border-radius: 50%; border: 1.5px solid rgba(59, 130, 246, 0.3); animation: radarPulse 2.5s infinite ease-out; pointer-events: none;"></div>
      <div style="position: absolute; left: ${drivX}%; top: ${drivY}%; transform: translate(-50%, -50%); width: 70px; height: 70px; border-radius: 50%; border: 1.5px solid rgba(59, 130, 246, 0.5); pointer-events: none;"></div>

      <!-- Road Path SVG -->
      <svg style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;">
        <!-- Base Road Track -->
        <path d="${pathD}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6" stroke-linecap="round" />
        <!-- Glowing Active Path -->
        <path d="${pathD}" fill="none" stroke="url(#roadGlow)" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="6, 4" style="animation: dashFlow 1s linear infinite;" />
        <defs>
          <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f59e0b" />
            <stop offset="50%" stop-color="#3b82f6" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Restaurant Marker -->
      <div style="position: absolute; left: ${origX}%; top: ${origY}%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; z-index: 5;">
        <div style="background: #ef4444; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 14px rgba(239,68,68,0.7); border: 2px solid white;">
          🍳
        </div>
        <div style="background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); color: #fca5a5; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-top: 3px; white-space: nowrap; border: 1px solid rgba(239,68,68,0.3);">
          ${origin.label || 'Restaurant'}
        </div>
      </div>

      <!-- Customer Doorstep Marker -->
      <div style="position: absolute; left: ${destX}%; top: ${destY}%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; z-index: 5;">
        <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 14px rgba(16,185,129,0.7); border: 2px solid white;">
          🏠
        </div>
        <div style="background: rgba(15,23,42,0.85); backdrop-filter: blur(4px); color: #6ee7b7; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-top: 3px; white-space: nowrap; border: 1px solid rgba(16,185,129,0.3);">
          ${destination.label || 'Delivery Doorstep'}
        </div>
      </div>

      <!-- Live Delivery Rider / Valet Marker with Heading -->
      <div id="live-moving-rider-marker" style="position: absolute; left: ${drivX}%; top: ${drivY}%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; z-index: 10; transition: left 0.8s ease-out, top 0.8s ease-out;">
        <div style="position: relative; width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 18px rgba(37,99,235,0.9); border: 2.5px solid white;">
          <span style="font-size: 20px; transform: rotate(${heading || 45}deg); transition: transform 0.4s ease;">🛵</span>
        </div>
        <div style="background: #2563eb; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 99px; margin-top: 4px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: blink 1s infinite;"></span>
          <span>Valet Live GPS</span>
        </div>
      </div>

      <!-- Top HUD Telemetry Bar -->
      <div style="position: absolute; top: 10px; left: 12px; right: 12px; display: flex; justify-content: space-between; align-items: center; z-index: 15;">
        <div style="display: flex; gap: 6px;">
          <div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; padding: 5px 12px; font-size: 11px; font-weight: 700; color: white; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e;"></span>
            <span>Live GPS Stream</span>
          </div>
          <div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; padding: 5px 10px; font-size: 11px; font-weight: 700; color: #93c5fd; display: flex; align-items: center; gap: 4px;">
            ⚡ ${speed || 28} km/h
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; padding: 5px 12px; font-size: 11px; font-weight: 700; color: #fde047;">
          📍 ${distanceRemaining || '1.1 km'} away
        </div>
      </div>

      <!-- Bottom HUD Quick Action Buttons -->
      <div style="position: absolute; bottom: 10px; right: 12px; display: flex; gap: 6px; z-index: 15;">
        <button id="btn-recenter-rider" style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(255,255,255,0.2); border-radius: 99px; padding: 5px 10px; color: white; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
          🛵 Center Rider
        </button>
        <a href="${gmapsDirUrl}" target="_blank" rel="noopener noreferrer" style="background: #2563eb; border: 1px solid #3b82f6; border-radius: 99px; padding: 5px 12px; color: white; font-size: 11px; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 4px;">
          🧭 Google Maps ↗
        </a>
      </div>
    </div>
  `;

  // Recenter rider click
  container.querySelector('#btn-recenter-rider')?.addEventListener('click', () => {
    const marker = container.querySelector('#live-moving-rider-marker');
    if (marker) {
      marker.style.transform = 'translate(-50%, -50%) scale(1.3)';
      setTimeout(() => { marker.style.transform = 'translate(-50%, -50%) scale(1)'; }, 300);
      showToast('Centered on Rider Live GPS 🛵', '📍');
    }
  });
}

// --------------------------------------------------------------------------
// 2. MOUNT INTERACTIVE REAL-TIME PIN DROPPER MAP
// --------------------------------------------------------------------------
export function mountInteractivePinDropper(container, {
  initialPos = { lat: 12.9716, lng: 77.5946, address: 'Bangalore' },
  onPinChange = null
} = {}) {
  container.innerHTML = `
    <div style="position: relative; width: 100%; height: 210px; border-radius: 12px; overflow: hidden; background: #0f172a; border: 1.5px solid var(--clr-border);">
      <!-- Interactive Grid Surface -->
      <div id="pindrop-surface" style="position: absolute; inset: 0; cursor: crosshair; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%); background-size: 24px 24px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);">
      </div>

      <!-- Center Dropped Pin -->
      <div id="pindrop-marker" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -100%); pointer-events: none; display: flex; flex-direction: column; align-items: center; transition: left 0.2s, top 0.2s; z-index: 10;">
        <div style="background: #ef4444; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(239,68,68,0.8); border: 2px solid white;">
          <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
        </div>
        <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.5); border-radius: 50%; margin-top: 4px; filter: blur(1px);"></div>
      </div>

      <!-- Instructions Pill -->
      <div style="position: absolute; top: 10px; left: 10px; z-index: 15; background: rgba(15,23,42,0.85); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: white; display: flex; align-items: center; gap: 6px;">
        <span>🎯 Click / Drag map to pinpoint your exact gate or doorstep</span>
      </div>

      <!-- Coordinates Bar -->
      <div id="pindrop-coords-bar" style="position: absolute; bottom: 8px; left: 10px; right: 10px; z-index: 15; background: rgba(15,23,42,0.9); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 12px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;">
        <span id="pindrop-coords-text">Lat: ${initialPos.lat.toFixed(4)}, Lng: ${initialPos.lng.toFixed(4)}</span>
        <span style="color: #10b981; font-weight: bold;">✓ Precise Doorstep GPS</span>
      </div>
    </div>
  `;

  const surface = container.querySelector('#pindrop-surface');
  const marker = container.querySelector('#pindrop-marker');
  const coordsText = container.querySelector('#pindrop-coords-text');

  let currentLat = initialPos.lat;
  let currentLng = initialPos.lng;

  const updatePinPos = (clientX, clientY) => {
    const rect = surface.getBoundingClientRect();
    const x = Math.max(10, Math.min(rect.width - 10, clientX - rect.left));
    const y = Math.max(15, Math.min(rect.height - 15, clientY - rect.top));

    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;

    // Map pixel offset to small delta in lat/lng (~50-200m)
    const latOffset = ((rect.height / 2) - y) * 0.00015;
    const lngOffset = (x - (rect.width / 2)) * 0.00015;
    currentLat = Number((initialPos.lat + latOffset).toFixed(6));
    currentLng = Number((initialPos.lng + lngOffset).toFixed(6));

    coordsText.textContent = `Lat: ${currentLat.toFixed(4)}, Lng: ${currentLng.toFixed(4)}`;

    if (onPinChange) {
      onPinChange({ lat: currentLat, lng: currentLng });
    }
  };

  let isDragging = false;
  surface.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePinPos(e.clientX, e.clientY);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) updatePinPos(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  surface.addEventListener('click', (e) => {
    updatePinPos(e.clientX, e.clientY);
  });
}
