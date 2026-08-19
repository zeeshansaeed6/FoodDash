import { playSwooshSound } from './soundEffects.js';

export function flyItemToCart(sourceElementOrEvent, imageSrcOrIcon) {
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

  // Create flying clone
  const flyer = document.createElement('div');
  flyer.className = 'flying-cart-item';
  
  const isImage = typeof imageSrcOrIcon === 'string' && (imageSrcOrIcon.startsWith('/') || imageSrcOrIcon.startsWith('http') || imageSrcOrIcon.startsWith('data:'));
  
  if (isImage) {
    flyer.innerHTML = `<img src="${imageSrcOrIcon}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;
  } else {
    flyer.innerHTML = `<div style="font-size: 24px; display: flex; align-items: center; justify-content: center; height: 100%;">${imageSrcOrIcon || '🍔'}</div>`;
  }

  flyer.style.cssText = `
    position: fixed;
    left: ${startX - 24}px;
    top: ${startY - 24}px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b00, #ec4899);
    border: 2px solid white;
    box-shadow: 0 0 20px rgba(255, 107, 0, 0.8), 0 10px 25px rgba(0,0,0,0.5);
    z-index: 100000;
    pointer-events: none;
    transition: transform 0.65s cubic-bezier(0.15, 0.85, 0.35, 1.2), opacity 0.65s ease-in;
    transform: scale(1) translate3d(0, 0, 50px);
  `;

  document.body.appendChild(flyer);

  // Parabolic trajectory
  const deltaX = targetX - startX;
  const deltaY = targetY - startY;

  requestAnimationFrame(() => {
    flyer.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0px) scale(0.2) rotate(360deg)`;
    flyer.style.opacity = '0.7';
  });

  setTimeout(() => {
    flyer.remove();
    if (cartBtn) {
      cartBtn.style.transform = 'scale(1.28) rotate(-6deg)';
      cartBtn.style.boxShadow = '0 0 25px rgba(255, 107, 0, 0.9)';
      setTimeout(() => {
        cartBtn.style.transform = 'scale(1) rotate(0deg)';
        cartBtn.style.boxShadow = '';
      }, 250);
    }
  }, 650);
}
