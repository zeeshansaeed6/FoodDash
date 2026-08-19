// ============================================================
// Gamified "Spin the Wheel" Daily Rewards & DashCoins
// ============================================================
import { addDashCoins, getDashCoins } from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';
import { getCurrentUser } from '../api/client.js';
import { openLoginModal } from './LoginModal.js';

let modalOverlayEl = null;
let isSpinning = false;
let countdownInterval = null;

const REWARDS = [
  { id: 'coins500', label: '+500 Coins', color: '#ff4757', desc: 'Added ₹250 to DashCoins Wallet!', type: 'coins', amount: 500 },
  { id: 'spin70', label: '70% MEGA', color: '#3742fa', desc: 'Code: MEGA70 (70% OFF up to ₹250)', type: 'coupon', code: 'MEGA70' },
  { id: 'freedel', label: 'Free Delivery', color: '#2ed573', desc: 'Code: FREEDEL (Free express delivery pass)', type: 'coupon', code: 'FREEDEL' },
  { id: 'coins150', label: '+150 Coins', color: '#ffa502', desc: 'Added ₹75 to DashCoins Wallet!', type: 'coins', amount: 150 },
  { id: 'goldvip', label: '1-Mo Gold', color: '#8b5cf6', desc: 'Code: VIPGOLD (Free delivery on every order for 30 days)', type: 'coupon', code: 'VIPGOLD' },
  { id: 'dessert', label: 'Free Dessert', color: '#ec4899', desc: 'Code: FREESWEET (Free Belgian Waffle or Brownie)', type: 'coupon', code: 'FREESWEET' },
  { id: 'flat40', label: '40% OFF', color: '#06b6d4', desc: 'Code: PARTY40 (40% OFF up to ₹180)', type: 'coupon', code: 'PARTY40' },
  { id: 'coins50', label: '+50 Coins', color: '#eab308', desc: 'Added ₹25 to DashCoins Wallet!', type: 'coins', amount: 50 }
];

export function initSpinWheelModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'modal-overlay';
  modalOverlayEl.id = 'spin-wheel-modal-overlay';
  modalOverlayEl.style.display = 'none';
  document.body.appendChild(modalOverlayEl);
}

export function openSpinWheelModal() {
  const user = getCurrentUser();
  if (!user) {
    openLoginModal();
    showToast('Please sign in to unlock your Daily Lucky Spin 🎡', '🔐');
    return;
  }

  if (!modalOverlayEl) initSpinWheelModal();
  modalOverlayEl.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  sounds.playPop();
  renderSpinWheel();
}

