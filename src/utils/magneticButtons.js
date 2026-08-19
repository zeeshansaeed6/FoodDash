// ============================================================
// FoodDash — Magnetic Button Physics & Click Wave Ripples
// ============================================================

export function initMagneticAndRipples(root = document) {
  // 1. Magnetic Physics on Buttons
  const magnetics = root.querySelectorAll('.btn-primary, .hero__search-btn, .nav-feature-btn, .navbar__cart-btn');

  magnetics.forEach(btn => {
    if (btn.dataset.hasMagnetic) return;
    btn.dataset.hasMagnetic = 'true';

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.04)`;
      btn.style.transition = 'transform 0.1s ease-out';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px) scale(1)';
      btn.style.transition = 'transform 0.3s ease-out';
    });
  });

  // 2. Click Wave Ripples on All Buttons
  const buttons = root.querySelectorAll('.btn, button, .restaurant-card, .category-card');
  buttons.forEach(btn => {
    if (btn.dataset.hasRipple) return;
    btn.dataset.hasRipple = 'true';

    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = 'click-ripple-wave';
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,107,0,0.3) 100%);
        transform: translate(-50%, -50%) scale(0);
        animation: rippleSpread 0.6s ease-out;
        pointer-events: none;
        z-index: 100;
      `;

      if (getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}
