// ============================================================
// FoodDash — User Profile, Address Book & Settings Modal
// ============================================================
import { getCurrentUser, updateUserProfile, saveUserAddress, updateUserAddress, deleteUserAddress, saveUserSettings, onAuthChange } from '../api/client.js';
import { openLoginModal } from './LoginModal.js';
import { showToast } from './Toast.js';
import { getActiveLocation } from './LocationModal.js';

let profileModalEl = null;
let activeTab = 'profile'; // 'profile' | 'addresses' | 'settings'

const AVATARS = ['👤', '🥑', '🍔', '🍕', '🧑‍🍳', '👑', '🚀', '🍣', '🌮', '🍩', '🦸', '🌟', '🦊', '☕'];

export function createProfileModal() {
  if (document.getElementById('profile-modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'profile-modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.style.display = 'none';

  overlay.innerHTML = `
    <div class="modal-dialog" style="max-width: 680px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
      <!-- Modal Header -->
      <div class="modal-header" style="padding: 16px 24px; border-bottom: 1px solid var(--clr-border); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;" id="profile-header-avatar">👤</span>
          <div>
            <h2 style="font-size: 18px; font-weight: 700; margin: 0;" id="profile-header-name">My Account</h2>
            <div style="font-size: 12px; color: var(--clr-text-muted);" id="profile-header-sub">Manage your profile, saved addresses & settings</div>
          </div>
        </div>
        <button class="modal-close-btn" id="close-profile-modal-btn" aria-label="Close Profile Modal">&times;</button>
      </div>

      <!-- Navigation Tabs -->
      <div style="display: flex; border-bottom: 1px solid var(--clr-border); background: rgba(255,255,255,0.02); padding: 0 16px;">
        <button class="profile-tab-btn active" data-tab="profile" id="tab-btn-profile" style="padding: 12px 18px; border: none; background: transparent; font-weight: 600; font-size: 13px; color: var(--clr-primary); border-bottom: 2px solid var(--clr-primary); cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <span>👤</span> Personal Info
        </button>
        <button class="profile-tab-btn" data-tab="addresses" id="tab-btn-addresses" style="padding: 12px 18px; border: none; background: transparent; font-weight: 600; font-size: 13px; color: var(--clr-text-muted); border-bottom: 2px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <span>📍</span> Saved Addresses
        </button>
        <button class="profile-tab-btn" data-tab="settings" id="tab-btn-settings" style="padding: 12px 18px; border: none; background: transparent; font-weight: 600; font-size: 13px; color: var(--clr-text-muted); border-bottom: 2px solid transparent; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          <span>⚙️</span> Preferences
        </button>
      </div>

      <!-- Modal Body (Scrollable) -->
      <div id="profile-modal-content" style="padding: 24px; overflow-y: auto; flex: 1;">
        <!-- Tab contents rendered here -->
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  profileModalEl = overlay;

  bindProfileEvents();
  onAuthChange(() => {
    if (profileModalEl && profileModalEl.style.display !== 'none') {
      renderActiveTab();
    }
  });
}

function bindProfileEvents() {
  if (!profileModalEl) return;

  profileModalEl.querySelector('#close-profile-modal-btn')?.addEventListener('click', closeProfileModal);
  profileModalEl.addEventListener('click', (e) => {
    if (e.target === profileModalEl) closeProfileModal();
  });

  // Tab switching
  profileModalEl.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

export function openProfileModal(initialTab = 'profile') {
  const user = getCurrentUser();
  if (!user) {
    openLoginModal();
    showToast('Please sign in to view your profile and saved addresses 🔐', '👤');
    return;
  }

  if (!profileModalEl) createProfileModal();
  profileModalEl.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  switchTab(initialTab);
}

export function closeProfileModal() {
  if (profileModalEl) {
    profileModalEl.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function switchTab(tabName) {
  activeTab = tabName;

  // Update tabs UI
  profileModalEl.querySelectorAll('.profile-tab-btn').forEach(btn => {
    const isThis = btn.dataset.tab === tabName;
    btn.style.color = isThis ? 'var(--clr-primary)' : 'var(--clr-text-muted)';
    btn.style.borderBottomColor = isThis ? 'var(--clr-primary)' : 'transparent';
  });

  renderActiveTab();
}

function renderActiveTab() {
  const user = getCurrentUser();
  const contentEl = profileModalEl.querySelector('#profile-modal-content');
  if (!contentEl || !user) return;

  // Update Header
  const avatarEl = profileModalEl.querySelector('#profile-header-avatar');
  const nameEl = profileModalEl.querySelector('#profile-header-name');
  const subEl = profileModalEl.querySelector('#profile-header-sub');
  if (avatarEl) avatarEl.textContent = user.avatar || '👤';
  if (nameEl) nameEl.textContent = user.name || 'My Account';
  if (subEl) subEl.textContent = user.phone ? `+91 ${user.phone}` : user.email || 'FoodDash Member';

  if (activeTab === 'profile') {
    renderProfileTab(contentEl, user);
  } else if (activeTab === 'addresses') {
    renderAddressesTab(contentEl, user);
  } else if (activeTab === 'settings') {
    renderSettingsTab(contentEl, user);
  }
}

// ----------------- 1. Profile Tab -----------------
function renderProfileTab(container, user) {
  container.innerHTML = `
    <form id="profile-edit-form" style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Avatar Selection -->
      <div>
        <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Choose Your Avatar</label>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; padding: 10px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md);">
          ${AVATARS.map(av => `
            <button type="button" class="avatar-option-btn ${user.avatar === av ? 'selected' : ''}" data-avatar="${av}" style="width: 38px; height: 38px; font-size: 20px; border-radius: 50%; border: 2px solid ${user.avatar === av ? 'var(--clr-primary)' : 'transparent'}; background: ${user.avatar === av ? 'rgba(235, 50, 35, 0.15)' : 'rgba(255,255,255,0.05)'}; cursor: pointer; transition: transform 0.15s;">
              ${av}
            </button>
          `).join('')}
        </div>
        <input type="hidden" id="edit-avatar-val" value="${user.avatar || '👤'}" />
      </div>

      <!-- Name & Contact -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <div class="form-group">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Full Name</label>
          <input type="text" class="input-field" id="edit-profile-name" value="${user.name || ''}" placeholder="Your Full Name" required style="width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
        </div>

        <div class="form-group">
          <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Mobile Number</label>
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 13px; color: var(--clr-text-muted); background: rgba(255,255,255,0.05); padding: 10px 12px; border: 1px solid var(--clr-border); border-radius: var(--radius-md);">+91</span>
            <input type="tel" class="input-field" id="edit-profile-phone" value="${user.phone || ''}" placeholder="10-digit number" maxlength="10" style="flex: 1; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px;">Email Address</label>
        <input type="email" class="input-field" id="edit-profile-email" value="${user.email || ''}" placeholder="name@example.com" style="width: 100%; padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
      </div>

      <!-- Account Stats Card -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 8px;">
        <div style="padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 18px; font-weight: 800; color: var(--clr-primary);">${user.addresses?.length || 0}</div>
          <div style="font-size: 11px; color: var(--clr-text-muted);">Saved Addresses</div>
        </div>
        <div style="padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 18px; font-weight: 800; color: #00e676;">Active</div>
          <div style="font-size: 11px; color: var(--clr-text-muted);">Zomato Gold Club</div>
        </div>
        <div style="padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 18px; font-weight: 800; color: #ffb300;">₹450</div>
          <div style="font-size: 11px; color: var(--clr-text-muted);">Savings in Offers</div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;">
        <button type="submit" class="btn btn-primary" id="save-profile-btn" style="padding: 10px 24px; border-radius: var(--radius-md);">
          💾 Save Changes
        </button>
      </div>
    </form>
  `;

  // Avatar select interaction
  container.querySelectorAll('.avatar-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.avatar-option-btn').forEach(b => {
        b.style.border = '2px solid transparent';
        b.style.background = 'rgba(255,255,255,0.05)';
      });
      btn.style.border = '2px solid var(--clr-primary)';
      btn.style.background = 'rgba(235, 50, 35, 0.15)';
      container.querySelector('#edit-avatar-val').value = btn.dataset.avatar;
    });
  });

  // Submit Handler
  container.querySelector('#profile-edit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = container.querySelector('#save-profile-btn');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    const name = container.querySelector('#edit-profile-name').value;
    const phone = container.querySelector('#edit-profile-phone').value;
    const email = container.querySelector('#edit-profile-email').value;
    const avatar = container.querySelector('#edit-avatar-val').value;

    const res = await updateUserProfile({ name, phone, email, avatar });
    btn.disabled = false;
    btn.textContent = '💾 Save Changes';

    if (res.success) {
      showToast('Profile updated successfully! ✨', '✅');
      renderActiveTab();
    } else {
      showToast(res.message || 'Error updating profile', '⚠️');
    }
  });
}

// ----------------- 2. Saved Addresses Tab -----------------
function renderAddressesTab(container, user) {
  const addresses = user.addresses || [];
  const currentLoc = getActiveLocation();

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="font-size: 15px; font-weight: 700; margin: 0;">Your Saved Delivery Addresses</h3>
          <p style="font-size: 12px; color: var(--clr-text-muted); margin: 2px 0 0 0;">Manage your delivery locations for fast 1-click checkout</p>
        </div>
        <button class="btn btn-primary btn-sm" id="btn-show-add-address" style="padding: 8px 16px; border-radius: var(--radius-full); font-size: 12px;">
          ➕ Add New Address
        </button>
      </div>

      <!-- Add / Edit Address Form (Hidden by default) -->
      <div id="address-form-box" style="display: none; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-primary); border-radius: var(--radius-lg); padding: 18px;">
        <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 12px;" id="address-form-title">➕ Add Delivery Address</h4>
        <form id="address-editor-form" style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Label tags -->
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px;">Save As</label>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="addr-label-chip selected" data-label="Home" style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); border: 1px solid var(--clr-primary); background: rgba(235,50,35,0.15); color: white; cursor: pointer;">🏠 Home</button>
              <button type="button" class="addr-label-chip" data-label="Work" style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); border: 1px solid var(--clr-border); background: transparent; color: var(--clr-text-muted); cursor: pointer;">💼 Work</button>
              <button type="button" class="addr-label-chip" data-label="Friends" style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); border: 1px solid var(--clr-border); background: transparent; color: var(--clr-text-muted); cursor: pointer;">👥 Friends</button>
              <button type="button" class="addr-label-chip" data-label="Other" style="padding: 6px 14px; font-size: 12px; border-radius: var(--radius-full); border: 1px solid var(--clr-border); background: transparent; color: var(--clr-text-muted); cursor: pointer;">📍 Other</button>
            </div>
            <input type="hidden" id="addr-label-val" value="Home" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label style="display: block; font-size: 12px; margin-bottom: 4px;">Flat / House / Building No.</label>
              <input type="text" id="addr-house-no" class="input-field" placeholder="e.g. Flat 402, Sunshine Heights" required style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 12px; margin-bottom: 4px;">Street / Area / Locality</label>
              <input type="text" id="addr-area" class="input-field" placeholder="e.g. 100ft Road, Indiranagar" required value="${currentLoc.area || ''}" style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
            <div class="form-group">
              <label style="display: block; font-size: 12px; margin-bottom: 4px;">City</label>
              <input type="text" id="addr-city" class="input-field" placeholder="e.g. Bangalore" required value="${currentLoc.cityName || 'Bangalore'}" style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 12px; margin-bottom: 4px;">Pincode</label>
              <input type="text" id="addr-pincode" class="input-field" placeholder="e.g. 560038" maxlength="6" style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 12px; margin-bottom: 4px;">Landmark (Optional)</label>
              <input type="text" id="addr-landmark" class="input-field" placeholder="e.g. Near Metro Pillar 42" style="width: 100%; padding: 8px 12px; font-size: 13px; border-radius: var(--radius-sm); border: 1px solid var(--clr-border); background: var(--clr-bg-input);" />
            </div>
          </div>

          <label style="display: flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer;">
            <input type="checkbox" id="addr-is-default" checked /> Set as default delivery address
          </label>

          <div style="display: flex; justify-content: flex-end; gap: 8px;">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-cancel-address" style="padding: 6px 16px;">Cancel</button>
            <button type="submit" class="btn btn-primary btn-sm" id="btn-save-address" style="padding: 6px 20px;">Save Address</button>
          </div>
        </form>
      </div>

      <!-- Address List -->
      <div id="saved-address-list" style="display: flex; flex-direction: column; gap: 12px;">
        ${addresses.length === 0 ? `
          <div style="text-align: center; padding: 36px 20px; background: rgba(255,255,255,0.02); border: 1px dashed var(--clr-border); border-radius: var(--radius-lg);">
            <div style="font-size: 36px; margin-bottom: 8px;">📍</div>
            <h4 style="font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">No Saved Addresses Yet</h4>
            <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0 0 16px 0;">Add your home or office address for quicker doorstep deliveries</p>
            <button class="btn btn-outline btn-sm" id="btn-empty-add-addr" style="border-radius: var(--radius-full);">+ Add Your First Address</button>
          </div>
        ` : addresses.map(addr => `
          <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid ${addr.isDefault ? 'var(--clr-primary)' : 'var(--clr-border)'}; border-radius: var(--radius-md); display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;">
            <div style="display: flex; gap: 12px; align-items: flex-start;">
              <span style="font-size: 24px; padding: 6px; background: rgba(255,255,255,0.05); border-radius: var(--radius-sm);">${addr.icon || (addr.label === 'Work' ? '💼' : '🏠')}</span>
              <div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                  <span style="font-weight: 700; font-size: 14px;">${addr.label}</span>
                  ${addr.isDefault ? `<span style="font-size: 10px; font-weight: bold; background: var(--clr-primary); color: white; padding: 2px 8px; border-radius: var(--radius-full);">DEFAULT</span>` : ''}
                </div>
                <div style="font-size: 13px; line-height: 1.4; color: var(--clr-text);">
                  ${addr.houseNo ? `${addr.houseNo}, ` : ''}${addr.street ? `${addr.street}, ` : ''}${addr.area}, ${addr.city} ${addr.pincode ? `- ${addr.pincode}` : ''}
                </div>
                ${addr.landmark ? `<div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 2px;">📍 Landmark: ${addr.landmark}</div>` : ''}
              </div>
            </div>

            <div style="display: flex; gap: 6px;">
              ${!addr.isDefault ? `
                <button class="btn btn-ghost btn-sm set-default-addr-btn" data-id="${addr.id}" title="Set as default" style="font-size: 11px; padding: 4px 8px;">
                  ⭐ Default
                </button>
              ` : ''}
              <button class="btn btn-ghost btn-sm delete-addr-btn" data-id="${addr.id}" title="Delete address" style="color: #ff5252; font-size: 12px; padding: 4px 8px;">
                🗑️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Toggle Add Form
  const formBox = container.querySelector('#address-form-box');
  const showFormBtn = container.querySelector('#btn-show-add-address');
  const emptyAddBtn = container.querySelector('#btn-empty-add-addr');
  const cancelBtn = container.querySelector('#btn-cancel-address');

  function openAddressForm() {
    formBox.style.display = 'block';
    formBox.scrollIntoView({ behavior: 'smooth' });
  }

  showFormBtn?.addEventListener('click', openAddressForm);
  emptyAddBtn?.addEventListener('click', openAddressForm);
  cancelBtn?.addEventListener('click', () => {
    formBox.style.display = 'none';
  });

  // Label chips interaction
  container.querySelectorAll('.addr-label-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.addr-label-chip').forEach(c => {
        c.style.border = '1px solid var(--clr-border)';
        c.style.background = 'transparent';
        c.style.color = 'var(--clr-text-muted)';
      });
      chip.style.border = '1px solid var(--clr-primary)';
      chip.style.background = 'rgba(235,50,35,0.15)';
      chip.style.color = 'white';
      container.querySelector('#addr-label-val').value = chip.dataset.label;
    });
  });

  // Save Address Form Submit
  container.querySelector('#address-editor-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = container.querySelector('#btn-save-address');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const payload = {
      label: container.querySelector('#addr-label-val').value,
      houseNo: container.querySelector('#addr-house-no').value,
      area: container.querySelector('#addr-area').value,
      city: container.querySelector('#addr-city').value,
      pincode: container.querySelector('#addr-pincode').value,
      landmark: container.querySelector('#addr-landmark').value,
      isDefault: container.querySelector('#addr-is-default').checked
    };

    const res = await saveUserAddress(payload);
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Address';

    if (res.success) {
      showToast('Address saved to your address book! 🏠', '📍');
      renderActiveTab();
    } else {
      showToast(res.message || 'Error saving address', '⚠️');
    }
  });

  // Set as default listener
  container.querySelectorAll('.set-default-addr-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      await updateUserAddress(id, { isDefault: true });
      showToast('Default delivery address updated ⭐', '📍');
      renderActiveTab();
    });
  });

  // Delete listener
  container.querySelectorAll('.delete-addr-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to remove this address?')) {
        const id = btn.dataset.id;
        await deleteUserAddress(id);
        showToast('Address removed', '🗑️');
        renderActiveTab();
      }
    });
  });
}

