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
          <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0;">Connect your official Maps API Key to unlock real Satellite Maps</p>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Google Maps JavaScript API Key</label>
        <input type="text" id="gmaps-key-input" placeholder="AIzaSy..." value="${currentKey}" class="login-modal__input" style="width: 100%; font-family: monospace; font-size: 13px;" />
        <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 6px;">
          💡 When empty, FoodDash automatically switches to the built-in <b>Offline Radar Map</b>.
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
    showToast('Switched to built-in Offline Map 🛰️', 'ℹ️');
  });

  overlay.querySelector('#gmaps-key-save').addEventListener('click', () => {
    const val = overlay.querySelector('#gmaps-key-input').value;
    setGoogleMapsApiKey(val);
    overlay.remove();
    showToast('Google Maps settings updated! Reloading...', '✅');
    setTimeout(() => {
      window.location.reload();
    }, 800);
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
        apiKey: apiKey || 'AIzaSyDVjACMifeJ1LLqDSKNA2qXocm16tqbgnQ', // Fallback key
        version: 'weekly',
        libraries: ['maps', 'marker', 'geometry', 'places']
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
        mapTypeId: 'hybrid', // Real Satellite + Labels
        disableDefaultUI: !showControls,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
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

      const directionsService = new maps.DirectionsService();
      const directionsRenderer = new maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeOpacity: 0.9,
          strokeWeight: 5
        }
      });
      
      directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: maps.TravelMode.DRIVING
      }, (response, status) => {
        if (status === 'OK') {
          directionsRenderer.setDirections(response);
        } else {
          const routePath = new maps.Polyline({
            path: waypoints.length > 0 ? waypoints : [origin, driverPos, destination],
            geodesic: true,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.9,
            strokeWeight: 4,
            map: map
          });
        }
      });

      return { map, driverMarker, routePath, maps };
    } catch (e) {
      console.warn('Fallback to High-Tech Real-Time Radar Map View:', e);
    }
  }

  // Fallback radar UI
  renderHighTechRadarView(container, {
    origin, destination, driverPos, speed, heading, distanceRemaining, etaMins, status, waypoints
  });
}

// --------------------------------------------------------------------------
// 2. MOUNT INTERACTIVE REAL-TIME PIN DROPPER MAP
// --------------------------------------------------------------------------
export async function mountInteractivePinDropper(container, {
  initialPos = { lat: 12.9716, lng: 77.5946, address: 'Bangalore' },
  onPinChange = null
} = {}) {
  container.style.position = 'relative';
  container.style.width = '100%';
  container.style.height = '210px';
  container.style.borderRadius = '12px';
  container.style.overflow = 'hidden';
  container.style.background = '#0f172a';
  container.style.border = '1.5px solid var(--clr-border)';

  const maps = await loadGoogleMapsApi();

  if (maps && window.google && window.google.maps && window.google.maps.Map) {
    try {
      const mapDiv = document.createElement('div');
      mapDiv.style.width = '100%';
      mapDiv.style.height = '100%';
      container.innerHTML = '';
      container.appendChild(mapDiv);

      const map = new maps.Map(mapDiv, {
        center: initialPos,
        zoom: 18,
        mapTypeId: 'hybrid', // Real satellite map for accurate pin dropping
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'greedy'
      });

      // Fixed center crosshair pin overlay
      const pill = document.createElement('div');
      pill.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: 15; background: rgba(15,23,42,0.85); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: white; display: flex; align-items: center; gap: 6px;';
      pill.innerHTML = '<span>🎯 Drag the map to pinpoint your exact gate</span>';
      container.appendChild(pill);
      
      const centerPin = document.createElement('div');
      centerPin.innerHTML = `
        <div style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -100%); pointer-events: none; display: flex; flex-direction: column; align-items: center; z-index: 10;">
          <div style="background: #ef4444; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(239,68,68,0.8); border: 2px solid white;">
            <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
          </div>
          <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.5); border-radius: 50%; margin-top: 4px; filter: blur(1px);"></div>
        </div>
      `;
      container.appendChild(centerPin);

      // Coordinates Bar
      const coordsBar = document.createElement('div');
      coordsBar.style.cssText = 'position: absolute; bottom: 8px; left: 10px; right: 10px; z-index: 15; background: rgba(15,23,42,0.9); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 6px 12px; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center;';
      coordsBar.innerHTML = `
        <span id="gmaps-coords-text">Lat: ${initialPos.lat.toFixed(4)}, Lng: ${initialPos.lng.toFixed(4)}</span>
        <span style="color: #10b981; font-weight: bold;">✓ Precise Doorstep GPS</span>
      `;
      container.appendChild(coordsBar);

      const updateCoords = () => {
        const center = map.getCenter();
        const lat = center.lat();
        const lng = center.lng();
        container.querySelector('#gmaps-coords-text').textContent = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
        if (onPinChange) {
          onPinChange({ lat, lng });
        }
      };

      map.addListener('drag', updateCoords);
      map.addListener('dragend', updateCoords);
      map.addListener('zoom_changed', updateCoords);

      return { map };
    } catch (e) {
      console.warn('Fallback to Interactive Grid Pin Dropper:', e);
    }
  }

  renderFallbackPinDropper(container, initialPos, onPinChange);
}

