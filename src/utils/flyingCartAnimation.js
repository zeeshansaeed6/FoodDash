import { playSwooshSound } from './soundEffects.js';

export function flyItemToCart(sourceElementOrEvent, imageSrcOrIcon) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  playSwooshSound();
  let startX = 0;
  let startY = 0;

  if (sourceElementOrEvent instanceof Event) {
    startX = sourceElementOrEvent.clientX;
    startY = sourceElementOrEvent.clientY;
  } else if (sourceElementOrEvent && sourceElementOrEvent.getBoundingClientRect) {
    const rect = sourceElementOrEvent.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  } else {
    startX = window.innerWidth / 2;
    startY = window.innerHeight / 2;
  }

  const cartBtn = document.getElementById('nav-cart-btn') || document.querySelector('.navbar__cart-btn');
  let targetX = window.innerWidth - 60;
  let targetY = 30;

  if (cartBtn) {
    const cartRect = cartBtn.getBoundingClientRect();
    targetX = cartRect.left + cartRect.width / 2;
    targetY = cartRect.top + cartRect.height / 2;
  }

  // To create a realistic parabolic arc, we use two nested elements.
  // The outer container handles the horizontal (X) linear movement.
  const flyerContainer = document.createElement('div');
  flyerContainer.className = 'flying-cart-container';
  flyerContainer.style.cssText = `
    position: fixed;
    left: ${startX - 35}px;
    top: ${startY - 35}px;
    width: 70px;
    height: 70px;
    z-index: 100000;
    pointer-events: none;
    transition: transform 0.75s cubic-bezier(0.2, 0.0, 0.8, 1.0); /* Ease-in-out X */
  `;

  // The inner element handles the vertical (Y) gravity movement, scale, and spin.
  const flyer = document.createElement('div');
  flyer.className = 'flying-cart-item';
  
  const isImage = typeof imageSrcOrIcon === 'string' && (imageSrcOrIcon.startsWith('/') || imageSrcOrIcon.startsWith('http') || imageSrcOrIcon.startsWith('data:'));
  
  if (isImage) {
    flyer.innerHTML = `<img src="${imageSrcOrIcon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;
  } else {
    flyer.innerHTML = `<div style="font-size: 32px; display: flex; align-items: center; justify-content: center; height: 100%;">${imageSrcOrIcon || '🍔'}</div>`;
  }

  flyer.style.cssText = `
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--clr-surface, #ffffff);
    border: 3px solid var(--clr-primary, #ff6b00);
    box-shadow: 0 15px 30px rgba(0,0,0,0.4), 0 0 20px rgba(255, 107, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* Y-axis uses an overshoot bezier (1.3) to make it arc upwards before falling into the cart */
    transition: transform 0.75s cubic-bezier(0.1, 0.9, 0.3, 1.3), opacity 0.5s ease-in 0.25s;
    transform: scale(0.5) rotate(0deg);
  `;

  flyerContainer.appendChild(flyer);
  document.body.appendChild(flyerContainer);

  const deltaX = targetX - startX;
  const deltaY = targetY - startY;

  // Small delay to allow the DOM to paint the initial state
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Outer container moves horizontally
      flyerContainer.style.transform = `translateX(${deltaX}px)`;
      
      // Inner flyer arcs vertically (overshoots and drops), spins rapidly, and shrinks
      flyer.style.transform = `translateY(${deltaY}px) scale(0.15) rotate(1080deg)`;
      flyer.style.opacity = '0.4';
    });
  });

  // Cleanup & Cart Impact Animation
  setTimeout(() => {
    flyerContainer.remove();
    if (cartBtn) {
      // Realistic cart "catch" bounce
      cartBtn.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      cartBtn.style.transform = 'scale(1.35) translateY(4px) rotate(-12deg)';
      cartBtn.style.boxShadow = '0 0 30px var(--clr-primary, #fc4a1a)';
      
      setTimeout(() => {
        cartBtn.style.transition = 'transform 0.4s cubic-bezier(0.5, 1.5, 0.4, 1)';
        cartBtn.style.transform = 'scale(1) translateY(0) rotate(0deg)';
        cartBtn.style.boxShadow = '';
      }, 150);
    }
  }, 750);
}

export function flyCoinsToDriver(sourceElementOrEvent) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  playSwooshSound();
  let startX = window.innerWidth / 2;
  let startY = window.innerHeight / 2;

  if (sourceElementOrEvent instanceof Event) {
    startX = sourceElementOrEvent.clientX;
    startY = sourceElementOrEvent.clientY;
  } else if (sourceElementOrEvent && sourceElementOrEvent.getBoundingClientRect) {
    const rect = sourceElementOrEvent.getBoundingClientRect();
    startX = rect.left + rect.width / 2;
    startY = rect.top + rect.height / 2;
  }

  // Target the earnings value element or top right corner
  const earningsBtn = document.getElementById('rider-earnings-val');
  let targetX = window.innerWidth - 100;
  let targetY = 100;

  if (earningsBtn) {
    const rect = earningsBtn.getBoundingClientRect();
    targetX = rect.left + rect.width / 2;
    targetY = rect.top + rect.height / 2;
  }

  // Create 6 coins for a burst effect
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        left: ${startX - 20}px;
        top: ${startY - 20}px;
        width: 40px;
        height: 40px;
        z-index: 100000;
        pointer-events: none;
        transition: transform 0.8s cubic-bezier(0.2, 0.0, 0.8, 1.0);
      `;

      const coin = document.createElement('div');
      coin.innerHTML = '🪙';
      coin.style.cssText = `
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        transition: transform 0.8s cubic-bezier(0.1, 0.9, 0.3, 1.3), opacity 0.6s ease-in 0.2s;
        transform: scale(0.5) rotate(0deg);
        filter: drop-shadow(0 0 10px rgba(250, 204, 21, 0.8));
      `;

      container.appendChild(coin);
      document.body.appendChild(container);

      // Randomize target slightly for a spread effect
      const endX = targetX + (Math.random() * 60 - 30);
      const endY = targetY + (Math.random() * 60 - 30);
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          container.style.transform = `translateX(${deltaX}px)`;
          coin.style.transform = `translateY(${deltaY}px) scale(0.8) rotate(${1080 + Math.random() * 360}deg)`;
          coin.style.opacity = '0';
        });
      });

      setTimeout(() => {
        container.remove();
        if (i === 5 && earningsBtn) {
          earningsBtn.style.transition = 'transform 0.15s ease';
          earningsBtn.style.transform = 'scale(1.4)';
          earningsBtn.style.color = '#facc15';
          setTimeout(() => {
            earningsBtn.style.transition = 'all 0.4s ease';
            earningsBtn.style.transform = 'scale(1)';
            earningsBtn.style.color = '#4ade80';
          }, 200);
        }
      }, 800);
    }, i * 80); // Stagger coins
  }
}
