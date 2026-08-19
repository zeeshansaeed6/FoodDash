// ============================================================
// FoodDash — Circular Food Stories Bar (Instagram Style)
// ============================================================
import { foodReels } from '../data/foodReelsData.js';
import { openFoodReelsModal } from './FoodReelsModal.js';

export function renderFoodStoriesBar() {
  const section = document.createElement('section');
  section.className = 'food-stories-section';
  section.id = 'food-stories-bar';
  section.style.cssText = `
    padding: 16px 0 10px;
    background: rgba(15, 23, 42, 0.4);
    border-bottom: 1px solid var(--clr-border);
    backdrop-filter: blur(8px);
  `;

  section.innerHTML = `
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px; animation: pulse 1.5s infinite;">🔴</span>
        <h2 style="font-size: 15px; font-weight: 900; margin: 0; color: white; letter-spacing: 0.3px; text-transform: uppercase;">
          Foodie Stories & Live Reels
        </h2>
        <span style="background: linear-gradient(135deg, #ef4444, #f97316); color: white; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 99px;">
          TRENDING
        </span>
      </div>
      
      <button id="btn-open-all-reels" style="background: transparent; border: none; font-size: 12px; font-weight: 800; color: var(--clr-primary); cursor: pointer; display: flex; align-items: center; gap: 4px;">
        Watch All (5) <span>→</span>
      </button>
    </div>

    <div class="container" style="overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; display: flex; gap: 18px; padding-bottom: 6px;" id="stories-scroll-tray">
      ${foodReels.map((reel, idx) => `
        <div class="food-story-bubble" data-idx="${idx}" style="display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0; width: 78px; text-align: center; transition: transform 0.2s;">
          
          <!-- Glowing Animated Story Ring -->
          <div style="width: 68px; height: 68px; border-radius: 50%; padding: 3px; background: linear-gradient(45deg, #ff6b00, #ec4899, #8b5cf6, #06b6d4, #ff6b00); background-size: 300% 300%; animation: borderFlow 3s ease infinite; box-shadow: 0 0 15px rgba(255, 107, 0, 0.4); display: flex; align-items: center; justify-content: center; position: relative;">
            
            <img
              src="${reel.dish.image}"
              alt="${reel.title}"
              style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 2px solid #0f172a;"
            />

            <!-- Creator Badge Icon -->
            <span style="position: absolute; bottom: -2px; right: -2px; width: 22px; height: 22px; border-radius: 50%; background: #0f172a; border: 1.5px solid white; display: flex; align-items: center; justify-content: center; font-size: 11px;">
              ${reel.creator.avatar}
            </span>
          </div>

          <!-- Story Label -->
          <span style="font-size: 11px; font-weight: 700; color: #cbd5e1; max-width: 76px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${reel.dish.name.split(' ')[0]} ${idx === 0 ? '🧀' : idx === 1 ? '🍔' : idx === 2 ? '🍚' : idx === 3 ? '🍫' : '🧋'}
          </span>
        </div>
      `).join('')}
    </div>
  `;

  // Attach click listeners to each story bubble
  section.querySelectorAll('.food-story-bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
      const idx = parseInt(bubble.dataset.idx, 10);
      openFoodReelsModal(idx);
    });

    bubble.addEventListener('mouseenter', () => {
      bubble.style.transform = 'scale(1.08) translateY(-4px)';
    });

    bubble.addEventListener('mouseleave', () => {
      bubble.style.transform = 'scale(1) translateY(0px)';
    });
  });

  section.querySelector('#btn-open-all-reels')?.addEventListener('click', () => {
    openFoodReelsModal(0);
  });

  return section;
}
