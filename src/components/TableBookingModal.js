// ============================================================
// FoodDash — Table Booking & Dine-in Reservation Experience
// ============================================================
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { getCurrentUser } from '../api/client.js';
import { fetchRestaurantTables, bookTableReservation } from '../api/client.js';

let modalOverlay = null;
let currentRest = null;
let currentTables = [];
let selectedTable = null;
let currentStep = 1; // 1: DateTime & Party, 2: Seat Map, 3: Occasion & Contact, 4: Pre-Order, 5: Confirmed Pass
let preOrderCart = {}; // itemId -> { item, count }
let lastReservation = null;

// Form State
let bookingState = {
  date: getFormattedDate(new Date()),
  timeSlot: '7:30 PM',
  guests: 2,
  tableId: 'T-1',
  tableName: 'Window Couple Table',
  tableZone: 'Window Side',
  occasion: 'Casual Dining',
  specialRequests: '',
  customerName: '',
  customerPhone: '',
  customerEmail: ''
};

function getFormattedDate(d) {
  return d.toISOString().split('T')[0];
}

function getNextDate(daysAhead = 1) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return getFormattedDate(d);
}

export function initTableBookingModal() {
  if (document.getElementById('table-booking-overlay')) return;
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'login-overlay';
  modalOverlay.id = 'table-booking-overlay';
  document.body.appendChild(modalOverlay);

  // Close on backdrop click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeTableBookingModal();
    }
  });
}

export async function openTableBookingModal(restaurant) {
  currentRest = restaurant;
  currentStep = 1;
  preOrderCart = {};
  selectedTable = null;
  lastReservation = null;

  const user = getCurrentUser();
  bookingState = {
    date: getFormattedDate(new Date()),
    timeSlot: '7:30 PM',
    guests: 2,
    tableId: 'T-1',
    tableName: 'Window Couple Table',
    tableZone: 'Window Side',
    occasion: 'Casual Dining',
    specialRequests: '',
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    customerEmail: user?.email || ''
  };

  if (!modalOverlay) initTableBookingModal();
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  sounds.pop?.();
  await loadTables();
  renderModal();
}

export function closeTableBookingModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

async function loadTables() {
  if (!currentRest) return;
  try {
    const res = await fetchRestaurantTables(currentRest.id, bookingState.date, bookingState.timeSlot);
    if (res.success && res.tables) {
      currentTables = res.tables;
      // Auto select first available table matching guest capacity
      const suitable = currentTables.find(t => t.isAvailable && t.capacity >= bookingState.guests) || currentTables.find(t => t.isAvailable) || currentTables[0];
      if (suitable) {
        selectedTable = suitable;
        bookingState.tableId = suitable.id;
        bookingState.tableName = suitable.name;
        bookingState.tableZone = suitable.zone;
      }
    }
  } catch (e) {
    console.error('Error fetching tables:', e);
  }
}

function renderModal() {
  if (!modalOverlay || !currentRest) return;

  const todayStr = getFormattedDate(new Date());
  const tmrwStr = getNextDate(1);
  const dayAfterStr = getNextDate(2);

  modalOverlay.innerHTML = `
    <div class="login-modal table-booking-modal" style="max-width: 760px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0; border-radius: var(--radius-xl); box-shadow: var(--shadow-2xl);">
      
      <!-- Modal Header -->
      <div class="table-modal-header" style="background: linear-gradient(135deg, #1b212f 0%, #11141c 100%); padding: 18px 24px; border-bottom: 1px solid var(--clr-glass-border); position: relative;">
        <button id="tb-close-btn" class="tb-close-icon" title="Close">✕</button>
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 46px; height: 46px; border-radius: 12px; background: var(--clr-primary); display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 14px rgba(255,107,0,0.35);">
            🍽️
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-size: 18px; font-weight: 800; margin: 0; color: white;">Table & Dine-in Reservation</h3>
              <span class="badge" style="background: rgba(34,197,94,0.2); color: #4ade80; font-size: 11px; padding: 2px 8px; border-radius: 99px; font-weight: 600;">Instant Confirmation</span>
            </div>
            <p style="font-size: 13px; color: var(--clr-text-muted); margin: 2px 0 0;">${currentRest.name} • ${currentRest.area || currentRest.city || 'Downtown'}</p>
          </div>
        </div>

        <!-- Stepper Indicator -->
        <div class="tb-stepper" style="display: flex; gap: 8px; margin-top: 16px; align-items: center;">
          <div class="tb-step-pill ${currentStep >= 1 ? 'active' : ''}">1. Date & Party</div>
          <div class="tb-step-divider"></div>
          <div class="tb-step-pill ${currentStep >= 2 ? 'active' : ''}">2. Select Seat</div>
          <div class="tb-step-divider"></div>
          <div class="tb-step-pill ${currentStep >= 3 ? 'active' : ''}">3. Occasion</div>
          <div class="tb-step-divider"></div>
          <div class="tb-step-pill ${currentStep >= 4 ? 'active' : ''}">4. Pre-Order</div>
          <div class="tb-step-divider"></div>
          <div class="tb-step-pill ${currentStep >= 5 ? 'active' : ''}">5. Pass</div>
        </div>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div class="table-modal-body" style="padding: 24px; overflow-y: auto; flex: 1;">
        ${renderStepContent(todayStr, tmrwStr, dayAfterStr)}
      </div>

      <!-- Modal Footer -->
      <div class="table-modal-footer" style="padding: 16px 24px; background: rgba(18,22,30,0.95); border-top: 1px solid var(--clr-glass-border); display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        ${renderFooterControls()}
      </div>

    </div>
  `;

  attachEventListeners();
}

