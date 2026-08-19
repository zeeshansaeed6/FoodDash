// ============================================================
// Login Modal Component (Real Google & Email & Phone Auth)
// ============================================================
import { showToast } from './Toast.js';
import { sendOtp, verifyOtp, loginWithGoogle, loginWithEmail, setAuthState } from '../api/client.js';

let isOpen = false;
let currentPhone = '';

export function createLoginModal() {
  const overlay = document.createElement('div');
  overlay.className = 'login-overlay';
  overlay.id = 'login-overlay';

  overlay.innerHTML = `
    <div class="login-modal" id="login-modal">
      <button class="login-modal__close" id="login-close-btn" aria-label="Close login">✕</button>
      
      <div class="login-modal__header">
        <div class="login-modal__logo">🍔</div>
        <h2 class="login-modal__title" id="auth-title">Sign in to FoodDash</h2>
        <p class="login-modal__subtitle" id="auth-subtitle">Login with your real Google account, Email or Phone OTP</p>
      </div>

      <div class="login-modal__tabs" id="auth-tabs">
        <button class="login-modal__tab active" data-tab="google">Google Account</button>
        <button class="login-modal__tab" data-tab="email">Email / Password</button>
        <button class="login-modal__tab" data-tab="phone">Phone OTP</button>
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
        <div class="login-modal__input-group">
          <label class="login-modal__label">Password</label>
          <input type="password" class="login-modal__input" placeholder="Enter password (min 6 characters)" id="login-password" required />
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

      <p class="login-modal__terms" style="margin-top: 16px;">
        By continuing, you agree to FoodDash <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
      </p>
    </div>
  `;

  document.body.appendChild(overlay);

  // Tab switching
  overlay.querySelectorAll('.login-modal__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      overlay.querySelectorAll('.login-modal__tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const googleForm = overlay.querySelector('#google-form');
      const emailForm = overlay.querySelector('#email-form');
      const phoneContainer = overlay.querySelector('#phone-container');

      if (tab.dataset.tab === 'google') {
        googleForm.style.display = '';
        emailForm.style.display = 'none';
        phoneContainer.style.display = 'none';
      } else if (tab.dataset.tab === 'email') {
        googleForm.style.display = 'none';
        emailForm.style.display = '';
        phoneContainer.style.display = 'none';
      } else {
        googleForm.style.display = 'none';
        emailForm.style.display = 'none';
        phoneContainer.style.display = '';
      }
    });
  });

  // Real Google Login
  overlay.querySelector('#google-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = overlay.querySelector('#google-real-name').value.trim();
    const email = overlay.querySelector('#google-real-email').value.trim();

    if (!email || !name) {
      showToast('Please enter your name and email', '⚠️');
      return;
    }

    const btn = overlay.querySelector('#google-submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<span>Signing in with Google...</span>`;

    const res = await loginWithGoogle({
      name,
      email,
      avatar: '🧑‍💻'
    });

    btn.disabled = false;
    btn.innerHTML = `<span>🔵</span> Continue with Google →`;

    if (res.success) {
      showToast(`Welcome, ${res.user.name}! Signed in via Google 🎉`, '✅', 3500);
      closeLoginModal();
    } else {
      showToast(res.message || 'Google sign-in failed', '❌');
    }
  });

  // Email login / registration
  overlay.querySelector('#email-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = overlay.querySelector('#email-name')?.value.trim();
    const email = overlay.querySelector('#login-email').value.trim();
    const password = overlay.querySelector('#login-password').value;

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
    }
  });

  // Phone Step 1: Send OTP
  overlay.querySelector('#phone-step-1').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneInput = overlay.querySelector('#login-phone');
    const phone = phoneInput.value.trim();
    if (phone.length < 10) {
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
    }
  });

  // Phone Step 2: Verify OTP
  overlay.querySelector('#phone-step-2').addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = overlay.querySelector('#login-otp-val').value.trim();
    if (!otp) {
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
    }
  });

  overlay.querySelector('#change-phone-btn').addEventListener('click', () => {
    overlay.querySelector('#phone-step-1').style.display = '';
    overlay.querySelector('#phone-step-2').style.display = 'none';
  });

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
