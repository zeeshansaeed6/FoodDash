// ============================================================
// FoodDash — Dedicated User Account, Address Book & Profile Page
// ============================================================
import { getCurrentUser, updateUserProfile, saveUserAddress, deleteUserAddress, saveUserSettings, onAuthChange } from '../api/client.js';
import { openLoginModal } from '../components/LoginModal.js';
import { showToast } from '../components/Toast.js';
import { getDashCoins } from '../components/CartState.js';

const AVATARS = ['👤', '🥑', '🍔', '🍕', '🧑‍🍳', '👑', '🚀', '🍣', '🌮', '🍩', '🦸', '🌟', '🦊', '☕'];

export function renderProfilePage(container, onNavigate, initialTab = 'profile') {
  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <div style="min-height: calc(100vh - var(--nav-h)); padding-top: var(--nav-h); display: flex; align-items: center; justify-content: center; background: var(--clr-bg);">
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-2xl); padding: 48px 36px; text-align: center; max-width: 480px; width: 90%; box-shadow: var(--shadow-xl);">
          <div style="font-size: 64px; margin-bottom: 16px;">🔐</div>
          <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 8px; color: white;">Sign in to View Account</h2>
          <p style="font-size: 14px; color: var(--clr-text-muted); margin: 0 0 24px; line-height: 1.5;">
            Access your saved delivery addresses, profile preferences, past orders, and DashCoins wallet.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-primary" id="btn-login-profile-page" style="padding: 12px 28px; border-radius: var(--radius-full); font-weight: 800;">
              🔑 Sign In / Register
            </button>
            <button class="btn btn-ghost" id="btn-back-home" style="padding: 12px 24px; border-radius: var(--radius-full);">
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    `;

    container.querySelector('#btn-login-profile-page')?.addEventListener('click', openLoginModal);
    container.querySelector('#btn-back-home')?.addEventListener('click', () => onNavigate('home'));
    return;
  }

  let activeTab = initialTab;

  container.innerHTML = `
    <div class="profile-page-container" style="min-height: calc(100vh - var(--nav-h)); padding-top: var(--nav-h); background: var(--clr-bg); color: var(--clr-text);">
      
      <!-- Profile Header Hero -->
      <div style="background: linear-gradient(135deg, rgba(255, 71, 87, 0.15), rgba(155, 93, 229, 0.15)); border-bottom: 1px solid var(--clr-border); padding: 40px 0 24px;">
        <div class="container">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
            
            <div style="display: flex; align-items: center; gap: 20px;">
              <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--clr-surface); border: 2px solid var(--clr-primary); display: flex; align-items: center; justify-content: center; font-size: 38px; box-shadow: 0 10px 25px rgba(255, 71, 87, 0.2);">
                ${user.avatar || '👤'}
              </div>
              <div>
                <h1 style="font-size: 26px; font-weight: 800; margin: 0; color: white;">${user.name}</h1>
                <div style="font-size: 13px; color: var(--clr-text-muted); margin-top: 4px;">
                  📱 ${user.phone ? '+91 ' + user.phone : user.email || 'Verified Member'} • 🪙 <b>${getDashCoins()} DashCoins</b>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn btn-ghost btn-sm" id="btn-profile-home" style="border-radius: var(--radius-full);">
                🛍️ Browse Restaurants
              </button>
            </div>
          </div>

          <!-- Tab Bar -->
          <div style="display: flex; gap: 8px; margin-top: 32px; border-bottom: 1px solid var(--clr-border); padding-bottom: 2px; overflow-x: auto;">
            <button class="profile-nav-tab active" data-tab="profile" style="padding: 12px 20px; font-size: 14px; font-weight: 700; background: transparent; border: none; color: var(--clr-primary); border-bottom: 3px solid var(--clr-primary); cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap;">
              <span>👤</span> Personal Information
            </button>
            <button class="profile-nav-tab" data-tab="reservations" style="padding: 12px 20px; font-size: 14px; font-weight: 700; background: transparent; border: none; color: var(--clr-text-muted); border-bottom: 3px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap;">
              <span>🍽️</span> My Dine-in Passes
            </button>
            <button class="profile-nav-tab" data-tab="addresses" style="padding: 12px 20px; font-size: 14px; font-weight: 700; background: transparent; border: none; color: var(--clr-text-muted); border-bottom: 3px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap;">
              <span>📍</span> Saved Addresses
            </button>
            <button class="profile-nav-tab" data-tab="preferences" style="padding: 12px 20px; font-size: 14px; font-weight: 700; background: transparent; border: none; color: var(--clr-text-muted); border-bottom: 3px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap;">
              <span>⚙️</span> Food Preferences & Dietary
            </button>
          </div>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="container" style="padding: 32px 0 80px;">
        <div id="profile-page-content" style="max-width: 760px; margin: 0 auto;">
          <!-- Content rendered dynamically -->
        </div>
      </div>
    </div>
  `;

  container.querySelector('#btn-profile-home')?.addEventListener('click', () => onNavigate('home'));

  function switchTab(tab) {
    activeTab = tab;
    container.querySelectorAll('.profile-nav-tab').forEach(btn => {
      const isActive = btn.dataset.tab === tab;
      btn.style.color = isActive ? 'var(--clr-primary)' : 'var(--clr-text-muted)';
      btn.style.borderBottomColor = isActive ? 'var(--clr-primary)' : 'transparent';
    });
    renderTab();
  }

  container.querySelectorAll('.profile-nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  async function renderTab() {
    const content = container.querySelector('#profile-page-content');
    if (!content) return;

    if (activeTab === 'profile') {
      content.innerHTML = `
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-md);">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 6px; color: white;">Personal Information</h2>
          <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0 0 24px;">Update your avatar, display name, and communication contacts.</p>

          <form id="edit-profile-form" style="display: flex; flex-direction: column; gap: 20px;">
            <!-- Avatar Picker -->
            <div>
              <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 10px;">Select Profile Avatar</label>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${AVATARS.map(av => `
                  <button type="button" class="avatar-option-btn ${av === (user.avatar || '👤') ? 'selected' : ''}" data-avatar="${av}" style="width: 44px; height: 44px; font-size: 22px; border-radius: 12px; background: ${av === (user.avatar || '👤') ? 'rgba(255, 71, 87, 0.2)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${av === (user.avatar || '👤') ? 'var(--clr-primary)' : 'var(--clr-border)'}; cursor: pointer; transition: all 0.2s;">
                    ${av}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">Full Name</label>
              <input type="text" id="prof-name" value="${user.name || ''}" required class="form-input" style="width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white; font-size: 14px;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div>
                <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">Mobile Number</label>
                <input type="tel" id="prof-phone" value="${user.phone || ''}" placeholder="10-digit number" class="form-input" style="width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white; font-size: 14px;" />
              </div>
              <div>
                <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">Email Address</label>
                <input type="email" id="prof-email" value="${user.email || ''}" placeholder="name@domain.com" class="form-input" style="width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white; font-size: 14px;" />
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="margin-top: 12px; border-radius: var(--radius-md); padding: 14px; font-weight: 800; font-size: 15px; cursor: pointer;">
              💾 Save Changes
            </button>
          </form>
        </div>
      `;

      let selectedAvatar = user.avatar || '👤';
      content.querySelectorAll('.avatar-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          content.querySelectorAll('.avatar-option-btn').forEach(b => {
            b.style.border = '1px solid var(--clr-border)';
            b.style.background = 'rgba(255,255,255,0.05)';
          });
          btn.style.border = '1px solid var(--clr-primary)';
          btn.style.background = 'rgba(255, 71, 87, 0.2)';
          selectedAvatar = btn.dataset.avatar;
        });
      });

      content.querySelector('#edit-profile-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = content.querySelector('#prof-name').value;
        const phone = content.querySelector('#prof-phone').value;
        const email = content.querySelector('#prof-email').value;

        const res = await updateUserProfile({ name, phone, email, avatar: selectedAvatar });
        if (res.success) {
          showToast('Profile updated successfully! ✨', '👤');
          renderProfilePage(container, onNavigate, 'profile');
        } else {
          showToast(res.message || 'Could not update profile', '⚠️');
        }
      });

    } else if (activeTab === 'addresses') {
      const addresses = user.addresses || [
        { id: 'addr_1', type: 'home', tag: 'Home', address: 'Flat 402, Skyline Heights, Banjara Hills, Hyderabad', isDefault: true },
        { id: 'addr_2', type: 'work', tag: 'Office', address: 'Cyber Towers, HITEC City, Hyderabad', isDefault: false }
      ];

      content.innerHTML = `
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 4px; color: white;">Saved Delivery Addresses</h2>
              <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0;">Manage rapid 1-click delivery drop destinations.</p>
            </div>
            <button class="btn btn-primary btn-sm" id="btn-add-new-address" style="border-radius: var(--radius-full); font-weight: 700; font-size: 12px; padding: 8px 16px;">
              ➕ Add New Address
            </button>
          </div>

          <div id="address-form-box" style="display: none; background: rgba(0,0,0,0.3); border: 1px dashed var(--clr-border); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 24px;">
            <h3 style="font-size: 15px; font-weight: 800; margin: 0 0 12px;">Add Delivery Location</h3>
            <form id="new-addr-form" style="display: flex; flex-direction: column; gap: 12px;">
              <input type="text" id="new-addr-tag" placeholder="Label (e.g. Home, Work, Friend's Place)" required style="width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white;" />
              <textarea id="new-addr-text" rows="2" placeholder="Full door/street address and landmarks" required style="width: 100%; padding: 10px 14px; background: rgba(255,255,255,0.05); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white;"></textarea>
              <div style="display: flex; gap: 10px;">
                <button type="submit" class="btn btn-primary btn-sm" style="border-radius: var(--radius-md); font-weight: 700;">Save Address</button>
                <button type="button" id="btn-cancel-addr" class="btn btn-ghost btn-sm">Cancel</button>
              </div>
            </form>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${addresses.map(addr => `
              <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 18px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; gap: 14px; align-items: flex-start;">
                  <div style="font-size: 24px;">${addr.type === 'work' ? '🏢' : '🏠'}</div>
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 800; font-size: 15px;">${addr.tag || 'Address'}</span>
                      ${addr.isDefault ? `<span style="background: rgba(34, 197, 94, 0.2); color: #4ade80; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">DEFAULT</span>` : ''}
                    </div>
                    <div style="font-size: 13px; color: var(--clr-text-muted); margin-top: 4px;">${addr.address}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const formBox = content.querySelector('#address-form-box');
      content.querySelector('#btn-add-new-address')?.addEventListener('click', () => {
        formBox.style.display = formBox.style.display === 'none' ? 'block' : 'none';
      });
      content.querySelector('#btn-cancel-addr')?.addEventListener('click', () => {
        formBox.style.display = 'none';
      });
      content.querySelector('#new-addr-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const tag = content.querySelector('#new-addr-tag').value;
        const address = content.querySelector('#new-addr-text').value;
        await saveUserAddress({ tag, address, type: 'home' });
        showToast('Address added to your account 📍', '📍');
        renderProfilePage(container, onNavigate, 'addresses');
      });

    } else if (activeTab === 'reservations') {
      let reservations = [];
      try {
        const res = await fetch(`/api/reservations/user?userId=${user.id}&phone=${user.phone || ''}`);
        const data = await res.json();
        reservations = data.reservations || [];
      } catch (e) {
        reservations = [];
      }

      if (reservations.length === 0) {
        content.innerHTML = `
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 50px 24px; text-align: center;">
            <div style="font-size: 52px; margin-bottom: 12px;">🍷</div>
            <h3 style="font-size: 18px; font-weight: 800; color: white; margin: 0 0 6px;">No Upcoming Table Bookings</h3>
            <p style="font-size: 13px; color: var(--clr-text-muted); max-width: 440px; margin: 0 auto 20px;">
              Reserve VIP booths, window couple tables, and pre-order chef specials at any of your favorite restaurants.
            </p>
            <button class="btn btn-primary" id="btn-explore-dinein" style="border-radius: var(--radius-full); padding: 10px 24px; font-weight: 700;">
              🍽️ Explore Dine-in Restaurants
            </button>
          </div>
        `;
        content.querySelector('#btn-explore-dinein')?.addEventListener('click', () => onNavigate('home'));
        return;
      }

      content.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h2 style="font-size: 20px; font-weight: 800; margin: 0; color: white;">My Dine-in Passes (${reservations.length})</h2>
              <p style="font-size: 13px; color: var(--clr-text-muted); margin: 2px 0 0;">Show these digital passes upon arrival at the restaurant</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-refresh-user-res" style="border-radius: var(--radius-full);">
              🔄 Refresh
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${reservations.map(res => `
              <div style="background: var(--clr-surface); border: 1px solid ${res.status === 'confirmed' ? 'rgba(59,130,246,0.5)' : res.status === 'seated' ? '#10b981' : 'var(--clr-border)'}; border-radius: var(--radius-xl); padding: 22px; box-shadow: var(--shadow-md);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
                  <div>
                    <div style="font-size: 18px; font-weight: 800; color: white;">${res.restaurantName}</div>
                    <div style="font-size: 12px; color: var(--clr-text-muted);">📍 ${res.restaurantAddress}</div>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: var(--clr-primary);">${res.id}</span>
                    <span style="display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${res.status === 'confirmed' ? '#60a5fa' : res.status === 'seated' ? '#4ade80' : '#ef4444'};">
                      ● ${res.status}
                    </span>
                  </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); margin-bottom: 14px;">
                  <div>
                    <span style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Date</span>
                    <div style="font-size: 13px; font-weight: 700; color: white;">📅 ${res.date}</div>
                  </div>
                  <div>
                    <span style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Time Slot</span>
                    <div style="font-size: 13px; font-weight: 700; color: white;">⏰ ${res.timeSlot}</div>
                  </div>
                  <div>
                    <span style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Party Size</span>
                    <div style="font-size: 13px; font-weight: 700; color: white;">👥 ${res.guests} Persons</div>
                  </div>
                  <div>
                    <span style="font-size: 10px; color: var(--clr-text-muted); text-transform: uppercase;">Reserved Spot</span>
                    <div style="font-size: 13px; font-weight: 700; color: var(--clr-primary);">🪑 ${res.tableNames}</div>
                  </div>
                </div>

                ${res.preOrderedItems && res.preOrderedItems.length > 0 ? `
                  <div style="background: rgba(255,107,0,0.05); border: 1px dashed rgba(255,107,0,0.2); border-radius: var(--radius-md); padding: 10px 14px; margin-bottom: 14px;">
                    <span style="font-size: 11px; font-weight: 700; color: var(--clr-primary); text-transform: uppercase;">Pre-Ordered Chef Express Dishes:</span>
                    <div style="font-size: 12px; color: #cbd5e1; margin-top: 4px;">
                      ${res.preOrderedItems.map(it => `${it.quantity}x ${it.name}`).join(' • ')} (₹${res.preOrderTotal})
                    </div>
                  </div>
                ` : ''}

                <div style="display: flex; gap: 10px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
                  <button class="btn btn-secondary btn-sm btn-get-dir" data-addr="${encodeURIComponent(res.restaurantName + ', ' + res.restaurantAddress)}" style="border-radius: var(--radius-full); font-size: 12px;">
                    📍 Get Directions
                  </button>
                  ${res.status === 'confirmed' ? `
                    <button class="btn btn-sm btn-cancel-res" data-id="${res.id}" style="border-radius: var(--radius-full); font-size: 12px; background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); font-weight: 700; padding: 6px 14px;">
                      ✕ Cancel Reservation
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      content.querySelector('#btn-refresh-user-res')?.addEventListener('click', () => renderProfilePage(container, onNavigate, 'reservations'));
      content.querySelectorAll('.btn-get-dir').forEach(btn => {
        btn.addEventListener('click', () => {
          window.open(`https://www.google.com/maps/search/?api=1&query=${btn.dataset.addr}`, '_blank');
        });
      });
      content.querySelectorAll('.btn-cancel-res').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('Are you sure you want to cancel this table reservation?')) {
            const resId = btn.dataset.id;
            try {
              const r = await fetch(`/api/reservations/${resId}/cancel`, { method: 'PATCH' });
              const d = await r.json();
              if (d.success) {
                showToast('Table reservation cancelled', 'info');
                renderProfilePage(container, onNavigate, 'reservations');
              }
            } catch (err) {
              showToast('Error cancelling reservation', 'error');
            }
          }
        });
      });

    } else if (activeTab === 'preferences') {
      content.innerHTML = `
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-md);">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 6px; color: white;">Food Preferences & Dietary Filters</h2>
          <p style="font-size: 13px; color: var(--clr-text-muted); margin: 0 0 24px;">Customize what dishes and recommendations you see across FoodDash.</p>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <label style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); cursor: pointer;">
              <div>
                <div style="font-weight: 700; font-size: 14px;">🟢 Pure Vegetarian Mode</div>
                <div style="font-size: 12px; color: var(--clr-text-muted);">Only show green-leaf certified vegetarian dishes</div>
              </div>
              <input type="checkbox" id="pref-veg" style="width: 20px; height: 20px; accent-color: var(--clr-primary);" />
            </label>

            <label style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); cursor: pointer;">
              <div>
                <div style="font-weight: 700; font-size: 14px;">🌶️ Extra Spicy Tolerance</div>
                <div style="font-size: 12px; color: var(--clr-text-muted);">Include spicy street delicacies and fiery curries</div>
              </div>
              <input type="checkbox" id="pref-spicy" checked style="width: 20px; height: 20px; accent-color: var(--clr-primary);" />
            </label>

            <label style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); cursor: pointer;">
              <div>
                <div style="font-weight: 700; font-size: 14px;">🍃 Eco-Friendly Cutlery Opt-out</div>
                <div style="font-size: 12px; color: var(--clr-text-muted);">Do not send plastic spoons or tissues with orders</div>
              </div>
              <input type="checkbox" id="pref-eco" checked style="width: 20px; height: 20px; accent-color: var(--clr-primary);" />
            </label>

            <button class="btn btn-primary" id="btn-save-prefs" style="margin-top: 10px; border-radius: var(--radius-md); padding: 14px; font-weight: 800; font-size: 14px;">
              💾 Save Dietary Preferences
            </button>
          </div>
        </div>
      `;

      content.querySelector('#btn-save-prefs')?.addEventListener('click', () => {
        showToast('Food preferences saved successfully! 🍃', '⚙️');
      });
    }
  }

  renderTab();
}
