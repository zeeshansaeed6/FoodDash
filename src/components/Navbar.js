import { getCartCount, onCartChange, getDashCoins, onCoinsChange } from './CartState.js';
import { searchAll } from '../data/restaurants.js';
import { openLocationModal, getActiveLocation } from './LocationModal.js';
import { openLoginModal } from './LoginModal.js';
import { openOrderHistoryModal } from './OrderHistoryModal.js';
import { openMerchantPortal } from './MerchantPortalModal.js';
import { openDeliveryRiderPortal } from './DeliveryRiderModal.js';
import { openProfileModal } from './ProfileModal.js';
import { openAICravingModal } from './AICravingModal.js';
import { openSpinWheelModal } from './SpinWheelModal.js';
import { openGroupOrderModal } from './GroupOrderModal.js';
import { openThemeModal } from './ThemeModal.js';
import { openVoiceAssistantModal } from './VoiceAssistantModal.js';
import { open3DFoodInspectorModal } from './ThreeDFoodInspectorModal.js';
import { openFoodReelsModal } from './FoodReelsModal.js';
import { openGoogleMapsKeyModal } from '../utils/googleMaps.js';
import { openFitMealPlannerModal } from './FitMealPlannerModal.js';
import { openMysteryBoxModal } from './MysteryBoxModal.js';
import { openTasteMatchModal } from './TasteMatchModal.js';
import { getCurrentUser, onAuthChange, logoutUser } from '../api/client.js';
import { showToast } from './Toast.js';