export function closeSpinWheelModal() {
  if (countdownInterval) clearInterval(countdownInterval);
  if (modalOverlayEl) {
    modalOverlayEl.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function renderSpinWheel() {
  if (!modalOverlayEl) return;

  const user = getCurrentUser();
  const storageKey = `fooddash_last_spin_${user ? user.id : 'guest'}`;
  const lastSpinTime = parseInt(localStorage.getItem(storageKey) || '0', 10);
  const COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const timeSince = Date.now() - lastSpinTime;
  const isOnCooldown = timeSince < COOLDOWN_MS;

  const currentCoins = getDashCoins();

  modalOverlayEl.innerHTML = `
    <div class="login-modal spin-modal" style="max-width: 520px; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; padding: 0; position: relative;">
      <!-- Confetti Canvas -->
      <canvas id="spin-confetti-canvas" style="position: absolute; top:0; left:0; width:100%; height:100%; pointer-events: none; z-index: 50;"></canvas>

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1b202c 0%, #11141c 100%); padding: 18px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="spin-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">✕</button>
        <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 40px;">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #ffa502; letter-spacing: 1px;">Daily Lucky Draw</div>
            <h3 style="font-size: 19px; font-weight: 800; color: white; margin: 2px 0 0;">Spin & Win DashCoins!</h3>
          </div>
          <div style="background: rgba(255, 165, 2, 0.15); border: 1px solid rgba(255, 165, 2, 0.3); border-radius: var(--radius-full); padding: 4px 12px; display: flex; align-items: center; gap: 6px;">
            <span>🪙</span>
            <span style="font-size: 13px; font-weight: 800; color: #ffa502;" id="modal-coin-balance">${currentCoins}</span>
          </div>
        </div>
      </div>

      <!-- Wheel Body -->
      <div style="padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: radial-gradient(circle at center, #1e2638 0%, #0e1118 100%);">
        
        <!-- Canvas Wheel with Pin -->
        <div style="position: relative; width: 300px; height: 300px; margin-bottom: 20px;">
          <canvas id="lucky-wheel-canvas" width="300" height="300" style="width: 300px; height: 300px; filter: drop-shadow(0 8px 24px rgba(0,0,0,0.6));"></canvas>
          
          <!-- Center Hub -->
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #ffffff, #dcdde1); border: 4px solid #1e2638; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 20px; z-index: 10;">
            🎁
          </div>

          <!-- Top Pointer / Arrow -->
          <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 26px solid #ff4757; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4)); z-index: 20;"></div>
        </div>

        <!-- Result Box / Timer Display -->
        <div id="spin-result-box" style="min-height: 54px; text-align: center; margin-bottom: 16px;">
          ${isOnCooldown ? `
            <div style="background: rgba(255, 165, 2, 0.12); border: 1px solid rgba(255, 165, 2, 0.3); border-radius: 10px; padding: 8px 16px;">
              <div style="font-size: 13px; font-weight: bold; color: #ffa502;" id="spin-countdown-display">⏳ Next free spin in calculating...</div>
              <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 2px;">Come back daily for fresh DashCoins & free dishes!</div>
            </div>
          ` : `
            <div style="font-size: 13px; color: var(--clr-text-muted);">You get 1 free lucky spin every 24 hours! Ready to try your luck?</div>
          `}
        </div>

        <!-- Spin Action Button -->
        <button class="btn btn-primary" id="spin-wheel-btn" ${isOnCooldown ? 'disabled style="padding: 14px 36px; font-size: 15px; font-weight: 800; border-radius: var(--radius-full); background: #475569; color: #94a3b8; border: none; cursor: not-allowed; text-transform: uppercase; letter-spacing: 1px;"' : 'style="padding: 14px 36px; font-size: 16px; font-weight: 800; border-radius: var(--radius-full); background: linear-gradient(135deg, #ffa502, #ff4757); border: none; box-shadow: 0 8px 25px rgba(255, 71, 87, 0.4); text-transform: uppercase; letter-spacing: 1px; cursor: pointer;"'}>
          ${isOnCooldown ? '⏳ Already Spun Today' : '🎯 Spin Now'}
        </button>

      </div>
    </div>
  `;

  // Draw initial wheel
  const canvas = modalOverlayEl.querySelector('#lucky-wheel-canvas');
  const ctx = canvas.getContext('2d');
  let currentAngle = 0;

  drawWheel(ctx, currentAngle);

  // Close
  modalOverlayEl.querySelector('#spin-close-btn').addEventListener('click', closeSpinWheelModal);

  // Start live ticking timer if on cooldown
  if (isOnCooldown) {
    if (countdownInterval) clearInterval(countdownInterval);
    const updateCountdown = () => {
      const remaining = COOLDOWN_MS - (Date.now() - lastSpinTime);
      const timerEl = modalOverlayEl.querySelector('#spin-countdown-display');
      if (remaining <= 0) {
        clearInterval(countdownInterval);
        renderSpinWheel();
      } else if (timerEl) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((remaining % (1000 * 60)) / 1000);
        timerEl.textContent = `⏳ Next free spin in ${hours}h ${mins}m ${secs}s`;
      }
    };
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // Spin Button
  const spinBtn = modalOverlayEl.querySelector('#spin-wheel-btn');
  const resultBox = modalOverlayEl.querySelector('#spin-result-box');

  if (!isOnCooldown) {
    spinBtn.addEventListener('click', () => {
      if (isSpinning) return;
      isSpinning = true;
      spinBtn.disabled = true;
      spinBtn.style.opacity = '0.5';
      spinBtn.textContent = 'Spinning...';

      // Record spin timestamp
      localStorage.setItem(storageKey, Date.now().toString());

      // Pick random prize
      const winIndex = Math.floor(Math.random() * REWARDS.length);
      const winningReward = REWARDS[winIndex];

      const numSlices = REWARDS.length;
      const sliceAngle = (2 * Math.PI) / numSlices;
      const extraSpins = 5 + Math.floor(Math.random() * 3);
      const targetSliceCenter = (numSlices - winIndex - 0.5) * sliceAngle - (Math.PI / 2);
      const totalRotation = extraSpins * 2 * Math.PI + targetSliceCenter;

      const duration = 4000;
      const startTimestamp = performance.now();
      const startAngle = currentAngle;
      let lastTickAngle = 0;

      function animateSpin(now) {
        const elapsed = now - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle = startAngle + totalRotation * easeOut;

        if (Math.floor(currentAngle / (sliceAngle / 2)) !== lastTickAngle) {
          sounds.playSpinTick();
          lastTickAngle = Math.floor(currentAngle / (sliceAngle / 2));
        }

        drawWheel(ctx, currentAngle);

        if (progress < 1) {
          requestAnimationFrame(animateSpin);
        } else {
          isSpinning = false;
          spinBtn.textContent = '🎉 Claimed!';
          spinBtn.style.background = '#2ed573';
          spinBtn.style.cursor = 'default';
          
          sounds.playWinCoin();
          triggerConfetti();

          if (winningReward.type === 'coins') {
            addDashCoins(winningReward.amount);
            const balEl = modalOverlayEl.querySelector('#modal-coin-balance');
            if (balEl) balEl.textContent = getDashCoins();
          }

          resultBox.innerHTML = `
            <div style="background: rgba(46, 213, 115, 0.15); border: 1px solid #2ed573; border-radius: 10px; padding: 10px 16px; animation: scaleIn 0.3s ease;">
              <div style="font-weight: 800; font-size: 15px; color: #2ed573;">🎉 Congratulations! You won ${winningReward.label}</div>
              <div style="font-size: 12px; color: white; margin-top: 2px;">${winningReward.desc}</div>
            </div>
          `;

          showToast(`You won ${winningReward.label}! 24h timer started ⏳`, '🎁');
        }
      }

      requestAnimationFrame(animateSpin);
    });
  }
}

function drawWheel(ctx, rotation) {
  const width = 300;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 135;
  const numSlices = REWARDS.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);

  for (let i = 0; i < numSlices; i++) {
    const start = i * sliceAngle;
    const end = start + sliceAngle;
    const reward = REWARDS[i];

    // Sector arc
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();

    ctx.fillStyle = reward.color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1e2638';
    ctx.stroke();

    // Text Label
    ctx.save();
    ctx.rotate(start + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 4;
    ctx.fillText(reward.label, radius - 20, 5);
    ctx.restore();
  }

  // Outer Gold Border Ring
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#ffa502';
  ctx.stroke();

  ctx.restore();
}

function triggerConfetti() {
  const canvas = modalOverlayEl?.querySelector('#spin-confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles = Array.from({ length: 60 }, () => ({
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: (Math.random() - 0.5) * 12,
    vy: (Math.random() - 0.7) * 14,
    size: 4 + Math.random() * 6,
    color: ['#ff4757', '#ffa502', '#2ed573', '#3742fa', '#9b5de5', '#ffffff'][Math.floor(Math.random() * 6)],
    alpha: 1,
    rotation: Math.random() * Math.PI * 2
  }));

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.alpha -= 0.015;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(renderParticles);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(renderParticles);
}