function renderStepContent(todayStr, tmrwStr, dayAfterStr) {
  if (currentStep === 1) {
    // STEP 1: Date, Time Slot, Party Size
    const lunchSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'];
    const dinnerSlots = ['6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];

    return `
      <div class="tb-step-pane">
        <!-- Date Selector -->
        <div class="tb-section">
          <label class="tb-label">📅 Select Dining Date</label>
          <div class="tb-date-grid">
            <button type="button" class="tb-date-btn ${bookingState.date === todayStr ? 'active' : ''}" data-date="${todayStr}">
              <span class="tb-date-title">Today</span>
              <span class="tb-date-sub">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </button>
            <button type="button" class="tb-date-btn ${bookingState.date === tmrwStr ? 'active' : ''}" data-date="${tmrwStr}">
              <span class="tb-date-title">Tomorrow</span>
              <span class="tb-date-sub">${new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </button>
            <button type="button" class="tb-date-btn ${bookingState.date === dayAfterStr ? 'active' : ''}" data-date="${dayAfterStr}">
              <span class="tb-date-title">${new Date(Date.now() + 172800000).toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span class="tb-date-sub">${new Date(Date.now() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </button>
            <div class="tb-custom-date-box">
              <span style="font-size: 11px; color: var(--clr-text-muted);">Pick Custom</span>
              <input type="date" id="tb-custom-date" value="${bookingState.date}" min="${todayStr}" class="tb-date-input" />
            </div>
          </div>
        </div>

        <!-- Party Size -->
        <div class="tb-section" style="margin-top: 20px;">
          <label class="tb-label">👥 Number of Guests</label>
          <div class="tb-guests-counter">
            <button type="button" class="tb-counter-btn" id="tb-guest-minus" ${bookingState.guests <= 1 ? 'disabled' : ''}>-</button>
            <div class="tb-guest-val">
              <span class="tb-guest-num">${bookingState.guests}</span>
              <span class="tb-guest-txt">${bookingState.guests === 1 ? 'Guest (Solo)' : bookingState.guests === 2 ? 'Guests (Couple)' : 'Guests (Group)'}</span>
            </div>
            <button type="button" class="tb-counter-btn" id="tb-guest-plus" ${bookingState.guests >= 12 ? 'disabled' : ''}>+</button>
          </div>
        </div>

        <!-- Time Slots -->
        <div class="tb-section" style="margin-top: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <label class="tb-label" style="margin: 0;">⏰ Select Time Slot</label>
            <span style="font-size: 12px; color: var(--clr-primary); font-weight: 600;">⚡ 15 min free grace period</span>
          </div>
          
          <div style="margin-bottom: 12px;">
            <div class="tb-slot-category">☀️ Lunch Slots</div>
            <div class="tb-slot-grid">
              ${lunchSlots.map(slot => `
                <button type="button" class="tb-slot-btn ${bookingState.timeSlot === slot ? 'active' : ''}" data-slot="${slot}">
                  ${slot}
                </button>
              `).join('')}
            </div>
          </div>

          <div>
            <div class="tb-slot-category">🌙 Evening & Dinner Slots</div>
            <div class="tb-slot-grid">
              ${dinnerSlots.map(slot => `
                <button type="button" class="tb-slot-btn ${bookingState.timeSlot === slot ? 'active' : ''}" data-slot="${slot}">
                  ${slot}
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (currentStep === 2) {
    // STEP 2: Interactive Visual Floor Plan & Seat Map
    return `
      <div class="tb-step-pane">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h4 style="font-size: 16px; font-weight: 700; margin: 0; color: white;">Interactive Restaurant Floor Plan & Seating Zones</h4>
            <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0;">Click on an available table to reserve your preferred dining experience.</p>
          </div>
          <!-- Legend -->
          <div class="tb-floor-legend">
            <span class="tb-legend-item"><span class="tb-dot available"></span> Available</span>
            <span class="tb-legend-item"><span class="tb-dot selected"></span> Selected</span>
            <span class="tb-legend-item"><span class="tb-dot booked"></span> Booked</span>
          </div>
        </div>

        <!-- Zone Filters -->
        <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 12px;">
          <button type="button" class="btn btn-ghost btn-sm tb-zone-chip active" data-zone="all" style="border-radius: var(--radius-full); font-size: 11px; padding: 4px 12px; border: 1px solid var(--clr-primary); background: var(--clr-primary); color: white;">🌟 All Zones</button>
          <button type="button" class="btn btn-ghost btn-sm tb-zone-chip" data-zone="Window" style="border-radius: var(--radius-full); font-size: 11px; padding: 4px 12px; border: 1px solid var(--clr-border);">🪟 Window Side</button>
          <button type="button" class="btn btn-ghost btn-sm tb-zone-chip" data-zone="VIP" style="border-radius: var(--radius-full); font-size: 11px; padding: 4px 12px; border: 1px solid var(--clr-border);">👑 VIP Lounge</button>
          <button type="button" class="btn btn-ghost btn-sm tb-zone-chip" data-zone="Rooftop" style="border-radius: var(--radius-full); font-size: 11px; padding: 4px 12px; border: 1px solid var(--clr-border);">🌃 Rooftop Terrace</button>
          <button type="button" class="btn btn-ghost btn-sm tb-zone-chip" data-zone="Garden" style="border-radius: var(--radius-full); font-size: 11px; padding: 4px 12px; border: 1px solid var(--clr-border);">🌿 Garden Patio</button>
          <button type="button" class="btn btn-ghost btn-sm tb-zone-chip" data-zone="Candlelight" style="border-radius: var(--radius-full); font-size: 11px; padding: 4px 12px; border: 1px solid var(--clr-border);">🕯️ Candlelight Booth</button>
        </div>

        <!-- Floor Grid -->
        <div class="tb-floor-grid" id="tb-floor-tables-grid">
          ${currentTables.map(t => {
            const isAvail = t.status === 'available';
            const isSel = selectedTable && selectedTable.id === t.id;
            const isFit = t.capacity >= bookingState.guests;

            return `
              <div class="tb-table-card ${isSel ? 'selected' : ''} ${!isAvail ? 'booked' : ''}" data-table-id="${t.id}">
                <div class="tb-table-header">
                  <span class="tb-table-icon">${t.icon || '🪑'}</span>
                  <span class="tb-table-status-pill ${t.status}">${isAvail ? 'Available' : 'Booked'}</span>
                </div>
                <div class="tb-table-name">${t.name}</div>
                <div class="tb-table-zone">📍 ${t.zone}</div>
                <div class="tb-table-footer">
                  <span class="tb-table-cap">👥 Up to ${t.capacity} guests</span>
                  ${isFit && isAvail ? '<span class="tb-fit-tag">Ideal Fit ✨</span>' : ''}
                </div>
                <div class="tb-tags-row">
                  ${(t.tags || []).map(tag => `<span class="tb-tag-chip">${tag}</span>`).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Selected Table Summary Banner -->
        ${selectedTable ? `
          <div class="tb-selected-banner">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 28px;">${selectedTable.icon}</div>
              <div>
                <div style="font-weight: 700; color: white;">${selectedTable.name} (${selectedTable.id})</div>
                <div style="font-size: 12px; color: var(--clr-text-muted);">${selectedTable.zone} • Capacity: ${selectedTable.capacity} guests</div>
              </div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 12px; color: #4ade80; font-weight: 600;">✓ Ready for Reservation</span>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (currentStep === 3) {
    // STEP 3: Occasion, Contact & Special Experience Addons
    const occasions = [
      { id: 'Casual Dining', icon: '🍽️', label: 'Casual Dining' },
      { id: 'Romantic Date', icon: '❤️', label: 'Romantic Date' },
      { id: 'Candlelight Special', icon: '🕯️', label: 'Candlelight Dinner' },
      { id: 'Birthday', icon: '🎂', label: 'Birthday Celebration' },
      { id: 'Anniversary', icon: '💍', label: 'Anniversary' },
      { id: 'Business Meeting', icon: '💼', label: 'Business Dinner' },
      { id: 'Family Gathering', icon: '👨‍👩‍👧‍👦', label: 'Family Feast' },
      { id: 'Reunion', icon: '🎉', label: 'Friends Reunion' },
      { id: 'Kitty Party', icon: '💃', label: 'Kitty Party' },
      { id: 'Corporate', icon: '🤝', label: 'Team Outing' }
    ];

    const experienceAddons = [
      { id: 'cake', icon: '🎂', label: 'Complimentary Birthday Cake presentation (Free)', price: '₹0' },
      { id: 'roses', icon: '🌹', label: 'Fresh Red Rose Petals Table Decor', price: '+₹199' },
      { id: 'mocktail', icon: '🥂', label: 'Chef Special Welcome Mocktails for all guests', price: '+₹149' },
      { id: 'corner', icon: '🤫', label: 'Quiet Acoustic Corner Table guarantee', price: 'Free' },
      { id: 'highchair', icon: '👶', label: 'Baby Highchair & Toddler Cutlery set', price: 'Free' }
    ];

    return `
      <div class="tb-step-pane">
        <!-- Occasion -->
        <div class="tb-section">
          <label class="tb-label">🎉 Celebrating a Special Occasion?</label>
          <div class="tb-occasion-grid" style="grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));">
            ${occasions.map(occ => `
              <button type="button" class="tb-occasion-btn ${bookingState.occasion === occ.id ? 'active' : ''}" data-occasion="${occ.id}">
                <span style="font-size: 20px;">${occ.icon}</span>
                <span>${occ.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Experience Addons -->
        <div class="tb-section" style="margin-top: 20px;">
          <label class="tb-label">✨ VIP Hospitality & Table Decor Addons</label>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${experienceAddons.map(add => `
              <label style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 20px;">${add.icon}</span>
                  <div>
                    <div style="font-size: 12px; font-weight: 600; color: white;">${add.label}</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 11px; font-weight: 700; color: var(--clr-primary);">${add.price}</span>
                  <input type="checkbox" class="tb-addon-check" style="accent-color: var(--clr-primary);" />
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Guest Contact Info -->
        <div class="tb-section" style="margin-top: 20px;">
          <label class="tb-label">👤 Primary Guest Contact</label>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            <div>
              <label style="font-size: 11px; color: var(--clr-text-muted); display: block; margin-bottom: 4px;">Full Name *</label>
              <input type="text" id="tb-name" value="${bookingState.customerName}" placeholder="e.g. Rahul Sharma" class="tb-input" required />
            </div>
            <div>
              <label style="font-size: 11px; color: var(--clr-text-muted); display: block; margin-bottom: 4px;">Phone Number *</label>
              <input type="tel" id="tb-phone" value="${bookingState.customerPhone}" placeholder="e.g. 9876543210" class="tb-input" required />
            </div>
            <div>
              <label style="font-size: 11px; color: var(--clr-text-muted); display: block; margin-bottom: 4px;">Email (For Pass PDF)</label>
              <input type="email" id="tb-email" value="${bookingState.customerEmail}" placeholder="e.g. rahul@example.com" class="tb-input" />
            </div>
          </div>
        </div>

        <!-- Special Requests -->
        <div class="tb-section" style="margin-top: 20px;">
          <label class="tb-label">✍️ Special Requests / Dining Notes (Optional)</label>
          <textarea id="tb-notes" placeholder="e.g., Baby highchair needed, quiet corner preferred, please decorate table with candles, allergic to peanuts..." class="tb-textarea">${bookingState.specialRequests}</textarea>
        </div>
      </div>
    `;
  }

  if (currentStep === 4) {
    // STEP 4: Dine-in Pre-Order Food (Optional)
    const menuCategories = currentRest.menu ? Object.keys(currentRest.menu) : [];
    let totalPreOrderCost = 0;
    let totalItemsCount = 0;
    Object.values(preOrderCart).forEach(entry => {
      totalPreOrderCost += entry.item.price * entry.count;
      totalItemsCount += entry.count;
    });

    return `
      <div class="tb-step-pane">
        <div style="background: rgba(255,107,0,0.1); border: 1px solid rgba(255,107,0,0.25); border-radius: var(--radius-lg); padding: 14px 18px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-weight: 700; color: white; display: flex; align-items: center; gap: 6px;">
              <span>⚡ Pre-Order Food for Dine-in</span>
              <span class="badge" style="background: var(--clr-primary); color: white; font-size: 10px;">Chef Express</span>
            </div>
            <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0;">Food will be freshly prepared and served right when you take your seats! (Optional)</p>
          </div>
          <div style="font-weight: 700; color: var(--clr-primary); font-size: 15px;">
            ${totalItemsCount > 0 ? `${totalItemsCount} items • ₹${totalPreOrderCost}` : 'No dishes pre-ordered'}
          </div>
        </div>

        <!-- Menu items browser -->
        <div class="tb-preorder-container">
          ${menuCategories.length === 0 ? `
            <div style="text-align: center; padding: 24px; color: var(--clr-text-muted);">
              Menu will be ordered in person at the restaurant.
            </div>
          ` : menuCategories.map(cat => {
            const items = currentRest.menu[cat] || [];
            return `
              <div class="tb-menu-cat-block">
                <h5 class="tb-menu-cat-title">${cat}</h5>
                <div class="tb-menu-cat-grid">
                  ${items.map(item => {
                    const inCart = preOrderCart[item.id]?.count || 0;
                    return `
                      <div class="tb-menu-item-row">
                        <div style="flex: 1;">
                          <div style="display: flex; align-items: center; gap: 6px;">
                            <span class="${item.isVeg ? 'veg-badge' : 'non-veg-badge'}" style="font-size: 10px;">●</span>
                            <span style="font-weight: 600; font-size: 13px; color: white;">${item.name}</span>
                          </div>
                          <div style="font-size: 12px; color: var(--clr-primary); font-weight: 700; margin-top: 2px;">₹${item.price}</div>
                        </div>
                        <div class="tb-item-counter">
                          ${inCart > 0 ? `
                            <button type="button" class="tb-ic-btn" data-action="minus" data-id="${item.id}">-</button>
                            <span class="tb-ic-val">${inCart}</span>
                            <button type="button" class="tb-ic-btn" data-action="plus" data-id="${item.id}">+</button>
                          ` : `
                            <button type="button" class="btn btn-outline btn-sm tb-add-btn" data-action="add" data-id="${item.id}">+ Add</button>
                          `}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  if (currentStep === 5 && lastReservation) {
    // STEP 5: Confirmed Digital Booking Pass with QR Code
    return renderConfirmedPass(lastReservation);
  }

  return '';
}

function renderConfirmedPass(res) {
  const qrSvg = generateQRCodeSvg(res.id);
  let totalPreCost = 0;
  (res.preOrderedItems || []).forEach(it => totalPreCost += it.price * it.quantity);

  return `
    <div class="tb-pass-wrapper">
      <div class="tb-conf-banner">
        <div style="font-size: 40px; margin-bottom: 6px;">🎉</div>
        <h3 style="font-size: 20px; font-weight: 800; color: white; margin: 0;">Reservation Confirmed!</h3>
        <p style="font-size: 13px; color: #4ade80; margin: 4px 0 0; font-weight: 600;">Your table is reserved and guaranteed.</p>
      </div>

      <!-- Ticket Pass Card -->
      <div class="tb-ticket-card" id="tb-printable-pass">
        <div class="tb-ticket-header">
          <div>
            <div style="font-size: 11px; color: var(--clr-text-muted); text-transform: uppercase; letter-spacing: 1px;">Dine-in Pass</div>
            <div style="font-size: 18px; font-weight: 800; color: white;">${res.restaurantName}</div>
            <div style="font-size: 12px; color: var(--clr-text-muted);">📍 ${res.restaurantAddress}</div>
          </div>
          <div class="tb-ticket-id">
            <span style="font-size: 10px; color: var(--clr-text-muted);">Booking ID</span>
            <span style="font-weight: 800; font-family: monospace; font-size: 14px; color: var(--clr-primary);">${res.id}</span>
          </div>
        </div>

        <div class="tb-ticket-cutout">
          <div class="tb-notch left"></div>
          <div class="tb-dash-line"></div>
          <div class="tb-notch right"></div>
        </div>

        <div class="tb-ticket-body">
          <div class="tb-ticket-grid">
            <div class="tb-info-box">
              <span class="tb-info-lbl">Date</span>
              <span class="tb-info-val">📅 ${res.date}</span>
            </div>
            <div class="tb-info-box">
              <span class="tb-info-lbl">Time Slot</span>
              <span class="tb-info-val">⏰ ${res.timeSlot}</span>
            </div>
            <div class="tb-info-box">
              <span class="tb-info-lbl">Guests</span>
              <span class="tb-info-val">👥 ${res.guests} Persons</span>
            </div>
            <div class="tb-info-box">
              <span class="tb-info-lbl">Reserved Table</span>
              <span class="tb-info-val">🪑 ${res.tableNames}</span>
            </div>
            <div class="tb-info-box">
              <span class="tb-info-lbl">Guest Name</span>
              <span class="tb-info-val">👤 ${res.customerName}</span>
            </div>
            <div class="tb-info-box">
              <span class="tb-info-lbl">Occasion</span>
              <span class="tb-info-val">🎉 ${res.occasion}</span>
            </div>
          </div>

          ${res.preOrderedItems && res.preOrderedItems.length > 0 ? `
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); border: 1px solid var(--clr-glass-border);">
              <div style="font-size: 11px; color: var(--clr-text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Pre-Ordered Dishes (Chef Express)</div>
              ${res.preOrderedItems.map(it => `
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
                  <span>${it.quantity}x ${it.name}</span>
                  <span style="font-weight: 600;">₹${it.price * it.quantity}</span>
                </div>
              `).join('')}
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; border-top: 1px dashed var(--clr-glass-border); padding-top: 4px; margin-top: 4px; color: var(--clr-primary);">
                <span>Total Pre-Order Amount</span>
                <span>₹${totalPreCost}</span>
              </div>
            </div>
          ` : ''}

          <!-- QR Code section -->
          <div class="tb-qr-section">
            <div class="tb-qr-box">
              ${qrSvg}
            </div>
            <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 6px;">Show this QR code at the restaurant reception for VIP seating</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 10px; margin-top: 20px; justify-content: center; flex-wrap: wrap;">
        <button id="tb-print-pass-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px;">
          🖨️ Print / Save Pass
        </button>
        <button id="tb-calendar-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px;">
          📅 Add to Calendar
        </button>
        <button id="tb-directions-btn" class="btn btn-secondary btn-sm" style="display: flex; align-items: center; gap: 6px;">
          📍 Get Directions
        </button>
      </div>
    </div>
  `;
}

function renderFooterControls() {
  if (currentStep === 1) {
    return `
      <div style="font-size: 13px; color: var(--clr-text-muted);">Step 1 of 4: Select when & how many</div>
      <div style="display: flex; gap: 10px;">
        <button type="button" class="btn btn-secondary" id="tb-cancel-btn">Cancel</button>
        <button type="button" class="btn btn-primary" id="tb-next-btn">Next: Choose Table ➔</button>
      </div>
    `;
  }
  if (currentStep === 2) {
    return `
      <div style="font-size: 13px; color: var(--clr-text-muted);">
        Table: <strong style="color: white;">${selectedTable ? selectedTable.name : 'None selected'}</strong>
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="button" class="btn btn-secondary" id="tb-prev-btn">⬅ Back</button>
        <button type="button" class="btn btn-primary" id="tb-next-btn" ${!selectedTable ? 'disabled' : ''}>Next: Occasion ➔</button>
      </div>
    `;
  }
  if (currentStep === 3) {
    return `
      <div style="font-size: 13px; color: var(--clr-text-muted);">Step 3 of 4: Contact & preferences</div>
      <div style="display: flex; gap: 10px;">
        <button type="button" class="btn btn-secondary" id="tb-prev-btn">⬅ Back</button>
        <button type="button" class="btn btn-primary" id="tb-next-btn">Next: Food Pre-Order ➔</button>
      </div>
    `;
  }
  if (currentStep === 4) {
    let count = 0;
    Object.values(preOrderCart).forEach(e => count += e.count);
    return `
      <div style="font-size: 13px; color: var(--clr-text-muted);">
        ${count > 0 ? `<strong style="color: var(--clr-primary);">${count} dishes selected</strong> for express serving` : 'Table booking only (₹0 deposit)'}
      </div>
      <div style="display: flex; gap: 10px;">
        <button type="button" class="btn btn-secondary" id="tb-prev-btn">⬅ Back</button>
        <button type="button" class="btn btn-primary" id="tb-confirm-booking-btn" style="background: linear-gradient(135deg, #ff6b00, #ff8800); box-shadow: 0 4px 16px rgba(255,107,0,0.4);">
          🎉 Confirm Reservation
        </button>
      </div>
    `;
  }
  if (currentStep === 5) {
    return `
      <div style="font-size: 13px; color: #4ade80; font-weight: 600;">✓ Pass saved to your account</div>
      <button type="button" class="btn btn-primary" id="tb-done-btn">Done</button>
    `;
  }
  return '';
}

function attachEventListeners() {
  if (!modalOverlay) return;

  // Close button
  modalOverlay.querySelector('#tb-close-btn')?.addEventListener('click', closeTableBookingModal);
  modalOverlay.querySelector('#tb-cancel-btn')?.addEventListener('click', closeTableBookingModal);
  modalOverlay.querySelector('#tb-done-btn')?.addEventListener('click', closeTableBookingModal);

  // Stepper navigation
  modalOverlay.querySelector('#tb-prev-btn')?.addEventListener('click', () => {
    sounds.click?.();
    currentStep = Math.max(1, currentStep - 1);
    renderModal();
  });

  modalOverlay.querySelector('#tb-next-btn')?.addEventListener('click', async () => {
    sounds.click?.();
    if (currentStep === 1) {
      await loadTables();
      currentStep = 2;
    } else if (currentStep === 2) {
      if (!selectedTable) {
        showToast('Please select a table to continue', 'error');
        return;
      }
      currentStep = 3;
    } else if (currentStep === 3) {
      const nameInput = modalOverlay.querySelector('#tb-name');
      const phoneInput = modalOverlay.querySelector('#tb-phone');
      const emailInput = modalOverlay.querySelector('#tb-email');
      const notesInput = modalOverlay.querySelector('#tb-notes');

      if (nameInput) bookingState.customerName = nameInput.value.trim();
      if (phoneInput) bookingState.customerPhone = phoneInput.value.trim();
      if (emailInput) bookingState.customerEmail = emailInput.value.trim();
      if (notesInput) bookingState.specialRequests = notesInput.value.trim();

      if (!bookingState.customerName) {
        showToast('Please enter your name', 'error');
        nameInput?.focus();
        return;
      }
      if (!bookingState.customerPhone || bookingState.customerPhone.length < 6) {
        showToast('Please enter a valid phone number', 'error');
        phoneInput?.focus();
        return;
      }
      currentStep = 4;
    }
    renderModal();
  });

  // Step 1 Events
  if (currentStep === 1) {
    modalOverlay.querySelectorAll('.tb-date-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        sounds.click?.();
        bookingState.date = btn.dataset.date;
        renderModal();
      });
    });

    const customDateInput = modalOverlay.querySelector('#tb-custom-date');
    if (customDateInput) {
      customDateInput.addEventListener('change', (e) => {
        bookingState.date = e.target.value;
        renderModal();
      });
    }

    modalOverlay.querySelector('#tb-guest-minus')?.addEventListener('click', () => {
      sounds.click?.();
      if (bookingState.guests > 1) {
        bookingState.guests--;
        renderModal();
      }
    });

    modalOverlay.querySelector('#tb-guest-plus')?.addEventListener('click', () => {
      sounds.click?.();
      if (bookingState.guests < 12) {
        bookingState.guests++;
        renderModal();
      }
    });

    modalOverlay.querySelectorAll('.tb-slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.click?.();
        bookingState.timeSlot = btn.dataset.slot;
        renderModal();
      });
    });
  }

  // Step 2 Events: Table Selection
  if (currentStep === 2) {
    modalOverlay.querySelectorAll('.tb-table-card').forEach(card => {
      card.addEventListener('click', () => {
        const tId = card.dataset.tableId;
        const tbl = currentTables.find(t => t.id === tId);
        if (tbl && tbl.isAvailable) {
          sounds.pop?.();
          selectedTable = tbl;
          bookingState.tableId = tbl.id;
          bookingState.tableName = tbl.name;
          bookingState.tableZone = tbl.zone;
          renderModal();
        } else {
          showToast('This table is already reserved for this time slot', 'error');
        }
      });
    });
  }

  // Step 3 Events: Occasion
  if (currentStep === 3) {
    modalOverlay.querySelectorAll('.tb-occasion-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.click?.();
        bookingState.occasion = btn.dataset.occasion;
        renderModal();
      });
    });
  }

  // Step 4 Events: Pre-order Menu Counter
  if (currentStep === 4) {
    modalOverlay.querySelectorAll('.tb-add-btn, .tb-ic-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        // Find item in restaurant menu
        let targetItem = null;
        Object.values(currentRest.menu || {}).forEach(arr => {
          const it = arr.find(x => x.id === itemId);
          if (it) targetItem = it;
        });

        if (!targetItem) return;

        if (action === 'add' || action === 'plus') {
          sounds.pop?.();
          if (!preOrderCart[itemId]) {
            preOrderCart[itemId] = { item: targetItem, count: 1 };
          } else {
            preOrderCart[itemId].count++;
          }
        } else if (action === 'minus') {
          sounds.click?.();
          if (preOrderCart[itemId]) {
            preOrderCart[itemId].count--;
            if (preOrderCart[itemId].count <= 0) {
              delete preOrderCart[itemId];
            }
          }
        }
        renderModal();
      });
    });

    // Confirm Booking Submission
    modalOverlay.querySelector('#tb-confirm-booking-btn')?.addEventListener('click', async () => {
      const confirmBtn = modalOverlay.querySelector('#tb-confirm-booking-btn');
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = 'Reserving table... ⏳';

      // Build payload
      const preOrderedItems = Object.values(preOrderCart).map(entry => ({
        id: entry.item.id,
        name: entry.item.name,
        price: entry.item.price,
        quantity: entry.count,
        image: entry.item.image
      }));

      let preOrderTotal = 0;
      preOrderedItems.forEach(it => preOrderTotal += it.price * it.quantity);

      const user = getCurrentUser();
      const payload = {
        restaurantId: currentRest.id,
        restaurantName: currentRest.name,
        restaurantAddress: currentRest.address || `${currentRest.area || 'Downtown'}, ${currentRest.city || 'Bangalore'}`,
        restaurantImage: currentRest.image || '',
        date: bookingState.date,
        timeSlot: bookingState.timeSlot,
        guests: bookingState.guests,
        tableIds: [selectedTable.id],
        tableNames: `${selectedTable.name} (${selectedTable.zone})`,
        occasion: bookingState.occasion,
        specialRequests: bookingState.specialRequests,
        customerName: bookingState.customerName,
        customerPhone: bookingState.customerPhone,
        customerEmail: bookingState.customerEmail,
        preOrderedItems,
        preOrderTotal,
        depositPaid: 0,
        userId: user?.id || 'guest_' + Date.now()
      };

      try {
        const res = await bookTableReservation(payload);
        if (res.success && res.reservation) {
          sounds.success?.();
          lastReservation = res.reservation;
          currentStep = 5;
          showToast('🎉 Table reserved successfully!', 'success');
          renderModal();
        } else {
          showToast(res.message || 'Failed to book table. Please try again.', 'error');
          confirmBtn.disabled = false;
          confirmBtn.innerHTML = '🎉 Confirm Reservation';
        }
      } catch (err) {
        console.error('Error reserving table:', err);
        showToast('Server error while booking table', 'error');
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '🎉 Confirm Reservation';
      }
    });
  }

  // Step 5 Events: Pass Actions
  if (currentStep === 5 && lastReservation) {
    modalOverlay.querySelector('#tb-print-pass-btn')?.addEventListener('click', () => {
      window.print();
    });

    modalOverlay.querySelector('#tb-calendar-btn')?.addEventListener('click', () => {
      downloadICSFile(lastReservation);
      showToast('📅 Added reservation to calendar file!', 'success');
    });

    modalOverlay.querySelector('#tb-directions-btn')?.addEventListener('click', () => {
      const q = encodeURIComponent(`${lastReservation.restaurantName}, ${lastReservation.restaurantAddress}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
    });
  }
}

// Generate an SVG QR Code visual
function generateQRCodeSvg(text) {
  return `
    <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" style="border-radius: 8px; background: white; padding: 6px;">
      <!-- Corner Markers -->
      <rect x="10" y="10" width="30" height="30" fill="#0E1014" rx="4"/>
      <rect x="16" y="16" width="18" height="18" fill="white" rx="2"/>
      <rect x="20" y="20" width="10" height="10" fill="#FF6B00" rx="1"/>

      <rect x="90" y="10" width="30" height="30" fill="#0E1014" rx="4"/>
      <rect x="96" y="16" width="18" height="18" fill="white" rx="2"/>
      <rect x="100" y="20" width="10" height="10" fill="#FF6B00" rx="1"/>

      <rect x="10" y="90" width="30" height="30" fill="#0E1014" rx="4"/>
      <rect x="16" y="96" width="18" height="18" fill="white" rx="2"/>
      <rect x="20" y="100" width="10" height="10" fill="#FF6B00" rx="1"/>

      <!-- Matrix Patterns -->
      <rect x="48" y="15" width="6" height="6" fill="#0E1014"/>
      <rect x="58" y="15" width="6" height="6" fill="#0E1014"/>
      <rect x="68" y="15" width="6" height="6" fill="#0E1014"/>
      <rect x="48" y="25" width="6" height="6" fill="#0E1014"/>
      <rect x="68" y="25" width="6" height="6" fill="#FF6B00"/>

      <rect x="48" y="48" width="6" height="6" fill="#0E1014"/>
      <rect x="58" y="48" width="6" height="6" fill="#0E1014"/>
      <rect x="68" y="48" width="6" height="6" fill="#FF6B00"/>
      <rect x="78" y="48" width="6" height="6" fill="#0E1014"/>
      <rect x="88" y="48" width="6" height="6" fill="#0E1014"/>

      <rect x="15" y="48" width="6" height="6" fill="#0E1014"/>
      <rect x="25" y="48" width="6" height="6" fill="#0E1014"/>
      <rect x="15" y="58" width="6" height="6" fill="#FF6B00"/>
      <rect x="25" y="68" width="6" height="6" fill="#0E1014"/>

      <rect x="48" y="68" width="6" height="6" fill="#0E1014"/>
      <rect x="58" y="68" width="6" height="6" fill="#FF6B00"/>
      <rect x="68" y="68" width="6" height="6" fill="#0E1014"/>
      <rect x="78" y="68" width="6" height="6" fill="#0E1014"/>

      <rect x="48" y="88" width="6" height="6" fill="#0E1014"/>
      <rect x="58" y="88" width="6" height="6" fill="#0E1014"/>
      <rect x="68" y="88" width="6" height="6" fill="#0E1014"/>
      <rect x="78" y="88" width="6" height="6" fill="#FF6B00"/>
      <rect x="88" y="88" width="6" height="6" fill="#0E1014"/>

      <rect x="88" y="68" width="6" height="6" fill="#0E1014"/>
      <rect x="98" y="68" width="6" height="6" fill="#0E1014"/>
      <rect x="108" y="68" width="6" height="6" fill="#0E1014"/>
      <rect x="88" y="98" width="6" height="6" fill="#FF6B00"/>
      <rect x="98" y="98" width="6" height="6" fill="#0E1014"/>
      <rect x="108" y="98" width="6" height="6" fill="#0E1014"/>
    </svg>
  `;
}

// Generate .ics calendar download file
function downloadICSFile(res) {
  const startDate = `${res.date.replace(/-/g, '')}T190000`;
  const endDate = `${res.date.replace(/-/g, '')}T210000`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FoodDash Table Reservation//EN',
    'BEGIN:VEVENT',
    `SUMMARY:Dine-in at ${res.restaurantName} (Table: ${res.tableNames})`,
    `DESCRIPTION:FoodDash Reservation ID: ${res.id}\\nGuests: ${res.guests}\\nOccasion: ${res.occasion}`,
    `LOCATION:${res.restaurantAddress}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `Reservation-${res.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
