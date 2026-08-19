// ============================================================
// Customer Reviews & Ratings Modal
// ============================================================
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';

let reviewsModalEl = null;
let currentRestaurantId = null;
let currentRestaurantName = '';

export function initReviewsModal() {
  reviewsModalEl = document.createElement('div');
  reviewsModalEl.className = 'login-overlay';
  reviewsModalEl.id = 'reviews-modal-overlay';
  document.body.appendChild(reviewsModalEl);
}

export function openReviewsModal(restaurantId, restaurantName = '') {
  currentRestaurantId = restaurantId;
  currentRestaurantName = restaurantName;
  reviewsModalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderReviewsContent();
}

export function closeReviewsModal() {
  if (reviewsModalEl) {
    reviewsModalEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

async function fetchReviews(restaurantId) {
  try {
    const res = await fetch(`/api/restaurants/${restaurantId}/reviews`).then(r => r.json());
    return res;
  } catch (e) {
    return { reviews: [], averageRating: 4.5, count: 0 };
  }
}

async function renderReviewsContent() {
  if (!reviewsModalEl) return;

  const data = await fetchReviews(currentRestaurantId);
  const reviews = data.reviews || [];
  const avg = data.averageRating || 4.5;

  reviewsModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 620px; max-height: 85vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1f2430 0%, #151821 100%); padding: 18px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="reviews-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.1); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">✕</button>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: var(--clr-success); color: white; font-size: 20px; font-weight: 800; padding: 8px 14px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 4px;">
            ★ ${avg}
          </div>
          <div>
            <h3 style="font-size: 18px; font-weight: bold; margin: 0; color: white;">${currentRestaurantName || 'Restaurant'} Reviews</h3>
            <p style="font-size: 12px; color: var(--clr-text-muted); margin: 0;">Based on ${data.count || reviews.length} verified customer orders</p>
          </div>
        </div>
      </div>

      <!-- Reviews Body -->
      <div style="flex: 1; overflow-y: auto; padding: 20px 24px;">
        <!-- Write Review Form Accordion -->
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 20px;">
          <h4 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
            <span>✍️</span> Share Your Experience
          </h4>
          <form id="add-review-form" style="display: flex; flex-direction: column; gap: 12px;">
            <div>
              <label class="login-modal__label">Your Name</label>
              <input type="text" id="rev-name-input" class="login-modal__input" placeholder="e.g. Rahul Sharma" value="" required />
            </div>

            <div>
              <label class="login-modal__label">Rating</label>
              <div style="display: flex; gap: 8px;" id="star-rating-select">
                ${[1, 2, 3, 4, 5].map(star => `
                  <button type="button" class="btn btn-secondary btn-sm star-btn ${star === 5 ? 'active' : ''}" data-star="${star}" style="font-size: 14px; padding: 6px 12px;">
                    ★ ${star}
                  </button>
                `).join('')}
              </div>
            </div>

            <div>
              <label class="login-modal__label">Review & Dish Feedback</label>
              <textarea id="rev-comment-input" class="login-modal__input" rows="3" placeholder="Tell other foodies what dishes you loved, how fast it arrived, and food taste..." required style="resize: none;"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="align-self: flex-start; padding: 8px 20px;">
              Submit Verified Review ✨
            </button>
          </form>
        </div>

        <!-- Customer Reviews List -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <h4 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: var(--clr-text-secondary); letter-spacing: 0.5px;">Customer Comments</h4>
          ${reviews.length === 0 ? `
            <div style="text-align: center; padding: 24px; color: var(--clr-text-muted);">
              Be the first to review this restaurant!
            </div>
          ` : reviews.map(rev => `
            <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-md); padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--clr-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px;">
                    ${rev.userName.charAt(0)}
                  </div>
                  <div>
                    <div style="font-size: 13px; font-weight: bold;">${rev.userName}</div>
                    <div style="font-size: 11px; color: var(--clr-text-muted);">${rev.date}</div>
                  </div>
                </div>
                <div class="badge" style="background: var(--clr-success); color: white; font-size: 12px; padding: 3px 8px; border-radius: var(--radius-sm);">
                  ★ ${rev.rating}
                </div>
              </div>

              <p style="font-size: 13px; color: var(--clr-text); line-height: 1.5; margin-bottom: 8px;">
                ${rev.comment}
              </p>

              ${(rev.dishes && rev.dishes.length > 0) ? `
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  ${rev.dishes.map(d => `<span class="badge" style="background: var(--clr-bg-elevated); font-size: 11px; padding: 3px 8px; border: 1px solid var(--clr-border);">🍲 ${d}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Bind close
  reviewsModalEl.querySelector('#reviews-close-btn').addEventListener('click', closeReviewsModal);

  // Star selector
  let selectedRating = 5;
  reviewsModalEl.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.star);
      reviewsModalEl.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Form Submit
  reviewsModalEl.querySelector('#add-review-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userName = reviewsModalEl.querySelector('#rev-name-input').value.trim() || 'Foodie Explorer';
    const comment = reviewsModalEl.querySelector('#rev-comment-input').value.trim();

    try {
      const res = await fetch(`/api/restaurants/${currentRestaurantId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          rating: selectedRating,
          comment
        })
      }).then(r => r.json());

      if (res.success) {
        sounds.playSuccess();
        showToast('Thank you! Your review is now live 🎉', '⭐');
        renderReviewsContent();
      }
    } catch (err) {
      showToast('Error submitting review', '❌');
    }
  });
}