// ----------------- 3. Preferences & Settings Tab -----------------
function renderSettingsTab(container, user) {
  const settings = user.settings || { 
    vegOnly: false, 
    vegan: false,
    keto: false,
    glutenFree: false,
    halal: false,
    jain: false,
    highProtein: false,
    noCutleryDefault: true,
    contactlessDefault: false,
    notifications: true, 
    smsUpdates: true, 
    darkMode: true 
  };

  const dietTags = [
    { id: 'pref-veg', key: 'vegOnly', label: '🥗 Pure Veg', desc: '100% Vegetarian only' },
    { id: 'pref-vegan', key: 'vegan', label: '🌱 100% Vegan', desc: 'Plant-based dairy-free' },
    { id: 'pref-keto', key: 'keto', label: '🥑 Keto / Low Carb', desc: 'High healthy fats' },
    { id: 'pref-protein', key: 'highProtein', label: '💪 High Protein', desc: 'Gym & workout focus' },
    { id: 'pref-gluten', key: 'glutenFree', label: '🌾 Gluten-Free', desc: 'Zero wheat/gluten' },
    { id: 'pref-halal', key: 'halal', label: '✨ Halal Certified', desc: '100% Halal meats' },
    { id: 'pref-jain', key: 'jain', label: '🧄 Jain Friendly', desc: 'No onion, garlic or root veg' }
  ];

  container.innerHTML = `
    <form id="settings-form" style="display: flex; flex-direction: column; gap: 20px;">
      <!-- Dietary & Lifestyle Badges -->
      <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md);">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">🥦 Dietary & Food Lifestyle Badges</h4>
        <p style="font-size: 11px; color: var(--clr-text-muted); margin-bottom: 12px;">Tag your personal preferences to filter menus and get tailored recommendations automatically.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px;">
          ${dietTags.map(tag => `
            <label style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border); border-radius: var(--radius-sm); cursor: pointer;">
              <div>
                <div style="font-size: 12px; font-weight: 600; color: white;">${tag.label}</div>
                <div style="font-size: 10px; color: var(--clr-text-muted);">${tag.desc}</div>
              </div>
              <input type="checkbox" id="${tag.id}" ${settings[tag.key] ? 'checked' : ''} style="accent-color: var(--clr-primary);" />
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Eco & Delivery Preferences -->
      <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md);">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">🌿 Eco-Saver & Delivery Defaults</h4>
        
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 13px; font-weight: 600;">🌿 Eco-Warrior: Don't send plastic cutlery by default</div>
              <div style="font-size: 11px; color: var(--clr-text-muted);">Save plastic waste with every meal order</div>
            </div>
            <input type="checkbox" id="pref-eco-cutlery" ${settings.noCutleryDefault !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--clr-primary);" />
          </label>

          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 13px; font-weight: 600;">🚪 Contactless Doorstep Drop-off by default</div>
              <div style="font-size: 11px; color: var(--clr-text-muted);">Rider leaves parcel at your doorstep and snaps a delivery photo</div>
            </div>
            <input type="checkbox" id="pref-contactless" ${settings.contactlessDefault ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--clr-primary);" />
          </label>
        </div>
      </div>

      <!-- Notifications & Updates -->
      <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md);">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">🔔 Notifications & Live Updates</h4>
        
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 13px; font-weight: 600;">WhatsApp Live Order Tracking</div>
              <div style="font-size: 11px; color: var(--clr-text-muted);">Receive live rider dispatch and arrival links on WhatsApp</div>
            </div>
            <input type="checkbox" id="pref-whatsapp" ${settings.notifications !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--clr-primary);" />
          </label>

          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-size: 13px; font-weight: 600;">SMS Delivery Alerts</div>
              <div style="font-size: 11px; color: var(--clr-text-muted);">Real-time OTP and contactless delivery notifications</div>
            </div>
            <input type="checkbox" id="pref-sms" ${settings.smsUpdates !== false ? 'checked' : ''} style="width: 18px; height: 18px; accent-color: var(--clr-primary);" />
          </label>
        </div>
      </div>

      <!-- App Sounds -->
      <div style="padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--clr-border); border-radius: var(--radius-md);">
        <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">🎵 Audio & Sound Feedback</h4>
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
          <div>
            <div style="font-size: 13px; font-weight: 600;">Interactive UI Sound Effects</div>
            <div style="font-size: 11px; color: var(--clr-text-muted);">Play audio chime on adding dishes, applying coupons, and order delivery</div>
          </div>
          <input type="checkbox" id="pref-sounds" checked style="width: 18px; height: 18px; accent-color: var(--clr-primary);" />
        </label>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button type="submit" class="btn btn-primary" id="btn-save-settings" style="padding: 10px 24px; border-radius: var(--radius-md);">
          💾 Save Preferences
        </button>
      </div>
    </form>
  `;

  // Save Settings Submit
  container.querySelector('#settings-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = container.querySelector('#btn-save-settings');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    const payload = {
      vegOnly: container.querySelector('#pref-veg')?.checked || false,
      vegan: container.querySelector('#pref-vegan')?.checked || false,
      keto: container.querySelector('#pref-keto')?.checked || false,
      highProtein: container.querySelector('#pref-protein')?.checked || false,
      glutenFree: container.querySelector('#pref-gluten')?.checked || false,
      halal: container.querySelector('#pref-halal')?.checked || false,
      jain: container.querySelector('#pref-jain')?.checked || false,
      noCutleryDefault: container.querySelector('#pref-eco-cutlery')?.checked || false,
      contactlessDefault: container.querySelector('#pref-contactless')?.checked || false,
      notifications: container.querySelector('#pref-whatsapp')?.checked || false,
      smsUpdates: container.querySelector('#pref-sms')?.checked || false
    };

    const res = await saveUserSettings(payload);
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 Save Preferences';

    if (res.success) {
      showToast('Your preferences & lifestyle badges have been saved! ⚙️', '✅');
      renderActiveTab();
    } else {
      showToast(res.message || 'Error saving settings', '⚠️');
    }
  });
}
