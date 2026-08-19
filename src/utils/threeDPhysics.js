// ============================================================
// FoodDash — 3D Card Gyroscope & Parallax Depth Physics Engine
// ============================================================

let is3DModeEnabled = true;

export function set3DMode(enabled) {
  is3DModeEnabled = enabled;
  document.body.classList.toggle('mode-3d-active', enabled);
  if (!enabled) {
    document.querySelectorAll('.card-3d-enhanced').forEach(card => {
      card.style.transform = 'none';
      const glare = card.querySelector('.glare-3d-sheen');
      if (glare) glare.style.opacity = '0';
    });
  }
}

export function get3DMode() {
  return is3DModeEnabled;
}

export function attach3DCardTilt(element, options = {}) {
  if (!element || element.dataset.has3dTilt) return;
  element.dataset.has3dTilt = 'true';
  element.classList.add('card-3d-enhanced');

  const maxAngle = options.maxAngle || 14;
  const perspective = options.perspective || 1000;
  const scale = options.scale || 1.03;

  element.style.transformStyle = 'preserve-3d';
  element.style.transition = 'transform 0.15s ease-out, box-shadow 0.2s ease-out';

  // Add specular glare overlay
  let glare = element.querySelector('.glare-3d-sheen');
  if (!glare) {
    glare = document.createElement('div');
    glare.className = 'glare-3d-sheen';
    glare.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, transparent 65%);
      opacity: 0;
      transition: opacity 0.2s ease-out;
      z-index: 10;
    `;
    element.style.position = 'relative';
    element.appendChild(glare);
  }

  function handleMouseMove(e) {
    if (!is3DModeEnabled) return;

    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const rotateX = -percentY * maxAngle;
    const rotateY = percentX * maxAngle;

    element.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
    element.style.boxShadow = `
      ${-rotateY * 1.5}px ${rotateX * 1.5 + 15}px 35px rgba(0, 0, 0, 0.45),
      0 0 25px rgba(239, 68, 68, 0.2)
    `;

    // Move glare highlight
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
    glare.style.opacity = '1';

    // Parallax depth on child elements
    const images = element.querySelectorAll('img, .restaurant-card__img, .dish-card__img, .category-card__icon');
    images.forEach(img => {
      img.style.transform = `translateZ(24px) scale(1.04)`;
      img.style.transition = 'transform 0.15s ease-out';
    });

    const badges = element.querySelectorAll('.badge, .card-badge, .rating-pill, .offer-tag');
    badges.forEach(b => {
      b.style.transform = `translateZ(36px)`;
      b.style.transition = 'transform 0.15s ease-out';
    });
  }

  function handleMouseLeave() {
    element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    element.style.boxShadow = '';
    glare.style.opacity = '0';

    const innerElements = element.querySelectorAll('img, .restaurant-card__img, .dish-card__img, .category-card__icon, .badge, .card-badge, .rating-pill');
    innerElements.forEach(el => {
      el.style.transform = 'translateZ(0px)';
    });
  }

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
}

export function autoEnhance3DCards(root = document) {
  const cards = root.querySelectorAll('.restaurant-card, .dish-card, .category-card, .offer-card, .feature-card, .login-modal');
  cards.forEach(card => attach3DCardTilt(card));
}
