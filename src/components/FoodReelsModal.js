// ============================================================
// FoodDash — Full-Screen Foodie Reels & Video Stories Viewer
// ============================================================
import { foodReels } from '../data/foodReelsData.js';
import { addToCart, getCartCount } from './CartState.js';
import { showToast } from './Toast.js';

let reelsModalEl = null;
let currentReelIndex = 0;
let lastTapTime = 0;
let isCommentsOpen = false;

export function openFoodReelsModal(startIndex = 0) {
  currentReelIndex = Math.max(0, Math.min(startIndex, foodReels.length - 1));
  isCommentsOpen = false;

  const existing = document.getElementById('food-reels-modal-overlay');
  if (existing) existing.remove();

  reelsModalEl = document.createElement('div');
  reelsModalEl.className = 'modal-overlay active';
  reelsModalEl.id = 'food-reels-modal-overlay';
  reelsModalEl.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.94);
    backdrop-filter: blur(16px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  `;

  document.body.appendChild(reelsModalEl);
  document.body.style.overflow = 'hidden';

  renderCurrentReel();
  attachGlobalReelKeys();
}

function renderCurrentReel() {
  if (!reelsModalEl) return;
  const reel = foodReels[currentReelIndex];

  reelsModalEl.innerHTML = `
    <!-- Top Progress Indicators -->
    <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: min(420px, 92vw); display: flex; gap: 4px; z-index: 100;">
      ${foodReels.map((_, i) => `
        <div style="flex: 1; height: 3px; background: rgba(255,255,255,0.25); border-radius: 2px; overflow: hidden;">
          <div style="height: 100%; width: ${i < currentReelIndex ? '100%' : i === currentReelIndex ? '100%' : '0%'}; background: white; transition: width 0.3s;"></div>
        </div>
      `).join('')}
    </div>

    <!-- Close Button -->
    <button id="btn-close-reels" style="position: absolute; top: 20px; right: 24px; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 40px; height: 40px; color: white; font-size: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 101;">
      ✕
    </button>

    <!-- Up/Down Navigation Arrows (Desktop) -->
    <div style="position: absolute; right: calc(50% - 290px); top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 12px; z-index: 100;">
      <button id="btn-prev-reel" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 44px; height: 44px; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; ${currentReelIndex === 0 ? 'opacity: 0.3; pointer-events: none;' : ''}">
        ▲
      </button>
      <button id="btn-next-reel" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 44px; height: 44px; color: white; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; ${currentReelIndex === foodReels.length - 1 ? 'opacity: 0.3; pointer-events: none;' : ''}">
        ▼
      </button>
    </div>

    <!-- Main Vertical Phone Frame -->
    <div id="reel-phone-viewport" style="width: min(420px, 94vw); height: min(780px, 92vh); border-radius: 28px; background: #0b0f19; border: 2px solid rgba(255, 255, 255, 0.15); position: relative; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 107, 0, 0.25);">
      
      <!-- Video / Animated Dish Stage Container -->
      <div id="reel-video-container" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <img
          src="${reel.dish.image}"
          alt="${reel.title}"
          style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.92); transform: scale(1.04); transition: transform 6s ease-out;"
        />
        <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, transparent 40%, rgba(0,0,0,0.85) 75%, #000 100%);"></div>

        <!-- Floating Heart Animation Container -->
        <div id="reel-heart-burst-container" style="position: absolute; inset: 0; pointer-events: none;"></div>
      </div>

      <!-- Top Creator Bar -->
      <div style="position: absolute; top: 32px; left: 16px; right: 16px; display: flex; align-items: center; justify-content: space-between; z-index: 10;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">${reel.creator.avatar}</span>
          <div>
            <div style="font-size: 13px; font-weight: 800; color: white; display: flex; align-items: center; gap: 4px;">
              ${reel.creator.name} <span style="color: #38bdf8; font-size: 11px;">✓</span>
            </div>
            <div style="font-size: 11px; color: #94a3b8;">${reel.creator.handle}</div>
          </div>
        </div>

        <button style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); color: white; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; cursor: pointer;">
          + Follow
        </button>
      </div>

      <!-- Right Action Toolbar -->
      <div style="position: absolute; right: 14px; bottom: 150px; display: flex; flex-direction: column; align-items: center; gap: 18px; z-index: 15;">
        
        <!-- Like Button -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;" id="btn-reel-like">
          <button style="width: 44px; height: 44px; border-radius: 50%; background: ${reel.isLiked ? '#ff4757' : 'rgba(0,0,0,0.5)'}; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
            ${reel.isLiked ? '❤️' : '🤍'}
          </button>
          <span style="font-size: 11px; font-weight: 800; color: white;">${formatCount(reel.likes)}</span>
        </div>

        <!-- Comments Button -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;" id="btn-reel-comments">
          <button style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
            💬
          </button>
          <span style="font-size: 11px; font-weight: 800; color: white;">${reel.commentsCount}</span>
        </div>

        <!-- Share Button -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; cursor: pointer;" id="btn-reel-share">
          <button style="width: 44px; height: 44px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 18px; color: white; box-shadow: 0 4px 15px rgba(0,0,0,0.4);">
            ↗️
          </button>
          <span style="font-size: 11px; font-weight: 800; color: white;">Share</span>
        </div>

        <!-- Audio Mute Toggle -->
        <button id="btn-reel-audio" style="width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; cursor: pointer;">
          🔊
        </button>
      </div>

      <!-- Bottom Content & 1-Tap Dish Overlay Card -->
      <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 14px 16px 18px; z-index: 10;">
        
        <!-- Reel Title & Caption -->
        <div style="margin-bottom: 12px; padding-right: 50px;">
          <div style="font-size: 13px; font-weight: 800; color: white; line-height: 1.4; margin-bottom: 4px;">
            ${reel.title}
          </div>
          <div style="font-size: 11px; color: #cbd5e1; line-height: 1.3;">
            ${reel.caption}
          </div>
          <div style="font-size: 10px; color: #38bdf8; font-weight: 700; margin-top: 4px;">
            ${reel.tags.join(' ')}
          </div>
        </div>

        <!-- 1-Tap Floating Dish Card -->
        <div style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(12px); border: 1.5px solid rgba(255, 107, 0, 0.5); border-radius: 16px; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 20px rgba(255,107,0,0.3);">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <img
              src="${reel.dish.image}"
              alt="${reel.dish.name}"
              style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover; flex-shrink: 0; border: 1px solid white;"
            />
            <div style="min-width: 0;">
              <div style="font-size: 12px; font-weight: 800; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${reel.dish.name}
              </div>
              <div style="font-size: 10px; color: #94a3b8;">
                🏪 ${reel.dish.restaurantName} • ⭐ ${reel.dish.rating}
              </div>
            </div>
          </div>

          <button id="btn-reel-1tap-add" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 8px 14px; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
            <span>⚡</span> ₹${reel.dish.price}
          </button>
        </div>

      </div>

      <!-- Slide-Up Comments Drawer -->
      <div id="reel-comments-drawer" style="position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background: #0f172a; border-top: 1.5px solid rgba(255,255,255,0.15); border-radius: 20px 20px 0 0; padding: 16px; display: ${isCommentsOpen ? 'flex' : 'none'}; flex-direction: column; z-index: 30; box-shadow: 0 -10px 30px rgba(0,0,0,0.8);">
        
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--clr-border); padding-bottom: 10px; margin-bottom: 10px;">
          <div style="font-size: 13px; font-weight: 800; color: white;">
            💬 Foodie Community Comments (${reel.commentsCount})
          </div>
          <button id="btn-close-comments" style="background: transparent; border: none; color: white; font-size: 16px; cursor: pointer;">✕</button>
        </div>

        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px;" id="reel-comments-list">
          ${reel.comments.map(c => `
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="font-size: 18px;">${c.avatar}</span>
              <div>
                <div style="font-size: 11px; font-weight: 800; color: #e2e8f0;">${c.user} <span style="font-size: 9px; color: #64748b; font-weight: normal;">• ${c.time}</span></div>
                <div style="font-size: 11px; color: #94a3b8; line-height: 1.3;">${c.text}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Add Comment Input -->
        <div style="display: flex; gap: 6px;">
          <input
            type="text"
            id="input-reel-comment"
            placeholder="Add a foodie comment..."
            style="flex: 1; background: rgba(255,255,255,0.06); border: 1px solid var(--clr-border); border-radius: 99px; padding: 8px 14px; font-size: 11px; color: white;"
          />
          <button id="btn-post-comment" style="background: var(--clr-primary); color: white; border: none; border-radius: 99px; padding: 0 14px; font-size: 11px; font-weight: 800; cursor: pointer;">
            Post
          </button>
        </div>
      </div>

    </div>
  `;

  bindReelEvents();
}

function bindReelEvents() {
  const reel = foodReels[currentReelIndex];

  // Close Reel Viewer
  reelsModalEl.querySelector('#btn-close-reels').addEventListener('click', closeFoodReelsModal);
  reelsModalEl.addEventListener('click', (e) => {
    if (e.target === reelsModalEl) closeFoodReelsModal();
  });

  // Prev / Next Buttons
  reelsModalEl.querySelector('#btn-prev-reel')?.addEventListener('click', () => {
    if (currentReelIndex > 0) {
      currentReelIndex--;
      renderCurrentReel();
    }
  });

  reelsModalEl.querySelector('#btn-next-reel')?.addEventListener('click', () => {
    if (currentReelIndex < foodReels.length - 1) {
      currentReelIndex++;
      renderCurrentReel();
    }
  });

  // 1-Tap Add to Cart
  const addBtn = reelsModalEl.querySelector('#btn-reel-1tap-add');
  addBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    addToCart(reel.dish, reel.dish.restaurantId, reel.dish.restaurantName);
    showToast(`Added ${reel.dish.name} to Cart! 🛍️`, '✅');
    addBtn.innerHTML = `<span>✓</span> In Cart!`;
    addBtn.style.background = '#3b82f6';
  });

  // Like Toggle with Animation
  const likeBtn = reelsModalEl.querySelector('#btn-reel-like');
  likeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    reel.isLiked = !reel.isLiked;
    reel.likes += reel.isLiked ? 1 : -1;
    renderCurrentReel();
  });

  // Double-tap to Heart Burst
  const videoCont = reelsModalEl.querySelector('#reel-video-container');
  videoCont?.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTapTime < 320) {
      // Double tap detected
      triggerHeartBurst(e.clientX, e.clientY);
      if (!reel.isLiked) {
        reel.isLiked = true;
        reel.likes += 1;
        renderCurrentReel();
      }
    }
    lastTapTime = now;
  });

  // Comments Toggle
  reelsModalEl.querySelector('#btn-reel-comments')?.addEventListener('click', (e) => {
    e.stopPropagation();
    isCommentsOpen = true;
    const drawer = reelsModalEl.querySelector('#reel-comments-drawer');
    if (drawer) drawer.style.display = 'flex';
  });

  reelsModalEl.querySelector('#btn-close-comments')?.addEventListener('click', (e) => {
    e.stopPropagation();
    isCommentsOpen = false;
    const drawer = reelsModalEl.querySelector('#reel-comments-drawer');
    if (drawer) drawer.style.display = 'none';
  });

  // Post Comment
  reelsModalEl.querySelector('#btn-post-comment')?.addEventListener('click', () => {
    const inp = reelsModalEl.querySelector('#input-reel-comment');
    const val = inp?.value.trim();
    if (val) {
      reel.comments.unshift({ user: 'You', avatar: '😋', text: val, time: 'Just now' });
      reel.commentsCount++;
      inp.value = '';
      renderCurrentReel();
      showToast('Comment posted! 💬', '✅');
    }
  });

  // Share
  reelsModalEl.querySelector('#btn-reel-share')?.addEventListener('click', () => {
    showToast(`Reel link copied to clipboard! 📋`, '✨');
  });
}

