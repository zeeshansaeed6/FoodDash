// ============================================================
// FoodDash — Delivery Partner & Rider Self-Registration Modal
// ============================================================
import { showToast } from './Toast.js';
import { registerDeliveryRider } from '../api/client.js';

let registerModalEl = null;
let onRegisteredCb = null;

export function openRiderRegisterModal(onSuccess) {
  onRegisteredCb = onSuccess;

  const existing = document.getElementById('rider-register-modal-overlay');
  if (existing) existing.remove();

  registerModalEl = document.createElement('div');
  registerModalEl.className = 'login-overlay active';
  registerModalEl.id = 'rider-register-modal-overlay';

  registerModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Modal Header -->
      <div style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); position: relative;">
        <button id="rider-reg-close" style="position: absolute; right: 20px; top: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">✕</button>
        <div style="display: flex; align-items: center; gap: 14px;">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);">
            🛵
          </div>
          <div>
            <div style="font-size: 11px; font-weight: 800; color: #4ade80; text-transform: uppercase; letter-spacing: 0.5px;">FoodDash Delivery Fleet</div>
            <h2 style="font-size: 20px; font-weight: 800; margin: 2px 0 0; color: white;">Rider Self-Registration & Onboarding</h2>
          </div>
        </div>
      </div>

      <!-- Modal Body Form -->
      <div style="flex: 1; overflow-y: auto; padding: 22px 26px;">
        <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 20px;">🎁</span>
          <div style="font-size: 12px; color: #86efac;">
            <b>₹500 Welcome Joining Bonus</b> instantly credited to your wallet upon onboarding!
          </div>
        </div>

        <form id="rider-registration-form" style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Personal Info -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Full Name *</label>
              <input type="text" id="reg-name" placeholder="e.g. Aarav Sharma" required class="login-modal__input" style="width: 100%; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Phone Number *</label>
              <input type="tel" id="reg-phone" placeholder="e.g. +91 98765 12345" required class="login-modal__input" style="width: 100%; font-size: 13px;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Email Address</label>
              <input type="email" id="reg-email" placeholder="e.g. rider@example.com" class="login-modal__input" style="width: 100%; font-size: 13px;" />
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Operating City *</label>
              <select id="reg-city" class="login-modal__input" style="width: 100%; font-size: 13px; background: var(--clr-surface); color: white;">
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Goa">Goa</option>
                <option value="Dubai">Dubai</option>
              </select>
            </div>
          </div>

          <!-- Zone / Area -->
          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Preferred Hub / Neighborhood Zone</label>
            <input type="text" id="reg-zone" placeholder="e.g. Koramangala, Hitec City, Bandra West, CP" class="login-modal__input" style="width: 100%; font-size: 13px;" />
          </div>

          <!-- Vehicle Details -->
          <div style="border-top: 1px solid var(--clr-border); padding-top: 14px;">
            <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 8px;">Vehicle Type *</label>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;" id="vehicle-type-selector">
              <label class="vehicle-option-card active" data-type="Electric Scooter" style="background: rgba(16, 185, 129, 0.15); border: 1.5px solid #10b981; border-radius: var(--radius-md); padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="vehicleType" value="Electric Scooter" checked style="display: none;" />
                <div style="font-size: 20px;">⚡</div>
                <div style="font-size: 11px; font-weight: bold; margin-top: 4px; color: white;">EV Scooter</div>
              </label>
              <label class="vehicle-option-card" data-type="Motorcycle / Bike" style="background: var(--clr-surface); border: 1.5px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="vehicleType" value="Motorcycle / Bike" style="display: none;" />
                <div style="font-size: 20px;">🏍️</div>
                <div style="font-size: 11px; font-weight: bold; margin-top: 4px; color: white;">Petrol Bike</div>
              </label>
              <label class="vehicle-option-card" data-type="Bicycle" style="background: var(--clr-surface); border: 1.5px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="vehicleType" value="Bicycle" style="display: none;" />
                <div style="font-size: 20px;">🚲</div>
                <div style="font-size: 11px; font-weight: bold; margin-top: 4px; color: white;">Bicycle</div>
              </label>
              <label class="vehicle-option-card" data-type="EV Van / Car" style="background: var(--clr-surface); border: 1.5px solid var(--clr-border); border-radius: var(--radius-md); padding: 10px 6px; text-align: center; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="vehicleType" value="EV Van / Car" style="display: none;" />
                <div style="font-size: 20px;">🚗</div>
                <div style="font-size: 11px; font-weight: bold; margin-top: 4px; color: white;">EV Van</div>
              </label>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Vehicle Plate Number *</label>
              <input type="text" id="reg-plate" placeholder="e.g. KA-01-FD-2026" required class="login-modal__input" style="width: 100%; font-size: 13px; text-transform: uppercase; font-family: monospace;" />
            </div>
            <div>
              <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">Driving License / ID No. *</label>
              <input type="text" id="reg-license" placeholder="e.g. DL142021008892" required class="login-modal__input" style="width: 100%; font-size: 13px; text-transform: uppercase; font-family: monospace;" />
            </div>
          </div>

          <!-- Submit Button -->
          <div style="margin-top: 8px;">
            <button type="submit" id="btn-submit-rider-reg" style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; padding: 14px; border-radius: var(--radius-md); font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>✅</span> Complete Registration & Start Earning
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(registerModalEl);

  // Close handlers
  registerModalEl.querySelector('#rider-reg-close').addEventListener('click', () => registerModalEl.remove());
  registerModalEl.addEventListener('click', (e) => {
    if (e.target === registerModalEl) registerModalEl.remove();
  });

  // Vehicle selection cards click
  const cards = registerModalEl.querySelectorAll('.vehicle-option-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => {
        c.classList.remove('active');
        c.style.background = 'var(--clr-surface)';
        c.style.borderColor = 'var(--clr-border)';
      });
      card.classList.add('active');
      card.style.background = 'rgba(16, 185, 129, 0.15)';
      card.style.borderColor = '#10b981';
      const input = card.querySelector('input');
      if (input) input.checked = true;
    });
  });

  // Form submit
  const form = registerModalEl.querySelector('#rider-registration-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = registerModalEl.querySelector('#reg-name').value;
    const phone = registerModalEl.querySelector('#reg-phone').value;
    const email = registerModalEl.querySelector('#reg-email').value;
    const city = registerModalEl.querySelector('#reg-city').value;
    const zone = registerModalEl.querySelector('#reg-zone').value || `${city} Central Hub`;
    const selectedVehicle = registerModalEl.querySelector('input[name="vehicleType"]:checked')?.value || 'Electric Scooter';
    const vehicleNumber = registerModalEl.querySelector('#reg-plate').value;
    const licenseNumber = registerModalEl.querySelector('#reg-license').value;

    const btn = registerModalEl.querySelector('#btn-submit-rider-reg');
    btn.disabled = true;
    btn.innerHTML = `<span>⏳</span> Activating Rider Profile...`;

    try {
      const res = await registerDeliveryRider({
        name,
        phone,
        email,
        city,
        zone,
        vehicleType: selectedVehicle,
        vehicleNumber,
        licenseNumber
      });

      if (res && res.success) {
        showToast(`🎉 Welcome to the Fleet, ${res.driver.name}! ₹500 Bonus Added!`, '🛵', 5000);
        registerModalEl.remove();
        if (onRegisteredCb) onRegisteredCb(res.driver);
      } else {
        showToast(res?.message || 'Could not register rider', '⚠️');
        btn.disabled = false;
        btn.innerHTML = `<span>✅</span> Complete Registration & Start Earning`;
      }
    } catch (err) {
      showToast('Registration failed. Please try again.', '⚠️');
      btn.disabled = false;
      btn.innerHTML = `<span>✅</span> Complete Registration & Start Earning`;
    }
  });
}