export function renderNavbar(onCartClick, onNavigate) {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  function getNavbarHtml() {
    const user = getCurrentUser();
    const loc = getActiveLocation();
    const coins = getDashCoins();

    return `
      <div class="container navbar__inner">
        <a class="navbar__logo" id="nav-logo" href="#" aria-label="FoodDash Home">
          <img src="/logo.jpg" alt="FoodDash Logo" style="height: 32px; width: auto; border-radius: 6px; margin-right: 6px;">
          <span class="navbar__logo-text">FoodDash</span>
        </a>

        <!-- Role Mode Switcher removed for separate dashboard URLs -->

        <button class="navbar__location" id="nav-location" aria-label="Change delivery location" title="Click to choose city or address">
          <span class="navbar__location-icon">📍</span>
          <span class="navbar__location-text" id="nav-location-text">${loc.fullTitle || 'Select Location'}</span>
          <span class="navbar__location-arrow">▾</span>
        </button>

        <!-- Search Bar with Voice Mic -->
        <div class="navbar__search" id="nav-search-wrap" style="position: relative;">
          <span class="navbar__search-icon">🔍</span>
          <input
            type="search"
            class="navbar__search-input"
            id="nav-search-input"
            placeholder="Search food, cravings or ask AI..."
            autocomplete="off"
            aria-label="Search restaurants or dishes"
            style="padding-right: 36px;"
          />
          <button id="nav-voice-btn" title="AI Voice Food Concierge (Ctrl+K)" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; font-size: 16px; cursor: pointer; padding: 4px; display: flex; align-items: center; justify-content: center; color: var(--clr-primary); transition: transform 0.2s;">
            🎙️
          </button>
          <div class="search-dropdown" id="nav-search-dropdown"></div>
        </div>

        <!-- Clean Explore Studio Menu -->
        <div class="relative" id="explore-menu-container" style="position: relative;">
          <button class="btn btn-ghost btn-sm" id="nav-explore-btn" style="background: rgba(255, 255, 255, 0.06); border: 1px solid var(--clr-border); border-radius: var(--radius-full); font-size: 12px; font-weight: 700; padding: 6px 14px; display: flex; align-items: center; gap: 6px; color: white;">
            <span>✨</span> Explore Studio <span>▾</span>
          </button>

          <!-- Explore Dropdown -->
          <div id="explore-dropdown-menu" style="display: none; position: absolute; right: 0; top: calc(100% + 10px); width: 340px; background: var(--clr-bg-elevated); border: 1px solid var(--clr-border); border-radius: 16px; box-shadow: var(--shadow-2xl); padding: 12px; z-index: 600; backdrop-filter: blur(20px);">
            <div style="font-size: 11px; font-weight: 800; color: var(--clr-text-muted); text-transform: uppercase; padding: 4px 8px 8px; letter-spacing: 0.5px;">Interactive Experience Studio</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="explore-item-btn" id="drop-fitmeal-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(0, 230, 118, 0.08); border: 1px solid rgba(0, 230, 118, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">🥗</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">FitMeal AI</span>
                <span style="font-size: 10px; color: #00e676;">Macro Planner</span>
              </button>

              <button class="explore-item-btn" id="drop-mystery-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">🎁</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">Mystery Box</span>
                <span style="font-size: 10px; color: #f472b6;">Blind Craving Crate</span>
              </button>

              <button class="explore-item-btn" id="drop-match-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(255, 51, 102, 0.08); border: 1px solid rgba(255, 51, 102, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">💘</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">Flavour Swipe</span>
                <span style="font-size: 10px; color: #ff5c8a;">Food Tinder</span>
              </button>

              <button class="explore-item-btn" id="drop-reels-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">🎬</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">Food Reels</span>
                <span style="font-size: 10px; color: #f87171;">Video Feed</span>
              </button>

              <button class="explore-item-btn" id="drop-3d-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(255, 107, 0, 0.08); border: 1px solid rgba(255, 107, 0, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">🥽</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">3D Studio</span>
                <span style="font-size: 10px; color: #ff9f43;">360° Inspector</span>
              </button>

              <button class="explore-item-btn" id="drop-spin-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(255, 165, 2, 0.08); border: 1px solid rgba(255, 165, 2, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">🎡</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">Spin & Win</span>
                <span style="font-size: 10px; color: #ffa502;">Daily Rewards</span>
              </button>

              <button class="explore-item-btn" id="drop-group-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(0, 180, 216, 0.08); border: 1px solid rgba(0, 180, 216, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">👥</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">Group Order</span>
                <span style="font-size: 10px; color: #00b4d8;">Split Bill Room</span>
              </button>

              <button class="explore-item-btn" id="drop-theme-btn" style="display: flex; flex-direction: column; align-items: flex-start; padding: 10px; border-radius: 10px; background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.2); cursor: pointer; text-align: left;">
                <span style="font-size: 18px;">🎨</span>
                <span style="font-size: 12px; font-weight: 700; color: white; margin-top: 4px;">Theme Studio</span>
                <span style="font-size: 10px; color: #c084fc;">8 Color Styles</span>
              </button>
            </div>
          </div>
        </div>

        <div class="navbar__actions">
          <!-- DashCoins Badge -->
          <button class="btn btn-ghost btn-sm" id="nav-install-app-btn" title="Install App" style="display: none; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-full); font-size: 12px; font-weight: 800; color: #10b981; padding: 5px 12px; align-items: center; gap: 4px;">
            <span>📱</span> Install App
          </button>

          <button class="btn btn-ghost btn-sm" id="nav-coins-btn" title="DashCoins Loyalty Wallet" style="background: rgba(255, 165, 2, 0.12); border: 1px solid rgba(255, 165, 2, 0.3); border-radius: var(--radius-full); font-size: 12px; font-weight: 800; color: #ffa502; padding: 5px 10px; display: flex; align-items: center; gap: 4px;">
            <span>🪙</span> <span id="nav-coins-val">${coins}</span>
          </button>

          <button class="navbar__cart-btn" id="nav-cart-btn" aria-label="Open cart">
            🛒 <span id="nav-cart-text">Cart</span>
            <span class="navbar__cart-badge" id="nav-cart-badge" style="display: none;">0</span>
          </button>

          ${user ? `
            <div class="relative" id="user-menu-container">
              <button class="navbar__user-btn" id="nav-user-profile-btn" style="display: flex; align-items: center; gap: 6px; width: auto; padding: 4px 12px; border-radius: var(--radius-full);">
                <span>${user.avatar || '👤'}</span>
                <span style="font-size: 13px; font-weight: 600; max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name.split(' ')[0]}</span>
                <span style="font-size: 10px; color: var(--clr-text-muted);">▾</span>
              </button>

              <div id="user-dropdown-menu" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); width: 220px; background: var(--clr-bg-elevated); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); padding: 8px; z-index: 500;">
                <div style="padding: 8px 12px; border-bottom: 1px solid var(--clr-border); margin-bottom: 4px;">
                  <div style="font-weight: bold; font-size: 13px;">${user.name}</div>
                  <div style="font-size: 11px; color: var(--clr-text-muted);">${user.phone ? '+91 ' + user.phone : user.email || ''}</div>
                </div>
                <button class="user-menu-item" id="menu-profile" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>👤</span> My Profile
                </button>
                <button class="user-menu-item" id="menu-theme" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>🎨</span> Themes & Styling
                </button>
                <button class="user-menu-item" id="menu-my-orders" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>📦</span> Order History
                </button>
                <button class="user-menu-item" id="menu-addresses" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>📍</span> Address Book
                </button>
                <button class="user-menu-item" id="menu-settings" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>⚙️</span> Preferences & Lifestyle
                </button>
                <button class="user-menu-item" id="menu-change-loc" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>📍</span> Change City
                </button>
                <button class="user-menu-item" id="menu-gmaps" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px; color: #60a5fa;">
                  <span>🗺️</span> Google Maps Settings
                </button>
                <div style="border-top: 1px solid var(--clr-border); margin: 4px 0;"></div>
                <button class="user-menu-item" id="menu-logout" style="width: 100%; text-align: left; padding: 8px 12px; font-size: 13px; color: #ff5252; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 8px;">
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </div>
          ` : `
            <button class="btn btn-ghost btn-sm" id="nav-login-btn" style="border-radius: var(--radius-full); padding: 6px 16px;">
              Sign In
            </button>
          `}
        </div>
      </div>
    `;
  }

  function render() {
    nav.innerHTML = getNavbarHtml();
    bindEvents();
  }

  function bindEvents() {
    // Location selector click
    nav.querySelector('#nav-location')?.addEventListener('click', openLocationModal);

    // Explore Studio dropdown toggle
    const exploreBtn = nav.querySelector('#nav-explore-btn');
    const exploreDropdown = nav.querySelector('#explore-dropdown-menu');
    if (exploreBtn && exploreDropdown) {
      exploreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        exploreDropdown.style.display = exploreDropdown.style.display === 'none' ? 'block' : 'none';
      });

      nav.querySelector('#drop-fitmeal-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openFitMealPlannerModal();
      });
      nav.querySelector('#drop-mystery-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openMysteryBoxModal();
      });
      nav.querySelector('#drop-match-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openTasteMatchModal();
      });
      nav.querySelector('#drop-reels-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openFoodReelsModal(0);
      });
      nav.querySelector('#drop-3d-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        open3DFoodInspectorModal();
      });
      nav.querySelector('#drop-spin-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openSpinWheelModal();
      });
      nav.querySelector('#drop-group-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openGroupOrderModal();
      });
      nav.querySelector('#drop-theme-btn')?.addEventListener('click', () => {
        exploreDropdown.style.display = 'none';
        openThemeModal();
      });

      document.addEventListener('click', (e) => {
        if (!nav.querySelector('#explore-menu-container')?.contains(e.target)) {
          exploreDropdown.style.display = 'none';
        }
      });
    }

    nav.querySelector('#nav-coins-btn')?.addEventListener('click', openSpinWheelModal);

    // Voice search
    nav.querySelector('#nav-voice-btn')?.addEventListener('click', () => {
      openVoiceAssistantModal(onNavigate);
    });

    // Role buttons with dedicated routes
    nav.querySelector('#role-customer-btn')?.addEventListener('click', () => {
      onNavigate('home');
      showToast('Switched to Customer App 🛍️', '👤');
    });

    nav.querySelector('#nav-partner-btn')?.addEventListener('click', () => {
      onNavigate('merchant');
      showToast('Switched to Restaurant Hub 🧑‍🍳', '🧑‍🍳');
    });

    nav.querySelector('#nav-rider-btn')?.addEventListener('click', () => {
      onNavigate('driver');
      showToast('Switched to Driver Fleet 🛵', '🛵');
    });

    // User login button
    nav.querySelector('#nav-login-btn')?.addEventListener('click', openLoginModal);

    // User profile dropdown toggle
    const profileBtn = nav.querySelector('#nav-user-profile-btn');
    const dropdown = nav.querySelector('#user-dropdown-menu');
    if (profileBtn && dropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      });

      nav.querySelector('#menu-profile')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        onNavigate('profile', 'profile');
      });

      nav.querySelector('#menu-theme')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        openThemeModal();
      });

      nav.querySelector('#menu-addresses')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        onNavigate('profile', 'addresses');
      });

      nav.querySelector('#menu-settings')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        onNavigate('profile', 'preferences');
      });

      nav.querySelector('#menu-my-orders')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        openOrderHistoryModal();
      });

      nav.querySelector('#menu-change-loc')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        openLocationModal();
      });

      nav.querySelector('#menu-gmaps')?.addEventListener('click', () => {
        dropdown.style.display = 'none';
        openGoogleMapsKeyModal();
      });

      nav.querySelector('#menu-logout')?.addEventListener('click', async () => {
        dropdown.style.display = 'none';
        await logoutUser();
        showToast('Logged out successfully', '👋');
      });

      document.addEventListener('click', (e) => {
        if (!nav.querySelector('#user-menu-container')?.contains(e.target)) {
          dropdown.style.display = 'none';
        }
      });
    }

    // Cart button click
    nav.querySelector('#nav-cart-btn')?.addEventListener('click', onCartClick);

    // Logo click
    nav.querySelector('#nav-logo')?.addEventListener('click', (e) => {
      e.preventDefault();
      onNavigate('home');
    });

    // Search bar
    const searchInput = nav.querySelector('#nav-search-input');
    const searchDropdown = nav.querySelector('#nav-search-dropdown');
    let debounceTimer;

    if (searchInput && searchDropdown) {
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const query = searchInput.value.trim();
          if (query.length < 2) {
            searchDropdown.classList.remove('active');
            return;
          }
          const results = searchAll(query);
          renderSearchDropdown(searchDropdown, results, query, onNavigate, searchInput);
        }, 200);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = searchInput.value.trim();
          if (query.length >= 2) {
            searchDropdown.classList.remove('active');
            onNavigate('search', query);
          }
        }
      });

      document.addEventListener('click', (e) => {
        if (!nav.querySelector('#nav-search-wrap')?.contains(e.target)) {
          searchDropdown.classList.remove('active');
        }
      });
    }

    // Update cart badge & role tabs
    updateBadge();
    updateRolePills();

    // PWA Install Logic
    let deferredPrompt;
    const installBtn = nav.querySelector('#nav-install-app-btn');
    
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      if (installBtn) {
        installBtn.style.display = 'flex';
      }
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          // Show the install prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          // We've used the prompt, and can't use it again, throw it away
          deferredPrompt = null;
          installBtn.style.display = 'none';
        }
      });
    }

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      if (installBtn) {
        installBtn.style.display = 'none';
      }
      showToast('App installed successfully! 🎉', '📱');
    });
  }

  // Role Pill Indicator Sync
  const updateRolePills = () => {
    const hash = (window.location.hash.slice(1) || '').toLowerCase();
    const customerBtn = nav.querySelector('#role-customer-btn');
    const partnerBtn = nav.querySelector('#nav-partner-btn');
    const riderBtn = nav.querySelector('#nav-rider-btn');

    if (!customerBtn || !partnerBtn || !riderBtn) return;

    // Reset styles
    [customerBtn, partnerBtn, riderBtn].forEach(b => {
      b.style.background = 'transparent';
      b.style.color = 'var(--clr-text-secondary)';
      b.style.fontWeight = '500';
    });

    if (hash === 'merchant' || hash === 'partner' || hash === 'restaurant-portal') {
      partnerBtn.style.background = '#ff6b00';
      partnerBtn.style.color = 'white';
      partnerBtn.style.fontWeight = 'bold';
    } else if (hash === 'driver' || hash === 'rider' || hash === 'delivery' || hash === 'rider-portal') {
      riderBtn.style.background = '#00e676';
      riderBtn.style.color = '#000';
      riderBtn.style.fontWeight = 'bold';
    } else {
      customerBtn.style.background = 'var(--clr-primary)';
      customerBtn.style.color = 'white';
      customerBtn.style.fontWeight = 'bold';
    }
  };

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('hashchange', updateRolePills);

  const updateBadge = () => {
    const count = getCartCount();
    const badge = nav.querySelector('#nav-cart-badge');
    const text = nav.querySelector('#nav-cart-text');
    if (badge && text) {
      if (count > 0) {
        badge.style.display = 'flex';
        badge.textContent = count;
        text.textContent = `Cart (${count})`;
      } else {
        badge.style.display = 'none';
        text.textContent = 'Cart';
      }
    }
  };

  const updateCoins = (c) => {
    const coinEl = nav.querySelector('#nav-coins-val');
    if (coinEl) coinEl.textContent = c;
  };

  onCartChange(updateBadge);
  onCoinsChange(updateCoins);
  onAuthChange(() => render());

  render();
  return nav;
}

