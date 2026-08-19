// ============================================================
// Voice Search & Natural Language Speech-to-Order Assistant
// ============================================================
import { sounds } from './audio.js';
import { showToast } from '../components/Toast.js';

let voiceOverlayEl = null;
let recognition = null;
let onResultCallback = null;

export function initVoiceSearch(onNavigate) {
  onResultCallback = onNavigate;
  if (voiceOverlayEl) return;

  voiceOverlayEl = document.createElement('div');
  voiceOverlayEl.className = 'login-overlay';
  voiceOverlayEl.id = 'voice-search-modal-overlay';
  document.body.appendChild(voiceOverlayEl);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }

      const queryDisplay = voiceOverlayEl.querySelector('#voice-transcript-text');
      if (queryDisplay) {
        queryDisplay.textContent = `"${transcript}"`;
        queryDisplay.style.color = '#ffffff';
      }

      if (event.results[0].isFinal) {
        handleVoiceQuery(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      const queryDisplay = voiceOverlayEl.querySelector('#voice-transcript-text');
      if (queryDisplay) {
        queryDisplay.textContent = 'Could not hear clearly. Try clicking a suggestion below!';
        queryDisplay.style.color = '#ff5252';
      }
    };

    recognition.onend = () => {
      const waveEl = voiceOverlayEl.querySelector('#voice-sound-waves');
      if (waveEl) waveEl.style.opacity = '0.3';
    };
  }
}

export function startVoiceSearch(onNavigate) {
  if (onNavigate) onResultCallback = onNavigate;
  initVoiceSearch(onResultCallback);

  voiceOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  sounds.playVoiceTone();

  renderVoiceModal();

  if (recognition) {
    try {
      recognition.start();
    } catch (e) {}
  }
}

export function stopVoiceSearch() {
  if (voiceOverlayEl) {
    voiceOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {}
  }
}

function handleVoiceQuery(query) {
  if (!query) return;
  sounds.playSuccess();
  showToast(`Searching for "${query}"...`, '🎙️');

  setTimeout(() => {
    stopVoiceSearch();
    if (onResultCallback) {
      onResultCallback('search', query);
    }
  }, 900);
}

function renderVoiceModal() {
  if (!voiceOverlayEl) return;

  const suggestions = [
    'Spicy Hyderabadi Biryani',
    'Woodfired Margherita Pizza',
    'Crispy Chicken Burger under 300',
    'Pure Veg Thali near me',
    'Chocolate Brownie Sundae'
  ];

  voiceOverlayEl.innerHTML = `
    <div class="login-modal voice-modal" style="max-width: 480px; text-align: center; padding: 28px 24px; position: relative;">
      <button id="voice-close-btn" style="position: absolute; right: 16px; top: 16px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>

      <!-- Pulsing Mic Visualizer -->
      <div style="position: relative; width: 88px; height: 88px; margin: 10px auto 20px;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(255, 71, 87, 0.25); animation: pulse 1.6s infinite;"></div>
        <div style="position: absolute; inset: 8px; border-radius: 50%; background: linear-gradient(135deg, #ff4757, #ff6b81); display: flex; align-items: center; justify-content: center; font-size: 34px; box-shadow: 0 8px 25px rgba(255, 71, 87, 0.5);">
          🎙️
        </div>
      </div>

      <!-- Animated Audio Waveform Bars -->
      <div id="voice-sound-waves" style="display: flex; justify-content: center; align-items: center; gap: 4px; height: 28px; margin-bottom: 14px;">
        <span class="voice-bar" style="animation-delay: 0.1s;"></span>
        <span class="voice-bar" style="animation-delay: 0.3s;"></span>
        <span class="voice-bar" style="animation-delay: 0.5s;"></span>
        <span class="voice-bar" style="animation-delay: 0.2s;"></span>
        <span class="voice-bar" style="animation-delay: 0.4s;"></span>
      </div>

      <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--clr-primary); letter-spacing: 1px;">
        Listening for your order...
      </div>

      <h3 id="voice-transcript-text" style="font-size: 18px; font-weight: 700; color: #ffffff; margin: 8px 0 16px; min-height: 28px;">
        "Speak a dish, restaurant or craving..."
      </h3>

      <!-- Suggestion Chips -->
      <div style="border-top: 1px solid var(--clr-border); padding-top: 16px; margin-top: 10px;">
        <div style="font-size: 11px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 8px;">
          Or try saying / clicking:
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px;">
          ${suggestions.map(s => `
            <button class="voice-chip-btn" data-query="${s}" style="background: var(--clr-surface); border: 1px solid var(--clr-border); color: var(--clr-text); font-size: 12px; padding: 6px 12px; border-radius: var(--radius-full); cursor: pointer; transition: all 0.2s;">
              ${s}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  voiceOverlayEl.querySelector('#voice-close-btn').addEventListener('click', stopVoiceSearch);

  voiceOverlayEl.querySelectorAll('.voice-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.query;
      handleVoiceQuery(q);
    });
  });
}
