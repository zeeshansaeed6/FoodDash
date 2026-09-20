// ============================================================
// FoodDash — Frontend Unified API Client & State Manager
// ============================================================
import { io } from 'socket.io-client';

const API_BASE = '/api';

// Auth State
let currentUser = null;
let authToken = localStorage.getItem('fooddash_token') || null;
let authListeners = [];

export function getAuthToken() {
  return authToken;
}

export function getCurrentUser() {
  return currentUser;
}

export function setAuthState(user, token) {
  currentUser = user;
  authToken = token;
  if (token) {
    localStorage.setItem('fooddash_token', token);
  } else {
    localStorage.removeItem('fooddash_token');
  }
  authListeners.forEach(fn => fn(currentUser));
}

export function onAuthChange(fn) {
  authListeners.push(fn);
  return () => {
    authListeners = authListeners.filter(l => l !== fn);
  };
}

// Check session on startup
export async function checkSession() {
  if (!authToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success && data.user) {
      setAuthState(data.user, authToken);
      return data.user;
    } else {
      setAuthState(null, null);
    }
  } catch (e) {
    console.warn('Session check failed:', e);
  }
  return null;
}

// Common Fetch wrapper with auth header & JSON handling
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { success: false, message: 'Network connection error. Please try again.' };
  }
}

// ----------------- Auth APIs -----------------
export async function sendOtp(phone) {
  return apiRequest('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone })
  });
}

export async function verifyOtp(phone, otp, name) {
  const data = await apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone, otp, name })
  });
  if (data.success && data.token) {
    setAuthState(data.user, data.token);
  }
  return data;
}

export async function loginWithGoogle(profile) {
  const data = await apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify(profile)
  });
  if (data.success && data.token) {
    setAuthState(data.user, data.token);
  }
  return data;
}

export async function loginWithEmail(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (data.success && data.token) {
    setAuthState(data.user, data.token);
  }
  return data;
}

export async function logoutUser() {
  await apiRequest('/auth/logout', { method: 'POST' });
  setAuthState(null, null);
  window.location.reload();
}

// ----------------- Locations APIs -----------------
export async function getPopularCities() {
  return apiRequest('/locations');
}

export async function searchLocations(query) {
  return apiRequest(`/locations/search?q=${encodeURIComponent(query)}`);
}

// ----------------- Restaurants & Menu APIs -----------------
export async function fetchRestaurants(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiRequest(`/restaurants${qs ? '?' + qs : ''}`);
}

export async function fetchRestaurantById(id, location = {}) {
  const qs = new URLSearchParams(location).toString();
  return apiRequest(`/restaurants/${id}${qs ? '?' + qs : ''}`);
}

export async function fetchCategories() {
  return apiRequest('/restaurants/meta/categories');
}

export async function fetchOffers() {
  return apiRequest('/restaurants/meta/offers');
}

// ----------------- User Profile & Address APIs -----------------
export async function updateUserProfile(profileData) {
  const data = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
  if (data.success && data.user) {
    setAuthState(data.user, authToken);
  }
  return data;
}

export async function saveUserAddress(addressData) {
  const data = await apiRequest('/auth/addresses', {
    method: 'POST',
    body: JSON.stringify(addressData)
  });
  if (data.success && currentUser) {
    currentUser.addresses = data.addresses;
    setAuthState({ ...currentUser }, authToken);
  }
  return data;
}

export async function updateUserAddress(id, addressData) {
  const data = await apiRequest(`/auth/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(addressData)
  });
  if (data.success && currentUser) {
    currentUser.addresses = data.addresses;
    setAuthState({ ...currentUser }, authToken);
  }
  return data;
}

export async function deleteUserAddress(id) {
  const data = await apiRequest(`/auth/addresses/${id}`, {
    method: 'DELETE'
  });
  if (data.success && currentUser) {
    currentUser.addresses = data.addresses;
    setAuthState({ ...currentUser }, authToken);
  }
  return data;
}

export async function saveUserSettings(settings) {
  const data = await apiRequest('/auth/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
  if (data.success && currentUser) {
    currentUser.settings = data.settings;
    setAuthState({ ...currentUser }, authToken);
  }
  return data;
}

// ----------------- Orders APIs -----------------
export async function placeOrder(orderPayload) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload)
  });
}

export async function fetchOrderHistory() {
  return apiRequest('/orders');
}

export async function trackOrderLive(orderId) {
  return apiRequest(`/orders/${orderId}/track`);
}

export async function updateDriverGPSLocation(orderId, locationPayload) {
  return apiRequest(`/orders/${orderId}/driver-location`, {
    method: 'PUT',
    body: JSON.stringify(locationPayload)
  });
}

export async function sendDriverDeliveryAction(orderId, action, driverData = {}) {
  return apiRequest(`/orders/${orderId}/delivery-action`, {
    method: 'PUT',
    body: JSON.stringify({ action, ...driverData })
  });
}

// ----------------- Table & Dine-in Reservation APIs -----------------
export async function fetchRestaurantTables(restaurantId, date = '', timeSlot = '') {
  const query = new URLSearchParams();
  if (date) query.set('date', date);
  if (timeSlot) query.set('timeSlot', timeSlot);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/reservations/tables/${restaurantId}${qStr}`);
}