function renderSearchDropdown(dropdown, results, query, onNavigate, searchInput) {
  const { restaurants, dishes } = results;

  if (restaurants.length === 0 && dishes.length === 0) {
    dropdown.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--clr-text-muted);">
        <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
        No results for "${query}"
      </div>
    `;
    dropdown.classList.add('active');
    return;
  }

  let html = '';

  if (restaurants.length > 0) {
    html += `<div class="search-dropdown__section-title">Restaurants</div>`;
    restaurants.slice(0, 4).forEach(r => {
      html += `
        <div class="search-dropdown__item" data-type="restaurant" data-id="${r.id}">
          <div class="search-dropdown__item-icon">🏪</div>
          <div class="search-dropdown__item-info">
            <div class="search-dropdown__item-name">${r.name}</div>
            <div class="search-dropdown__item-sub">${r.cuisines.join(' • ')} · ★ ${r.rating}</div>
          </div>
        </div>
      `;
    });
  }

  if (dishes.length > 0) {
    html += `<div class="search-dropdown__section-title">Dishes</div>`;
    dishes.slice(0, 5).forEach(d => {
      html += `
        <div class="search-dropdown__item" data-type="restaurant" data-id="${d.restaurantId}">
          <div class="search-dropdown__item-icon">🍽️</div>
          <div class="search-dropdown__item-info">
            <div class="search-dropdown__item-name">${d.name}</div>
            <div class="search-dropdown__item-sub">${d.restaurantName} · ₹${d.price}</div>
          </div>
        </div>
      `;
    });
  }

  dropdown.innerHTML = html;
  dropdown.classList.add('active');

  dropdown.querySelectorAll('.search-dropdown__item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.type;
      if (type === 'restaurant') {
        onNavigate('restaurant', parseInt(item.dataset.id));
      }
      dropdown.classList.remove('active');
      searchInput.value = '';
    });
  });
}
