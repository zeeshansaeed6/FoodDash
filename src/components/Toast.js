// ============================================================
// Toast Notification System
// ============================================================

const toasts = [];

export function showToast(message, icon = '✅', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast__icon">${icon}</span>
    <span class="toast__message">${message}</span>
    <button class="toast__close" aria-label="Close notification">×</button>
  `;

  const close = toast.querySelector('.toast__close');
  close.addEventListener('click', () => removeToast(toast));

  container.appendChild(toast);
  toasts.push(toast);

  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  if (!toast.parentElement) return;
  toast.classList.add('removing');
  setTimeout(() => {
    toast.remove();
    const idx = toasts.indexOf(toast);
    if (idx > -1) toasts.splice(idx, 1);
  }, 300);
}
