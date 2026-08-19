// ============================================================
// FoodDash — Main Entry Point & Router (Fullstack Initializer)
// ============================================================
import { renderNavbar } from './components/Navbar.js';
import { createCartDrawer, toggleCartDrawer } from './components/CartDrawer.js';
import { createFloatingCartBar } from './components/FloatingCartBar.js';
import { createLocationModal } from './components/LocationModal.js';
import { createLoginModal } from './components/LoginModal.js';
import { createOrderHistoryModal } from './components/OrderHistoryModal.js';
import { initPaymentModal } from './components/PaymentModal.js';
import { createMerchantPortalModal } from './components/MerchantPortalModal.js';
import { createDeliveryRiderModal } from './components/DeliveryRiderModal.js';
import { createProfileModal } from './components/ProfileModal.js';
import { initLiveTrackingModal } from './components/LiveTrackingModal.js';
import { initReviewsModal } from './components/ReviewsModal.js';
import { initSupportBot } from './components/SupportBot.js';
import { initCustomizationModal } from './components/CustomizationModal.js';
import { initAICravingModal } from './components/AICravingModal.js';
import { initSpinWheelModal } from './components/SpinWheelModal.js';
import { initGroupOrderModal } from './components/GroupOrderModal.js';
import { initThemeModal } from './components/ThemeModal.js';
import { initTableBookingModal } from './components/TableBookingModal.js';
import { openVoiceAssistantModal } from './components/VoiceAssistantModal.js';
import { initVoiceSearch } from './utils/voiceSearch.js';
import { init3DAmbientParticles } from './components/ThreeDParticles.js';
import { autoEnhance3DCards } from './utils/threeDPhysics.js';
import { initCursorSparkles } from './utils/cursorEffects.js';
import { initMagneticAndRipples } from './utils/magneticButtons.js';
import { initSpotlightEffect } from './utils/spotlightEffect.js';
import { initSoundEffects } from './utils/soundEffects.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderRestaurantPage } from './pages/RestaurantPage.js';
import { renderSearchPage } from './pages/SearchPage.js';
import { renderMerchantPage } from './pages/MerchantPage.js';
import { renderDriverPage } from './pages/DriverPage.js';
import { renderProfilePage } from './pages/ProfilePage.js';
import { createMobileBottomNav } from './components/MobileBottomNav.js';
import { checkSession } from './api/client.js';

// App state
let currentPage = 'home';
let currentData = null;

// DOM
const app = document.getElementById('app');

// Create main content container
const mainContent = document.createElement('main');
mainContent.id = 'main-content';
mainContent.setAttribute('role', 'main');

// Navigation handler
function navigate(page, data = null) {
  currentPage = page;
  currentData = data;

  // Update URL hash
  switch (page) {
    case 'home':
    case 'customer':
      window.location.hash = '';
      break;
    case 'restaurant':
      window.location.hash = `restaurant/${data}`;
      break;
    case 'search':
      window.location.hash = `search/${encodeURIComponent(data)}`;
      break;
    case 'merchant':
    case 'partner':
      window.location.hash = 'merchant';
      break;
    case 'driver':
    case 'rider':
      window.location.hash = 'driver';
      break;
    case 'profile':
      window.location.hash = 'profile';
      break;
  }

  renderCurrentPage();
}

// Render page based on state
function renderCurrentPage() {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (currentPage) {
    case 'home':
    case 'customer':
      renderHomePage(mainContent, navigate);
      break;
    case 'restaurant':
      renderRestaurantPage(mainContent, currentData, navigate);
      break;
    case 'search':
      renderSearchPage(mainContent, currentData, navigate);
      break;
    case 'merchant':
    case 'partner':
      renderMerchantPage(mainContent, navigate);
      break;
    case 'driver':
    case 'rider':
      renderDriverPage(mainContent, navigate);
      break;
    case 'profile':
      renderProfilePage(mainContent, navigate, currentData || 'profile');
      break;
    default:
      renderHomePage(mainContent, navigate);
  }
}

// Hash-based routing
function handleHashChange() {
  const rawHash = window.location.hash.slice(1);
  const hash = rawHash.toLowerCase();

  if (hash.startsWith('restaurant/')) {
    const id = parseInt(rawHash.split('/')[1]);
    if (!isNaN(id)) {
      currentPage = 'restaurant';
      currentData = id;
      renderCurrentPage();
      return;
    }
  }

  if (hash.startsWith('search/')) {
    const query = decodeURIComponent(rawHash.split('/').slice(1).join('/'));
    if (query) {
      currentPage = 'search';
      currentData = query;
      renderCurrentPage();
      return;
    }
  }

  if (hash === 'merchant' || hash === 'partner' || hash === 'restaurant-portal') {
    currentPage = 'merchant';
    currentData = null;
    renderCurrentPage();
    return;
  }

  if (hash === 'driver' || hash === 'rider' || hash === 'delivery' || hash === 'rider-portal') {
    currentPage = 'driver';
    currentData = null;
    renderCurrentPage();
    return;
  }

  if (hash === 'profile' || hash === 'account' || hash === 'settings') {
    currentPage = 'profile';
    currentData = null;
    renderCurrentPage();
    return;
  }

  currentPage = 'home';
  currentData = null;
  renderCurrentPage();
}

// Initialize fullstack app
async function init() {
  // Check auth session
  await checkSession();

  // Render navbar
  const navbar = renderNavbar(toggleCartDrawer, navigate);
  app.appendChild(navbar);

  // Add main content
  app.appendChild(mainContent);

  // Create modals & drawers
  createCartDrawer(navigate);
  createFloatingCartBar(toggleCartDrawer);
  createLocationModal((newLocation) => {
    const locText = document.getElementById('nav-location-text');
    if (locText) locText.textContent = newLocation.fullTitle;
    if (currentPage === 'home') {
      renderHomePage(mainContent, navigate);
    }
  });
  createLoginModal();
  createProfileModal();
  createOrderHistoryModal();
  initPaymentModal(navigate);
  createMerchantPortalModal(() => {
    if (currentPage === 'home') renderHomePage(mainContent, navigate);
  });
  createDeliveryRiderModal();
  initLiveTrackingModal();
  initReviewsModal();
  initSupportBot();
  initCustomizationModal();
  initAICravingModal(navigate);
  initSpinWheelModal();
  initGroupOrderModal();
  initThemeModal();
  initTableBookingModal();
  initVoiceSearch(navigate);
  init3DAmbientParticles();
  initCursorSparkles();
  initSoundEffects();

  // Mount mobile phone bottom navigation
  const mobileNav = createMobileBottomNav(navigate, toggleCartDrawer);
  app.appendChild(mobileNav);

  // Handle initial route
  handleHashChange();
  setTimeout(() => {
    autoEnhance3DCards();
    initMagneticAndRipples();
    initSpotlightEffect();
  }, 300);

  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);

  // Global Ctrl+K / Cmd+K AI Food Concierge shortcut
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openVoiceAssistantModal(navigate);
    }
  });

  console.log('🚀 FoodDash Fullstack Platform Online!');
}

// Start
init();
