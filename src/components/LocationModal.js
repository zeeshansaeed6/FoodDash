// ============================================================
// Location Selector Modal (Real-Time GPS, Map Pin Dropper & Search)
// ============================================================
import { showToast } from './Toast.js';
import { getPopularCities, searchLocations } from '../api/client.js';
import { mountInteractivePinDropper } from '../utils/googleMaps.js';

let activeLocation = {
  cityId: 'bangalore',
  cityName: 'Bangalore',
  area: 'Koramangala 4th Block',
  fullTitle: 'Koramangala 4th Block, Bangalore',
  lat: 12.9352,
  lng: 77.6245
};

export function getActiveDeliveryLocation() {
  return activeLocation;
}

let onLocationChangeCb = null;

export function createLocationModal(onChange) {
  onLocationChangeCb = onChange;
  const overlay = document.createElement('div');
  overlay.className = 'login-overlay';
  overlay.id = 'location-overlay';

  overlay.innerHTML = `
    <div class="location-modal" id="location-modal" style="max-height: 90vh; max-width: 580px; display: flex; flex-direction: column;">
      <button class="login-modal__close" id="location-close-btn" aria-label="Close location picker">✕</button>
      
      <div style="margin-bottom: 10px;">
        <h2 style="font-family: var(--ff-heading); font-size: var(--fs-xl); font-weight: var(--fw-bold); margin-bottom: 2px;">
          Set Real-Time Delivery Location
        </h2>
        <p style="font-size: var(--fs-xs); color: var(--clr-text-muted);">
          Detect live GPS, drag map pin, or search any city worldwide
        </p>
      </div>

      <!-- Real-Time GPS Detection Action -->
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <button id="gps-detect-btn" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 14px; background: rgba(0, 230, 118, 0.14); border: 1.5px solid var(--clr-success); border-radius: var(--radius-md); color: hsl(140, 90%, 65%); font-weight: bold; font-size: 13px; cursor: pointer; transition: transform 0.2s;">
          <span style="font-size: 16px;">🎯</span> Detect Live GPS Location
        </button>
        <button id="toggle-map-pin-btn" class="btn btn-secondary btn-sm" style="font-size: 12px; white-space: nowrap; border-radius: var(--radius-md);">
          🗺️ Pin on Map
        </button>
      </div>

      <!-- Interactive Pin Dropper Map Container -->
      <div id="pindrop-map-wrapper" style="margin-bottom: 12px; display: block;">
        <!-- Mounted dynamically -->
      </div>

      <div style="position: relative; margin-bottom: 12px;">
        <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--clr-text-muted);">🔍</span>
        <input
          type="text"
          id="location-search-input"
          placeholder="Search street, area, city (e.g. 'KPHB Hyderabad', 'Indiranagar')..."
          class="login-modal__input"
          style="width: 100%; padding-left: 36px; font-size: 13px;"
          autocomplete="off"
        />
      </div>

      <div style="display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none;" id="city-pills">
        <button class="filter-chip active" data-city="all">All Cities</button>
        <button class="filter-chip" data-city="bangalore">Bangalore</button>
        <button class="filter-chip" data-city="mumbai">Mumbai</button>
        <button class="filter-chip" data-city="delhi">Delhi NCR</button>
        <button class="filter-chip" data-city="hyderabad">Hyderabad</button>
        <button class="filter-chip" data-city="pune">Pune</button>
        <button class="filter-chip" data-city="chennai">Chennai</button>
        <button class="filter-chip" data-city="kolkata">Kolkata</button>
      </div>

      <div id="location-results-container" style="flex: 1; overflow-y: auto; padding-right: 4px; max-height: 220px;">
        <div id="location-list">
          <div style="font-size: 11px; font-weight: bold; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 6px;">
            Popular Locations & Neighborhoods
          </div>
          <!-- Loaded dynamically -->
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close bindings
  overlay.querySelector('#location-close-btn').addEventListener('click', closeLocationModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLocationModal();
  });

  const searchInput = overlay.querySelector('#location-search-input');
  const resultsList = overlay.querySelector('#location-list');
  const gpsBtn = overlay.querySelector('#gps-detect-btn');
  const toggleMapBtn = overlay.querySelector('#toggle-map-pin-btn');
  const mapWrapper = overlay.querySelector('#pindrop-map-wrapper');
  let searchDebounce;

  // Mount Pin Dropper
  mountInteractivePinDropper(mapWrapper, {
    initialPos: { lat: activeLocation.lat || 12.9716, lng: activeLocation.lng || 77.5946, address: activeLocation.fullTitle },
    onPinChange: async (coords) => {
      activeLocation.lat = coords.lat;
      activeLocation.lng = coords.lng;
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`);
        const data = await res.json();
        if (data && data.address) {
          const city = data.address.city || data.address.state_district || data.address.town || 'Nearby';
          const area = data.address.suburb || data.address.neighbourhood || data.address.road || city;
          activeLocation.area = area;
          activeLocation.cityName = city;
          activeLocation.fullTitle = `${area}, ${city}`;
        }
      } catch (e) {}
    }
  });

  toggleMapBtn.addEventListener('click', () => {
    const isHidden = mapWrapper.style.display === 'none';
    mapWrapper.style.display = isHidden ? 'block' : 'none';
    toggleMapBtn.textContent = isHidden ? '🗺️ Hide Map' : '🗺️ Pin on Map';
  });

  // Real-Time GPS Geolocation & Reverse Geocoding
  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', '⚠️');
      return;
    }

    gpsBtn.disabled = true;
    gpsBtn.innerHTML = `<span>🛰️</span> Locking GPS coordinates...`;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        activeLocation.lat = latitude;
        activeLocation.lng = longitude;

        try {
          // Query OpenStreetMap Nominatim reverse geocoder
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();

          const city = data.address.city || data.address.state_district || data.address.town || data.address.village || 'My Location';
          const area = data.address.suburb || data.address.neighbourhood || data.address.road || city;
          const fullTitle = `${area}, ${city}`;

          setLocation({
            cityId: city.toLowerCase().replace(/\s+/g, '_'),
            cityName: city,
            area: area,
            fullTitle: fullTitle,
            lat: latitude,
            lng: longitude
          });
          showToast(`📍 Real-Time GPS Locked: ${fullTitle}`, '✅', 4000);
        } catch (e) {
          // Fallback to coordinates
          const fallbackTitle = `GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
          setLocation({
            cityId: 'gps_loc',
            cityName: 'Current Location',
            area: '',
            fullTitle: fallbackTitle,
            lat: latitude,
            lng: longitude
          });
          showToast(`📍 Located at ${fallbackTitle}`, '✅');
        } finally {
          gpsBtn.disabled = false;
          gpsBtn.innerHTML = `<span style="font-size: 16px;">🎯</span> Detect Live GPS Location`;
        }
      },
      (error) => {
        gpsBtn.disabled = false;
        gpsBtn.innerHTML = `<span style="font-size: 16px;">🎯</span> Detect Live GPS Location`;
        showToast('Could not lock GPS. Please pick a city or tap the map.', '⚠️');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });

  // Load initial cities & areas
  async function loadPopularLocations(cityFilter = null) {
    const res = await getPopularCities();
    if (!res.success || !res.cities) return;

    let items = [];
    res.cities.forEach(city => {
      if (!cityFilter || city.id === cityFilter) {
        city.areas.forEach(area => {
          items.push({
            cityId: city.id,
            cityName: city.name,
            area: area,
            title: `${area}, ${city.name}`,
            subtitle: `${city.state}, ${city.country}`
          });
        });
      }
    });

    renderLocationItems(items);
  }

  function renderLocationItems(items) {
    if (items.length === 0) {
      resultsList.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--clr-text-muted);">
          No locations found. Press enter to deliver to custom address.
        </div>
      `;
      return;
    }

    resultsList.innerHTML = items.map(item => `
      <div class="location-item ${item.title === activeLocation.fullTitle ? 'active' : ''}" 
           data-cityid="${item.cityId || 'custom'}"
           data-cityname="${item.cityName || item.title}"
           data-area="${item.area || ''}"
           data-title="${item.title}">
        <span class="location-item__icon">📍</span>
        <div>
          <div class="location-item__title">${item.title}</div>
          <div class="location-item__desc">${item.subtitle || 'Delivery Available'}</div>
        </div>
      </div>
    `).join('');

    resultsList.querySelectorAll('.location-item').forEach(item => {
      item.addEventListener('click', () => {
        const loc = {
          cityId: item.dataset.cityid,
          cityName: item.dataset.cityname,
          area: item.dataset.area,
          fullTitle: item.dataset.title
        };
        setLocation(loc);
      });
    });
  }

  function setLocation(loc) {
    activeLocation = loc;
    if (onLocationChangeCb) onLocationChangeCb(activeLocation);
    showToast(`Delivering to ${loc.fullTitle}`, '📍', 3000);
    closeLocationModal();
  }

  // Live location search input
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(async () => {
      const q = searchInput.value.trim();
      if (!q) {
        loadPopularLocations();
        return;
      }

      const res = await searchLocations(q);
      if (res.success && res.results) {
        renderLocationItems(res.results);
      }
    }, 200);
  });

  // Enter to set custom location
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) {
        const capitalized = q.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        setLocation({
          cityId: 'custom',
          cityName: capitalized,
          area: '',
          fullTitle: capitalized
        });
      }
    }
  });

  // City filter chips
  overlay.querySelectorAll('#city-pills .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      overlay.querySelectorAll('#city-pills .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const city = chip.dataset.city === 'all' ? null : chip.dataset.city;
      loadPopularLocations(city);
    });
  });

  loadPopularLocations();
}

export function openLocationModal() {
  const overlay = document.getElementById('location-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('#location-search-input')?.focus();
  }
}

export function closeLocationModal() {
  const overlay = document.getElementById('location-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function getActiveLocation() {
  return activeLocation;
}
