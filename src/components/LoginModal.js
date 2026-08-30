// ============================================================
// Login Modal Component (Real Google & Email & Phone Auth + UX Features)
// ============================================================
import { showToast } from './Toast.js';
import { sendOtp, verifyOtp, loginWithGoogle, loginWithEmail, setAuthState, registerDeliveryRider, registerRestaurant } from '../api/client.js';

let isOpen = false;
let currentPhone = '';

export function createLoginModal() {
  const hash = window.location.hash.slice(1).toLowerCase();
  
  let role = 'customer';
  let title = 'Sign in to FoodDash';
  let subtitle = 'Login with your real Google account, Email or Phone OTP';
  let logo = '🍔';
  let themeColor = 'var(--clr-primary)';
  let extraTabHtml = '';
  let extraFormHtml = '';

  if (hash === 'partner' || hash === 'merchant') {
    role = 'partner';
    title = 'Partner Hub Portal';
    subtitle = 'Manage your restaurant, menus, and track business analytics';
    logo = '🧑‍🍳';
    themeColor = '#ff6b00'; // Orange for partner
    extraTabHtml = `<button class="login-modal__tab" data-tab="register-partner">Register Restaurant</button>`;
    extraFormHtml = `
      <form class="login-modal__form" id="register-partner-form" style="display: none;">
        <div class="login-modal__input-group">
          <label class="login-modal__label">Restaurant Name</label>
          <input type="text" class="login-modal__input" placeholder="e.g. Spice Route" id="reg-rest-name" required />
        </div>
        <div class="login-modal__input-group">
          <label class="login-modal__label">City</label>
          <div style="display: flex; gap: 8px;">
            <input type="text" class="login-modal__input" placeholder="e.g. Bangalore" id="reg-rest-city" required style="flex: 1;" />
            <button type="button" id="detect-city-btn" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-md); padding: 0 12px; font-size: 16px;" title="Detect My City">📍</button>
          </div>
        </div>
        <div class="login-modal__input-group">
          <label class="login-modal__label">Cuisines (comma separated)</label>
          <input type="text" class="login-modal__input" placeholder="e.g. Indian, Chinese" id="reg-rest-cuisines" required />
        </div>
        <button type="submit" class="login-modal__submit" id="reg-rest-btn" style="background: ${themeColor};">
          Apply as Partner →
        </button>
      </form>
    `;
  } else if (hash === 'rider' || hash === 'driver') {
    role = 'rider';
    title = 'Rider Fleet Portal';
    subtitle = 'Sign in to start accepting deliveries and earn on your schedule';
    logo = '🛵';
    themeColor = '#00e676'; // Green for rider
    extraTabHtml = `<button class="login-modal__tab" data-tab="register-rider">Join Fleet</button>`;
    extraFormHtml = `
      <form class="login-modal__form" id="register-rider-form" style="display: none;">
        <div class="login-modal__input-group">
          <label class="login-modal__label">Full Name</label>
          <input type="text" class="login-modal__input" placeholder="e.g. Ramesh Kumar" id="reg-rider-name" required />
        </div>
        <div class="login-modal__input-group">
          <label class="login-modal__label">Phone Number</label>
          <input type="tel" class="login-modal__input" placeholder="10-digit number" maxlength="10" id="reg-rider-phone" required />
        </div>
        <div class="login-modal__input-group">
          <label class="login-modal__label">Vehicle & Avatar</label>
          <div style="display: flex; gap: 8px;" id="rider-avatar-selector">
            <button type="button" class="avatar-btn active" data-vehicle="Electric Scooter" data-avatar="🛵" style="flex: 1; padding: 10px; border: 2px solid ${themeColor}; border-radius: 8px; background: rgba(0, 230, 118, 0.1); cursor: pointer; font-size: 24px;">🛵</button>
            <button type="button" class="avatar-btn" data-vehicle="Bike" data-avatar="🏍️" style="flex: 1; padding: 10px; border: 2px solid transparent; border-radius: 8px; background: rgba(255,255,255,0.05); cursor: pointer; font-size: 24px;">🏍️</button>
            <button type="button" class="avatar-btn" data-vehicle="Bicycle" data-avatar="🚲" style="flex: 1; padding: 10px; border: 2px solid transparent; border-radius: 8px; background: rgba(255,255,255,0.05); cursor: pointer; font-size: 24px;">🚲</button>
            <button type="button" class="avatar-btn" data-vehicle="Car" data-avatar="🚗" style="flex: 1; padding: 10px; border: 2px solid transparent; border-radius: 8px; background: rgba(255,255,255,0.05); cursor: pointer; font-size: 24px;">🚗</button>
          </div>
          <input type="hidden" id="reg-rider-vehicle" value="Electric Scooter" />
          <input type="hidden" id="reg-rider-avatar" value="🛵" />
        </div>
        <button type="submit" class="login-modal__submit" id="reg-rider-btn" style="background: ${themeColor}; color: #000;">
          Register as Rider →
        </button>
      </form>
    `;
  }

  const overlay = document.createElement('div');
  overlay.className = 'login-overlay';
  overlay.id = 'login-overlay';

  overlay.innerHTML = `
    <style>
      @keyframes shake-animation {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
        20%, 40%, 60%, 80% { transform: translateX(6px); }
      }
      .form-shake {
        animation: shake-animation 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
      }
      .form-shake input {
        border-color: #ef4444 !important;
      }
    </style>
    <div class="login-modal" id="login-modal" style="border-top: 4px solid ${themeColor};">
      <button class="login-modal__close" id="login-close-btn" aria-label="Close login">✕</button>
      
      <div class="login-modal__header">
        <div class="login-modal__logo" style="background: ${themeColor}22; color: ${themeColor}; padding: 12px; border-radius: 50%; display: inline-block; font-size: 2rem;">${logo}</div>
        <h2 class="login-modal__title" id="auth-title">${title}</h2>
        <p class="login-modal__subtitle" id="auth-subtitle">${subtitle}</p>
      </div>

      <div class="login-modal__tabs" id="auth-tabs">
        <button class="login-modal__tab active" data-tab="google">Google Account</button>
        <button class="login-modal__tab" data-tab="email">Email / Password</button>
        <button class="login-modal__tab" data-tab="phone">Phone OTP</button>
        ${extraTabHtml}
      </div>

      <!-- Tab 1: Real Google Sign-In Form -->
      <form class="login-modal__form" id="google-form">
        <div style="background: rgba(66, 133, 244, 0.1); border: 1px solid rgba(66, 133, 244, 0.3); border-radius: var(--radius-md); padding: 12px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">🌐</span>
          <div style="font-size: 12px; color: var(--clr-text-secondary);">
            Enter your <b>real Gmail address</b> below to sign in with your own personal profile.
          </div>
        </div>

        <div class="login-modal__input-group">
          <label class="login-modal__label">Your Full Name</label>
          <input type="text" class="login-modal__input" placeholder="e.g. Rahul Sharma" id="google-real-name" required />
        </div>

        <div class="login-modal__input-group">
          <label class="login-modal__label">Your Gmail / Google Email</label>
          <input type="email" class="login-modal__input" placeholder="e.g. rahul@gmail.com" id="google-real-email" required />
        </div>

        <button type="submit" class="login-modal__submit" id="google-submit-btn" style="background: #4285F4; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>🔵</span> Continue with Google →
        </button>
      </form>

      <!-- Tab 2: Email & Password Form -->
      <form class="login-modal__form" id="email-form" style="display: none;">
        <div class="login-modal__input-group">
          <label class="login-modal__label">Full Name (Optional)</label>
          <input type="text" class="login-modal__input" placeholder="Your name" id="email-name" />
        </div>
        <div class="login-modal__input-group">
          <label class="login-modal__label">Email Address</label>
          <input type="email" class="login-modal__input" placeholder="yourname@domain.com" id="login-email" required />
        </div>
        <div class="login-modal__input-group" style="position: relative;">
          <label class="login-modal__label">Password</label>
          <input type="password" class="login-modal__input" placeholder="Enter password (min 6 chars)" id="login-password" required style="padding-right: 40px;" />
          <button type="button" id="toggle-password-btn" style="position: absolute; right: 12px; top: 32px; background: none; border: none; font-size: 16px; cursor: pointer; color: var(--clr-text-muted);">👁️</button>
        </div>

        <button type="submit" class="login-modal__submit" id="email-login-btn">
          Sign In / Register →
        </button>
      </form>

      <!-- Tab 3: Phone OTP Form -->
      <div id="phone-container" style="display: none;">
        <form class="login-modal__form" id="phone-step-1">
          <div class="login-modal__input-group">
            <label class="login-modal__label">Mobile Number</label>
            <div class="login-modal__phone-wrap">
              <span class="login-modal__country-code">+91</span>
              <input type="tel" class="login-modal__input" placeholder="Enter 10-digit number" maxlength="10" id="login-phone" required />
            </div>
          </div>

          <button type="submit" class="login-modal__submit" id="send-otp-btn">
            Send OTP →
          </button>
        </form>

        <form class="login-modal__form" id="phone-step-2" style="display: none;">
          <div style="background: rgba(229, 57, 53, 0.12); border: 1px dashed var(--clr-primary); border-radius: var(--radius-md); padding: 10px; margin-bottom: 12px; text-align: center;">
            <div style="font-size: 11px; color: var(--clr-text-muted);">OTP sent to <b id="otp-phone-display" style="color: var(--clr-text);">+91</b></div>
            <div style="font-size: 13px; font-weight: bold; color: var(--clr-primary-light); margin-top: 4px;" id="otp-banner-text">Test OTP: 1234</div>
          </div>

          <div class="login-modal__input-group">
            <label class="login-modal__label">Enter 4-Digit OTP</label>
            <input type="text" class="login-modal__input" placeholder="e.g. 1234" maxlength="6" id="login-otp-val" style="text-align: center; font-size: 1.2rem; letter-spacing: 6px; font-weight: bold;" required />
          </div>

          <button type="submit" class="login-modal__submit" id="verify-otp-btn">
            Verify & Sign In →
          </button>
          <button type="button" class="btn btn-ghost btn-sm" id="change-phone-btn" style="margin-top: 6px;">
            ← Change phone number
          </button>
        </form>
      </div>

      <!-- Extra Registration Forms -->
      ${extraFormHtml}

      <p class="login-modal__terms" style="margin-top: 16px;">
        By continuing, you agree to FoodDash <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  // Helper function for form shake animation
  const triggerShake = (form) => {
    form.classList.remove('form-shake');
    void form.offsetWidth; // trigger reflow
    form.classList.add('form-shake');
  };

  // 1. Password Visibility Toggle
  const togglePwdBtn = overlay.querySelector('#toggle-password-btn');
  if (togglePwdBtn) {
    togglePwdBtn.addEventListener('click', () => {
      const pwdInput = overlay.querySelector('#login-password');
      if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        togglePwdBtn.textContent = '🙈';
      } else {
        pwdInput.type = 'password';
        togglePwdBtn.textContent = '👁️';
      }
    });
  }

  // 2. Detect City Logic
  const detectCityBtn = overlay.querySelector('#detect-city-btn');
  if (detectCityBtn) {
    detectCityBtn.addEventListener('click', async () => {
      detectCityBtn.textContent = '⌛';
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.city) {
          overlay.querySelector('#reg-rest-city').value = data.city;
          showToast(`Detected city: ${data.city}`, '📍');
        } else {
          throw new Error('City not found');
        }
      } catch (e) {
        showToast('Could not automatically detect city', '⚠️');
      }
      detectCityBtn.textContent = '📍';
    });
  }

  // 3. Custom Rider Avatar Selector
  const avatarBtns = overlay.querySelectorAll('.avatar-btn');
  avatarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      avatarBtns.forEach(b => {
        b.classList.remove('active');
        b.style.border = '2px solid transparent';
        b.style.background = 'rgba(255,255,255,0.05)';
      });
      btn.classList.add('active');
      btn.style.border = `2px solid ${themeColor}`;
      btn.style.background = 'rgba(0, 230, 118, 0.1)';
      overlay.querySelector('#reg-rider-vehicle').value = btn.dataset.vehicle;
      overlay.querySelector('#reg-rider-avatar').value = btn.dataset.avatar;
    });
  });

  // Tab switching
  overlay.querySelectorAll('.login-modal__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.login-modal__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const forms = ['google-form', 'email-form', 'phone-container', 'register-partner-form', 'register-rider-form'];
      forms.forEach(fId => {
        const f = overlay.querySelector(`#${fId}`);
        if (f) f.style.display = 'none';
      });

      if (tab.dataset.tab === 'google') {
        overlay.querySelector('#google-form').style.display = '';
      } else if (tab.dataset.tab === 'email') {
        overlay.querySelector('#email-form').style.display = '';
      } else if (tab.dataset.tab === 'phone') {
        overlay.querySelector('#phone-container').style.display = '';
      } else if (tab.dataset.tab === 'register-partner') {
        overlay.querySelector('#register-partner-form').style.display = '';
      } else if (tab.dataset.tab === 'register-rider') {
        overlay.querySelector('#register-rider-form').style.display = '';
      }
    });
  });

  // Real Google Login
  overlay.querySelector('#google-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = overlay.querySelector('#google-real-name').value.trim();
    const email = overlay.querySelector('#google-real-email').value.trim();

    if (!email || !name) {
      triggerShake(overlay.querySelector('#google-form'));
      showToast('Please enter your name and email', '⚠️');
      return;
    }

    const btn = overlay.querySelector('#google-submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<span>Signing in with Google...</span>`;

    const res = await loginWithGoogle({
      name,
      email,
      avatar: role === 'partner' ? '🧑‍🍳' : (role === 'rider' ? '🛵' : '🧑‍💻')
    });

    btn.disabled = false;
    btn.innerHTML = `<span>🔵</span> Continue with Google →`;

    if (res.success) {
      showToast(`Welcome, ${res.user.name}! Signed in via Google 🎉`, '✅', 3500);
      closeLoginModal();
    } else {
      showToast(res.message || 'Google sign-in failed', '❌');
      triggerShake(overlay.querySelector('#google-form'));
    }
  });

  // Email login / registration
  overlay.querySelector('#email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = overlay.querySelector('#email-name')?.value.trim();
    const email = overlay.querySelector('#login-email').value.trim();
    const password = overlay.querySelector('#login-password').value;

    if (!email || password.length < 6) {
      triggerShake(overlay.querySelector('#email-form'));
      return;
    }

    const btn = overlay.querySelector('#email-login-btn');
    btn.disabled = true;
    btn.textContent = 'Authenticating...';

    // Try login first, if account not found, register automatically
    let res = await loginWithEmail(email, password);
    if (!res.success) {
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      }).then(r => r.json());

      if (regRes.success && regRes.token) {
        setAuthState(regRes.user, regRes.token);
        res = regRes;
      }
    }

    btn.disabled = false;
    btn.textContent = 'Sign In / Register →';

    if (res.success) {
      showToast(`Welcome back, ${res.user.name}! 🎉`, '✅');
      closeLoginModal();
    } else {
      showToast(res.message || 'Authentication error', '❌');
      triggerShake(overlay.querySelector('#email-form'));
    }
  });

  // Phone Step 1: Send OTP
  overlay.querySelector('#phone-step-1').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneInput = overlay.querySelector('#login-phone');
    const phone = phoneInput.value.trim();
    if (phone.length < 10) {
      triggerShake(overlay.querySelector('#phone-step-1'));
      showToast('Please enter a valid 10-digit number', '⚠️');
      return;
    }

    const btn = overlay.querySelector('#send-otp-btn');
    btn.disabled = true;
    btn.textContent = 'Sending OTP...';

    const res = await sendOtp(phone);
    btn.disabled = false;
    btn.textContent = 'Send OTP →';

    if (res.success) {
      currentPhone = res.phone;
      overlay.querySelector('#otp-phone-display').textContent = `+91-${currentPhone}`;
      overlay.querySelector('#otp-banner-text').textContent = `Verification OTP: ${res.devOtp || '1234'}`;
      overlay.querySelector('#phone-step-1').style.display = 'none';
      overlay.querySelector('#phone-step-2').style.display = '';
      overlay.querySelector('#login-otp-val').value = res.devOtp || '';
      showToast(`OTP sent! (Test OTP: ${res.devOtp || '1234'})`, '📱', 4000);
      overlay.querySelector('#login-otp-val').focus();
    } else {
      showToast(res.message || 'Failed to send OTP', '❌');
      triggerShake(overlay.querySelector('#phone-step-1'));
    }
  });

  // Phone Step 2: Verify OTP
  overlay.querySelector('#phone-step-2').addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = overlay.querySelector('#login-otp-val').value.trim();
    if (!otp) {
      triggerShake(overlay.querySelector('#phone-step-2'));
      showToast('Please enter OTP', '⚠️');
      return;
    }

    const btn = overlay.querySelector('#verify-otp-btn');
    btn.disabled = true;
    btn.textContent = 'Verifying...';

    const res = await verifyOtp(currentPhone, otp);
    btn.disabled = false;
    btn.textContent = 'Verify & Sign In →';

    if (res.success) {
      showToast(`Welcome back, ${res.user.name}! 🎉`, '✅');
      closeLoginModal();
    } else {
      showToast(res.message || 'Invalid OTP', '❌');
      triggerShake(overlay.querySelector('#phone-step-2'));
    }
  });

  overlay.querySelector('#change-phone-btn').addEventListener('click', () => {
    overlay.querySelector('#phone-step-1').style.display = '';
    overlay.querySelector('#phone-step-2').style.display = 'none';
  });

  // 4. Partner Registration Handler (With Auto-Login)
  const partnerForm = overlay.querySelector('#register-partner-form');
  if (partnerForm) {
    partnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = overlay.querySelector('#reg-rest-name').value.trim();
      const cityName = overlay.querySelector('#reg-rest-city').value.trim();
      const cuisinesInput = overlay.querySelector('#reg-rest-cuisines').value.trim();
      
      if (!name || !cityName || !cuisinesInput) {
        triggerShake(partnerForm);
        return;
      }
      const cuisines = cuisinesInput.split(',').map(s => s.trim());
      
      const btn = overlay.querySelector('#reg-rest-btn');
      btn.disabled = true;
      btn.textContent = 'Applying...';

      const res = await registerRestaurant({ name, cityName, cuisines });
      
      if (res.success) {
        showToast('Restaurant registered successfully! Auto-logging you in...', '✅', 3000);
        
        // Auto-Login by creating a partner admin profile seamlessly
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: `${name} Admin`, 
            email: `admin@${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}${Math.floor(Math.random()*1000)}.com`, 
            password: 'password123' 
          })
        }).then(r => r.json());

        if (regRes.success && regRes.token) {
          setAuthState(regRes.user, regRes.token);
          closeLoginModal();
          window.location.reload();
        }
      } else {
        btn.disabled = false;
        btn.textContent = 'Apply as Partner →';
        showToast(res.message || 'Failed to register', '❌');
        triggerShake(partnerForm);
      }
    });
  }

  // 5. Rider Registration Handler (With Auto-Login)
  const riderForm = overlay.querySelector('#register-rider-form');
  if (riderForm) {
    riderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = overlay.querySelector('#reg-rider-name').value.trim();
      const phone = overlay.querySelector('#reg-rider-phone').value.trim();
      const vehicleType = overlay.querySelector('#reg-rider-vehicle').value;
      const avatar = overlay.querySelector('#reg-rider-avatar').value;
      
      if (!name || phone.length < 10) {
        triggerShake(riderForm);
        return;
      }

      const btn = overlay.querySelector('#reg-rider-btn');
      btn.disabled = true;
      btn.textContent = 'Registering...';

      const res = await registerDeliveryRider({ name, phone, vehicleType, avatar });
      
      if (res.success) {
        showToast('Registered successfully! Auto-logging you in...', '✅', 3000);
        
        // Auto-Login via OTP logic silently
        await sendOtp(phone);
        const otpRes = await verifyOtp(phone, '1234', name);
        
        if (otpRes.success) {
          closeLoginModal();
          window.location.reload();
        }
      } else {
        btn.disabled = false;
        btn.textContent = 'Register as Rider →';
        showToast(res.message || 'Failed to register', '❌');
        triggerShake(riderForm);
      }
    });
  }

  // Close
  overlay.querySelector('#login-close-btn').addEventListener('click', closeLoginModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLoginModal();
  });
}

export function openLoginModal() {
  isOpen = true;
  const overlay = document.getElementById('login-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('#google-real-name')?.focus();
  }
}

export function closeLoginModal() {
  isOpen = false;
  const overlay = document.getElementById('login-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