export async function bookTableReservation(reservationPayload) {
  return apiRequest('/reservations/book', {
    method: 'POST',
    body: JSON.stringify(reservationPayload)
  });
}

export async function fetchUserReservations(userId = '', phone = '') {
  const query = new URLSearchParams();
  if (userId) query.set('userId', userId);
  if (phone) query.set('phone', phone);
  const qStr = query.toString() ? `?${query.toString()}` : '';
  return apiRequest(`/reservations/user${qStr}`);
}

export async function fetchRestaurantReservations(restaurantId) {
  return apiRequest(`/reservations/restaurant/${restaurantId}`);
}

export async function cancelTableReservation(reservationId, reason = '') {
  return apiRequest(`/reservations/${reservationId}/cancel`, {
    method: 'PATCH',
    body: JSON.stringify({ reason })
  });
}

export async function updateReservationStatus(reservationId, status, note = '') {
  return apiRequest(`/reservations/${reservationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note })
  });
}

// ----------------- Delivery Partner Fleet APIs -----------------
export async function fetchRegisteredDrivers(city = '') {
  const qs = city ? `?city=${encodeURIComponent(city)}` : '';
  return apiRequest(`/drivers${qs}`);
}

export async function registerDeliveryRider(riderPayload) {
  return apiRequest('/drivers/register', {
    method: 'POST',
    body: JSON.stringify(riderPayload)
  });
}

export async function fetchDriverProfile(driverId) {
  return apiRequest(`/drivers/${driverId}`);
}

export async function updateDriverDutyStatus(driverId, status) {
  return apiRequest(`/drivers/${driverId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
}

export async function recordDriverPayout(driverId, amount = 60) {
  return apiRequest(`/drivers/${driverId}/earnings`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  });
}

// ----------------- Restaurant Partner Operations & Analytics APIs -----------------
export async function registerRestaurant(restaurantPayload) {
  return apiRequest('/restaurants', {
    method: 'POST',
    body: JSON.stringify(restaurantPayload)
  });
}

export async function fetchRestaurantSettings(restaurantId) {
  return apiRequest(`/restaurants/${restaurantId}/settings`);
}

export async function updateRestaurantSettings(restaurantId, settingsPayload) {
  return apiRequest(`/restaurants/${restaurantId}/settings`, {
    method: 'PUT',
    body: JSON.stringify(settingsPayload)
  });
}

export async function toggleMenuItemStock(restaurantId, itemId, isOutOfStock) {
  return apiRequest(`/restaurants/${restaurantId}/stock`, {
    method: 'PUT',
    body: JSON.stringify({ itemId, isOutOfStock })
  });
}

export async function fetchRestaurantAnalytics(restaurantId) {
  return apiRequest(`/restaurants/${restaurantId}/analytics`);
}

// ----------------- AI Food Concierge API -----------------
export async function queryAiFoodConcierge(prompt, location = {}) {
  return apiRequest('/ai/concierge', {
    method: 'POST',
    body: JSON.stringify({
      prompt,
      cityId: location.cityId || 'bangalore',
      cityName: location.cityName || 'Bangalore',
      area: location.area || ''
    })
  });
}

// ----------------- WebSocket Engine -----------------
let socket = null;

export function getSocketConnection() {
  if (!socket) {
    // If running in Vite dev server (port 5173), target backend at port 5000.
    // In production or when served from the backend, connect to window.location.origin
    if (window.location.port === '5173') {
      socket = io(`http://${window.location.hostname}:5000`);
    } else {
      socket = io();
    }
  }
  return socket;
}

// ----------------- Payments API -----------------
export async function createPaymentIntent(paymentPayload) {
  return apiRequest('/payments/intent', {
    method: 'POST',
    body: JSON.stringify(paymentPayload)
  });
}

