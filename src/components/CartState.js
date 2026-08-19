// ============================================================
// Cart State Manager (with Customizations, DashCoins & Groups)
// ============================================================

const CART_KEY = 'fooddash_cart';
const COINS_KEY = 'fooddash_dashcoins';
const GROUP_KEY = 'fooddash_group_session';

let cart = loadCart();
let dashCoins = loadDashCoins();
let groupSession = loadGroupSession();
let deliverySchedule = { mode: 'asap', date: 'Today', timeSlot: '25-35 mins (Express)' };
let listeners = [];
let coinsListeners = [];
let groupListeners = [];

function loadCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : { restaurantId: null, restaurantName: '', items: [] };
  } catch {
    return { restaurantId: null, restaurantName: '', items: [] };
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  listeners.forEach(fn => fn(cart));
}

function loadDashCoins() {
  try {
    const data = localStorage.getItem(COINS_KEY);
    return data !== null ? parseInt(data, 10) : 250; // Starting bonus 250 coins (₹125)
  } catch {
    return 250;
  }
}

export function getDashCoins() {
  return dashCoins;
}

export function addDashCoins(amount) {
  dashCoins += amount;
  localStorage.setItem(COINS_KEY, dashCoins.toString());
  coinsListeners.forEach(fn => fn(dashCoins));
  return dashCoins;
}

export function spendDashCoins(amount) {
  dashCoins = Math.max(0, dashCoins - amount);
  localStorage.setItem(COINS_KEY, dashCoins.toString());
  coinsListeners.forEach(fn => fn(dashCoins));
  return dashCoins;
}

export function onCoinsChange(fn) {
  coinsListeners.push(fn);
  return () => {
    coinsListeners = coinsListeners.filter(l => l !== fn);
  };
}

// Group Order State
function loadGroupSession() {
  try {
    const data = localStorage.getItem(GROUP_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function getGroupSession() {
  return groupSession;
}

export function startGroupSession(roomName, hostName, splitMode = 'itemized') {
  const code = 'FD-' + Math.floor(1000 + Math.random() * 9000);
  groupSession = {
    code,
    roomName: roomName || 'Foodie Squad Feast',
    hostName: hostName || 'You (Host)',
    splitMode, // 'itemized' or 'equal'
    participants: [hostName || 'You (Host)'],
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(GROUP_KEY, JSON.stringify(groupSession));
  groupListeners.forEach(fn => fn(groupSession));
  return groupSession;
}

export function addGroupParticipant(name) {
  if (!groupSession) return;
  if (!groupSession.participants.includes(name)) {
    groupSession.participants.push(name);
    localStorage.setItem(GROUP_KEY, JSON.stringify(groupSession));
    groupListeners.forEach(fn => fn(groupSession));
  }
  return groupSession;
}

export function leaveGroupSession() {
  groupSession = null;
  localStorage.removeItem(GROUP_KEY);
  groupListeners.forEach(fn => fn(null));
}

export function onGroupChange(fn) {
  groupListeners.push(fn);
  return () => {
    groupListeners = groupListeners.filter(l => l !== fn);
  };
}

// Delivery Schedule
export function getDeliverySchedule() {
  return deliverySchedule;
}

export function setDeliverySchedule(schedule) {
  deliverySchedule = { ...deliverySchedule, ...schedule };
}

// Cart Core
export function getCart() {
  return cart;
}

export function getCartCount() {
  return cart.items.reduce((sum, item) => sum + item.qty, 0);
}

export function getCartTotal() {
  return cart.items.reduce((sum, item) => sum + (item.unitPrice || item.price) * item.qty, 0);
}

export function getCartMacros() {
  return cart.items.reduce(
    (acc, item) => {
      const macros = item.macros || { calories: 350, protein: 12, carbs: 45, fats: 14 };
      acc.calories += (macros.calories || 350) * item.qty;
      acc.protein += (macros.protein || 12) * item.qty;
      acc.carbs += (macros.carbs || 45) * item.qty;
      acc.fats += (macros.fats || 14) * item.qty;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );
}

import { flyItemToCart } from '../utils/flyingCartAnimation.js';

export function addToCart(item, restaurantId, restaurantName, customization = null) {
  // If adding from different restaurant, clear cart
  if (cart.restaurantId && cart.restaurantId !== restaurantId) {
    cart = { restaurantId, restaurantName, items: [] };
  }

  cart.restaurantId = restaurantId;
  cart.restaurantName = restaurantName;

  const unitPrice = customization ? customization.totalPrice : item.price;
  const customKey = customization ? `${item.id}-${JSON.stringify(customization.options)}` : `${item.id}`;

  const existing = cart.items.find(i => (i.customKey || i.id.toString()) === customKey);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.items.push({
      ...item,
      qty: 1,
      unitPrice,
      customKey,
      customization,
      participant: customization?.participant || (groupSession ? groupSession.participants[0] : null),
      macros: customization?.macros || {
        calories: item.isVeg ? 320 : 450,
        protein: item.isVeg ? 12 : 28,
        carbs: 45,
        fats: item.isVeg ? 10 : 18
      }
    });
  }

  saveCart();
  flyItemToCart(null, item.image || (item.isVeg ? '🥗' : '🍔'));
  return cart;
}

export function updateItemQty(customKeyOrId, delta) {
  const existing = cart.items.find(i => (i.customKey || i.id.toString()) === customKeyOrId.toString() || i.id === customKeyOrId);
  if (existing) {
    existing.qty += delta;
    if (existing.qty <= 0) {
      cart.items = cart.items.filter(i => (i.customKey || i.id.toString()) !== (existing.customKey || existing.id.toString()));
    }
  }

  if (cart.items.length === 0) {
    cart.restaurantId = null;
    cart.restaurantName = '';
  }

  saveCart();
  return cart;
}

export function removeFromCart(itemId) {
  return updateItemQty(itemId, -1);
}

export function getItemQty(itemId) {
  return cart.items
    .filter(i => i.id === itemId)
    .reduce((sum, i) => sum + i.qty, 0);
}

export function clearCart() {
  cart = { restaurantId: null, restaurantName: '', items: [] };
  saveCart();
}

export function onCartChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}
