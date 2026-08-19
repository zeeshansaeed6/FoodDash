// ============================================================
// FoodDash — Interactive Card Spotlight Illumination Effect
// ============================================================

export function initSpotlightEffect(root = document) {
  const cards = root.querySelectorAll('.restaurant-card, .dish-card, .advance-feature-banner, .category-card, .hero__content');

  cards.forEach(card => {
    if (card.dataset.hasSpotlight) return;
    card.dataset.hasSpotlight = 'true';
    card.classList.add('card-spotlight-active');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
    });
  });
}
