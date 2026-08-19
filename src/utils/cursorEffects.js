// ============================================================
// FoodDash — Interactive Cursor Sparkle Aura Trail
// ============================================================

let canvas = null;
let ctx = null;
let particles = [];
let animationId = null;
let mouse = { x: -100, y: -100, lastX: -100, lastY: -100 };

const SPARK_COLORS = ['#ff6b00', '#ffa502', '#ff4757', '#2ed573', '#1e90ff', '#ffffff'];

class SparkParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 8;
    this.y = y + (Math.random() - 0.5) * 8;
    this.size = Math.random() * 3.5 + 1.5;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2 - 0.5;
    this.color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
    this.life = 1;
    this.decay = Math.random() * 0.03 + 0.02;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    this.size = Math.max(0, this.size - 0.05);
  }

  draw(context) {
    context.save();
    context.globalAlpha = Math.max(0, this.life);
    context.fillStyle = this.color;
    context.shadowBlur = 8;
    context.shadowColor = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

export function initCursorSparkles() {
  if (canvas) return;

  canvas = document.createElement('canvas');
  canvas.id = 'cursor-sparkles-canvas';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 99999;
    width: 100vw;
    height: 100vh;
  `;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    const dist = Math.hypot(mouse.x - mouse.lastX, mouse.y - mouse.lastY);
    if (dist > 4) {
      const count = Math.min(Math.floor(dist / 6), 3);
      for (let i = 0; i < count; i++) {
        particles.push(new SparkParticle(mouse.x, mouse.y));
      }
      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;
    }
  });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0 || p.size <= 0) {
        particles.splice(i, 1);
      }
    }

    animationId = requestAnimationFrame(loop);
  }

  loop();
}
