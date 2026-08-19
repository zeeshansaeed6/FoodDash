// ============================================================
// FoodDash — Celebratory Confetti & Fireworks Explosion
// ============================================================

export function fireFoodConfetti() {
  const count = 45;
  const emojis = ['🍕', '🍔', '🌮', '🍣', '🎉', '✨', '🪙', '🍰', '🍜'];
  const colors = ['#ff6b00', '#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ec4899', '#a55eea'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const isEmoji = Math.random() > 0.45;

    if (isEmoji) {
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.fontSize = `${16 + Math.random() * 16}px`;
    } else {
      el.style.width = `${8 + Math.random() * 10}px`;
      el.style.height = `${12 + Math.random() * 14}px`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = '3px';
    }

    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
    const startY = window.innerHeight / 2 + 100;
    const angle = (Math.PI / 2) + (Math.random() - 0.5) * 1.6;
    const velocity = 12 + Math.random() * 18;
    const vx = Math.cos(angle) * velocity;
    const vy = -Math.sin(angle) * velocity;

    el.style.cssText += `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      z-index: 999999;
      pointer-events: none;
      user-select: none;
      transform: translate3d(0, 0, 0) rotate(0deg);
    `;

    document.body.appendChild(el);

    let posX = startX;
    let posY = startY;
    let velX = vx;
    let velY = vy;
    let rot = Math.random() * 360;
    let rotSpeed = (Math.random() - 0.5) * 25;
    let opacity = 1;

    function animate() {
      velY += 0.45; // gravity
      posX += velX;
      posY += velY;
      rot += rotSpeed;
      opacity -= 0.012;

      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;
      el.style.transform = `rotate(${rot}deg) scale(${Math.max(0.2, opacity)})`;
      el.style.opacity = `${opacity}`;

      if (opacity > 0 && posY < window.innerHeight + 50) {
        requestAnimationFrame(animate);
      } else {
        el.remove();
      }
    }

    requestAnimationFrame(animate);
  }
}