function triggerHeartBurst(clientX, clientY) {
  const container = reelsModalEl?.querySelector('#reel-heart-burst-container');
  if (!container) return;

  const heart = document.createElement('div');
  heart.textContent = '❤️';
  heart.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0);
    font-size: 80px;
    filter: drop-shadow(0 0 20px rgba(255, 71, 87, 0.8));
    animation: heartBurstAnim 0.75s cubic-bezier(0.15, 0.85, 0.35, 1.2) forwards;
    pointer-events: none;
    z-index: 50;
  `;

  container.appendChild(heart);
  setTimeout(() => heart.remove(), 750);
}

function attachGlobalReelKeys() {
  function handleKeyDown(e) {
    if (!reelsModalEl) {
      window.removeEventListener('keydown', handleKeyDown);
      return;
    }

    if (e.key === 'Escape') {
      closeFoodReelsModal();
    } else if (e.key === 'ArrowDown' || e.key === 'j') {
      if (currentReelIndex < foodReels.length - 1) {
        currentReelIndex++;
        renderCurrentReel();
      }
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      if (currentReelIndex > 0) {
        currentReelIndex--;
        renderCurrentReel();
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown);
}

export function closeFoodReelsModal() {
  if (reelsModalEl) {
    reelsModalEl.remove();
    reelsModalEl = null;
    document.body.style.overflow = '';
  }
}

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}
