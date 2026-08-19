// ============================================================
// FoodDash — Interactive Web Audio UI Sound Synthesizer Engine
// ============================================================

let audioCtx = null;
let isSoundMuted = localStorage.getItem('fooddash_sound_muted') === 'true';

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isAudioMuted() {
  return isSoundMuted;
}

export function toggleAudioMute() {
  isSoundMuted = !isSoundMuted;
  localStorage.setItem('fooddash_sound_muted', isSoundMuted.toString());
  return isSoundMuted;
}

// 1. Soft Bubble Pop on Clicks
export function playPopSound(pitch = 440) {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.8, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // ignore audio errors
  }
}

// 2. Aerodynamic Swoosh on Add-to-Cart Launch
export function playSwooshSound() {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.22);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // ignore
  }
}

// 3. Harmonious Major Triad Victory Chime
export function playSuccessChime() {
  if (isSoundMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.14, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch {
          // ignore
        }
      }, idx * 90);
    });
  } catch {
    // ignore
  }
}

export function initSoundEffects() {
  // Attach soft pop sound to generic clickable buttons
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .category-card, .btn, .nav-feature-btn, a');
    if (target && !target.classList.contains('btn-ai-add-cart') && !target.id?.includes('add-cart')) {
      playPopSound(500 + Math.random() * 80);
    }
  }, { passive: true });
}