export async function loadLeafletFallback() {
  if (window.L) return window.L;
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function renderHighTechRadarView(container, data) {
  const { origin, destination, driverPos, speed, heading, distanceRemaining, waypoints } = data;
  container.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#1e293b; color:white;">Loading Map...</div>';
  
  try {
    const L = await loadLeafletFallback();
    container.innerHTML = '';
    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    container.appendChild(mapDiv);

    const map = L.map(mapDiv, { zoomControl: false, attributionControl: false }).setView([driverPos.lat, driverPos.lng], 16);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map);

    const createIcon = (emoji, color) => L.divIcon({
      html: `<div style="background: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 0 14px ${color}; border: 2px solid white;">${emoji}</div>`,
      className: '', iconSize: [30, 30], iconAnchor: [15, 15]
    });

    const driverIcon = L.divIcon({
      html: `<div style="position: relative; width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 18px rgba(37,99,235,0.9); border: 2.5px solid white; transform: rotate(${heading}deg);"><span style="font-size: 20px;">🛵</span></div>`,
      className: '', iconSize: [42, 42], iconAnchor: [21, 21]
    });

    L.marker([origin.lat, origin.lng], { icon: createIcon('🍳', '#ef4444') }).addTo(map);
    L.marker([destination.lat, destination.lng], { icon: createIcon('🏠', '#10b981') }).addTo(map);
    const driverMarker = L.marker([driverPos.lat, driverPos.lng], { icon: driverIcon }).addTo(map);

    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
      const osrmRes = await fetch(osrmUrl);
      const osrmData = await osrmRes.json();
      if (osrmData.routes && osrmData.routes.length > 0) {
        const coords = osrmData.routes[0].geometry.coordinates;
        const osrmLatLngs = coords.map(c => [c[1], c[0]]); // convert [lng, lat] to [lat, lng]
        L.polyline(osrmLatLngs, { color: '#3b82f6', weight: 5 }).addTo(map);
      } else {
        throw new Error('No OSRM route found');
      }
    } catch (routeErr) {
      console.warn('Fallback to straight line routing:', routeErr);
      const routeLatLngs = waypoints && waypoints.length > 0 ? waypoints.map(wp => [wp.lat, wp.lng]) : [[origin.lat, origin.lng], [driverPos.lat, driverPos.lng], [destination.lat, destination.lng]];
      L.polyline(routeLatLngs, { color: '#3b82f6', weight: 4, dashArray: '8, 6' }).addTo(map);
    }
    
    map.fitBounds(L.latLngBounds([ [origin.lat, origin.lng], [destination.lat, destination.lng] ]), { padding: [30, 30] });

    // Store in a global variable for socket updates
    window._activeLeafletDriverMarker = driverMarker;
    window._activeLeafletMap = map;

  } catch (err) {
    container.innerHTML = '<div style="color:white; padding: 20px;">Map could not be loaded.</div>';
  }
}

async function renderFallbackPinDropper(container, initialPos, onPinChange) {
  container.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#1e293b; color:white;">Loading Satellite Map...</div>';
  
  try {
    const L = await loadLeafletFallback();
    container.innerHTML = '';
    const mapDiv = document.createElement('div');
    mapDiv.style.width = '100%';
    mapDiv.style.height = '100%';
    mapDiv.style.cursor = 'crosshair';
    container.appendChild(mapDiv);

    const map = L.map(mapDiv, { zoomControl: false, attributionControl: false }).setView([initialPos.lat, initialPos.lng], 18);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map);

    const crosshair = document.createElement('div');
    crosshair.style.cssText = 'position: absolute; left: 50%; top: 50%; transform: translate(-50%, -100%); pointer-events: none; display: flex; flex-direction: column; align-items: center; z-index: 1000;';
    crosshair.innerHTML = `<div style="background: #ef4444; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(239,68,68,0.8); border: 2px solid white;"><span style="transform: rotate(45deg); font-size: 16px;">📍</span></div>`;
    container.appendChild(crosshair);

    const updateCoords = () => {
      const center = map.getCenter();
      if (onPinChange) onPinChange({ lat: center.lat, lng: center.lng });
    };

    map.on('move', updateCoords);
    map.on('moveend', updateCoords);
    
    // Allow external panning
    window._activeLeafletPinDropperMap = map;
  } catch (e) {
    container.innerHTML = '<div style="color:white; padding: 20px;">Failed to load map fallback.</div>';
  }
}

