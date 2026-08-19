import { showToast } from './Toast.js';
import { queryAiFoodConcierge } from '../api/client.js';
import { addToCart } from './CartState.js';
import { getActiveDeliveryLocation } from './LocationModal.js';

let voiceModalEl = null;
let speechRecognition = null;
let isSpeakingAudio = true;

export function openVoiceAssistantModal(onNavigate) {
  const existing = document.getElementById('ai-voice-concierge-overlay');
  if (existing) existing.remove();

  voiceModalEl = document.createElement('div');
  voiceModalEl.className = 'login-overlay active';
  voiceModalEl.id = 'ai-voice-concierge-overlay';

  voiceModalEl.innerHTML = `
    <div class="login-modal" style="max-width: 680px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      
      <!-- AI Header Hero -->
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); padding: 22px 26px; border-bottom: 1px solid rgba(255,255,255,0.1); position: relative;">
        <button id="ai-voice-close" style="position: absolute; right: 20px; top: 20px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer;">✕</button>
        
        <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 40px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);">
              ✨
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 800; color: #a5b4fc; text-transform: uppercase; letter-spacing: 0.5px;">Gemini-Powered Smart Assistant</div>
              <h2 style="font-size: 20px; font-weight: 800; margin: 2px 0 0; color: white;">FoodDash AI Food Concierge</h2>
            </div>
          </div>

          <button id="btn-toggle-voice-audio" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; padding: 6px 12px; font-size: 12px; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <span id="voice-audio-icon">🔊</span> <span id="voice-audio-text">Audio On</span>
          </button>
        </div>
      </div>

      <!-- Main Body -->
      <div style="flex: 1; overflow-y: auto; padding: 22px 26px;">
        
        <!-- Microphone Listening Center -->
        <div style="text-align: center; margin-bottom: 24px; padding: 20px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--clr-border); border-radius: var(--radius-xl);">
          
          <button id="btn-mic-pulse" style="width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #ec4899); border: none; font-size: 32px; color: white; cursor: pointer; box-shadow: 0 0 25px rgba(99, 102, 241, 0.6); transition: all 0.3s; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
            🎙️
          </button>

          <div id="mic-status-label" style="font-size: 14px; font-weight: 700; color: white; margin-bottom: 4px;">
            Tap microphone to speak or choose a prompt below
          </div>

          <!-- Waveform Visualizer (Hidden when idle) -->
          <div id="voice-wave-container" style="display: none; align-items: center; justify-content: center; gap: 4px; height: 24px; margin: 10px auto;">
            <span class="wave-bar" style="width: 4px; height: 10px; background: #818cf8; border-radius: 4px; animation: waveAnim 0.6s infinite alternate ease-in-out;"></span>
            <span class="wave-bar" style="width: 4px; height: 22px; background: #ec4899; border-radius: 4px; animation: waveAnim 0.8s infinite alternate ease-in-out 0.1s;"></span>
            <span class="wave-bar" style="width: 4px; height: 16px; background: #818cf8; border-radius: 4px; animation: waveAnim 0.7s infinite alternate ease-in-out 0.2s;"></span>
            <span class="wave-bar" style="width: 4px; height: 24px; background: #ec4899; border-radius: 4px; animation: waveAnim 0.9s infinite alternate ease-in-out 0.3s;"></span>
            <span class="wave-bar" style="width: 4px; height: 12px; background: #818cf8; border-radius: 4px; animation: waveAnim 0.6s infinite alternate ease-in-out 0.15s;"></span>
          </div>

          <!-- Text input alternative -->
          <form id="ai-text-search-form" style="display: flex; gap: 8px; max-width: 500px; margin: 14px auto 0;">
            <input type="text" id="ai-text-input" placeholder="e.g. Spicy Biryani under ₹350 in Koramangala" style="flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.06); border: 1px solid var(--clr-border); border-radius: var(--radius-md); color: white; font-size: 13px;" />
            <button type="submit" class="btn btn-primary btn-sm" style="background: #6366f1; border: none; border-radius: var(--radius-md); font-weight: 800; padding: 0 16px;">
              Ask AI
            </button>
          </form>
        </div>

        <!-- Quick Prompt Chips -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase; margin-bottom: 8px;">Try saying or tapping:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;" id="ai-preset-chips">
            <button class="ai-prompt-chip" data-prompt="Spicy Chicken Biryani under 350" style="background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border); border-radius: var(--radius-full); padding: 6px 12px; font-size: 12px; color: #e2e8f0; cursor: pointer;">
              🍗 Spicy Biryani under ₹350
            </button>
            <button class="ai-prompt-chip" data-prompt="Pure Veg Italian Pizza and Pasta" style="background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border); border-radius: var(--radius-full); padding: 6px 12px; font-size: 12px; color: #e2e8f0; cursor: pointer;">
              🥗 Pure Veg Italian Pasta & Pizza
            </button>
            <button class="ai-prompt-chip" data-prompt="Fast delivery cheesy burger under 20 mins" style="background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border); border-radius: var(--radius-full); padding: 6px 12px; font-size: 12px; color: #e2e8f0; cursor: pointer;">
              🍔 Fast Cheesy Burger in 20m
            </button>
            <button class="ai-prompt-chip" data-prompt="Healthy protein salad and bowls for dinner" style="background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border); border-radius: var(--radius-full); padding: 6px 12px; font-size: 12px; color: #e2e8f0; cursor: pointer;">
              🥗 Healthy Protein Bowls
            </button>
            <button class="ai-prompt-chip" data-prompt="Cold ice cream and chocolate desserts" style="background: rgba(255,255,255,0.04); border: 1px solid var(--clr-border); border-radius: var(--radius-full); padding: 6px 12px; font-size: 12px; color: #e2e8f0; cursor: pointer;">
              🍨 Ice Creams & Desserts
            </button>
          </div>
        </div>

        <!-- Dynamic AI Results Pane -->
        <div id="ai-results-pane">
          <!-- Filled dynamically -->
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(voiceModalEl);

  // Close handlers
  voiceModalEl.querySelector('#ai-voice-close').addEventListener('click', () => {
    stopSpeechSynthesis();
    stopListening();
    voiceModalEl.remove();
  });
  voiceModalEl.addEventListener('click', (e) => {
    if (e.target === voiceModalEl) {
      stopSpeechSynthesis();
      stopListening();
      voiceModalEl.remove();
    }
  });

  // Audio Toggle
  const audioBtn = voiceModalEl.querySelector('#btn-toggle-voice-audio');
  audioBtn.addEventListener('click', () => {
    isSpeakingAudio = !isSpeakingAudio;
    voiceModalEl.querySelector('#voice-audio-icon').textContent = isSpeakingAudio ? '🔊' : '🔇';
    voiceModalEl.querySelector('#voice-audio-text').textContent = isSpeakingAudio ? 'Audio On' : 'Muted';
    if (!isSpeakingAudio) stopSpeechSynthesis();
  });

  // Text submit
  const textForm = voiceModalEl.querySelector('#ai-text-search-form');
  textForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = voiceModalEl.querySelector('#ai-text-input').value.trim();
    if (query) executeAiQuery(query);
  });

  // Prompt chips
  voiceModalEl.querySelectorAll('.ai-prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      executeAiQuery(chip.dataset.prompt);
    });
  });

  // Microphone toggle
  const micBtn = voiceModalEl.querySelector('#btn-mic-pulse');
  micBtn.addEventListener('click', () => {
    toggleVoiceRecognition();
  });

  // Setup Web Speech API
  function initSpeech() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      speechRecognition = new SpeechRec();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = 'en-IN';

      speechRecognition.onstart = () => {
        setListeningState(true);
      };

      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        voiceModalEl.querySelector('#ai-text-input').value = transcript;
        setListeningState(false);
        executeAiQuery(transcript);
      };

      speechRecognition.onerror = (event) => {
        setListeningState(false);
        showToast('Voice search not recognized. Please try typing your request.', '🎙️');
      };

      speechRecognition.onend = () => {
        setListeningState(false);
      };
    }
  }

  initSpeech();

  function setListeningState(isListening) {
    const mic = voiceModalEl.querySelector('#btn-mic-pulse');
    const label = voiceModalEl.querySelector('#mic-status-label');
    const wave = voiceModalEl.querySelector('#voice-wave-container');
    if (!mic) return;

    if (isListening) {
      mic.style.boxShadow = '0 0 35px #ec4899';
      mic.style.transform = 'scale(1.1)';
      label.textContent = 'Listening to your voice... Speak now!';
      label.style.color = '#f472b6';
      wave.style.display = 'flex';
    } else {
      mic.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.6)';
      mic.style.transform = 'scale(1)';
      label.textContent = 'Tap microphone to speak or choose a prompt below';
      label.style.color = 'white';
      wave.style.display = 'none';
    }
  }

  function toggleVoiceRecognition() {
    if (!speechRecognition) {
      showToast('Speech Recognition is not supported in this browser. Please type below!', 'ℹ️');
      return;
    }
    try {
      speechRecognition.start();
    } catch (e) {
      speechRecognition.stop();
    }
  }

  function stopListening() {
    if (speechRecognition) {
      try { speechRecognition.stop(); } catch (e) {}
    }
  }

  function speakText(text) {
    if (!isSpeakingAudio || !window.speechSynthesis) return;
    stopSpeechSynthesis();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeechSynthesis() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  async function executeAiQuery(query) {
    const pane = voiceModalEl.querySelector('#ai-results-pane');
    if (!pane) return;

    stopSpeechSynthesis();
    pane.innerHTML = `
      <div style="text-align: center; padding: 30px 10px; color: var(--clr-text-muted);">
        <div style="font-size: 32px; animation: spin 1s linear infinite; display: inline-block; margin-bottom: 8px;">✨</div>
        <div style="font-size: 14px; font-weight: 700; color: white;">FoodDash AI is finding perfect dishes for "${query}"...</div>
      </div>
    `;

    try {
      const activeLoc = getActiveDeliveryLocation() || {};
      const res = await queryAiFoodConcierge(query, {
        cityId: activeLoc.city || 'bangalore',
        cityName: activeLoc.cityName || activeLoc.city || 'Bangalore',
        area: activeLoc.area || ''
      });

      if (res && res.success) {
        speakText(res.aiMessage);
        renderAiResults(res);
      } else {
        pane.innerHTML = `<div style="color: #f87171; text-align: center; padding: 20px;">Could not process recommendations.</div>`;
      }
    } catch (err) {
      pane.innerHTML = `<div style="color: #f87171; text-align: center; padding: 20px;">AI service unavailable. Please check your connection.</div>`;
    }
  }

  function renderAiResults(data) {
    const pane = voiceModalEl.querySelector('#ai-results-pane');
    if (!pane) return;

    pane.innerHTML = `
      <!-- Conversational Speech Bubble -->
      <div style="background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: var(--radius-lg); padding: 14px 18px; margin-bottom: 18px; display: flex; gap: 12px; align-items: flex-start;">
        <span style="font-size: 22px;">🤖</span>
        <div style="font-size: 13px; line-height: 1.5; color: #c7d2fe; font-weight: 600;">
          ${data.aiMessage}
        </div>
      </div>

      <!-- Suggested Dishes Grid -->
      <h3 style="font-size: 15px; font-weight: 800; margin: 0 0 12px; color: white; display: flex; align-items: center; gap: 6px;">
        <span>🍽️</span> Recommended Dishes (${data.topDishes.length})
      </h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px; margin-bottom: 20px;">
        ${data.topDishes.map((item, idx) => `
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius-lg); padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span>${item.dish.isVeg ? '🥗' : '🍗'}</span>
                  <span style="font-weight: 800; font-size: 14px; color: white;">${item.dish.name}</span>
                </div>
                <span style="font-size: 14px; font-weight: 900; color: #4ade80;">₹${item.dish.price}</span>
              </div>
              <div style="font-size: 12px; color: var(--clr-text-muted); margin-bottom: 8px;">
                🏪 <b>${item.restaurant.name}</b> • ⭐ ${item.restaurant.rating} • ⏱️ ${item.restaurant.deliveryTime}
              </div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button class="btn btn-primary btn-sm btn-ai-add-cart" data-idx="${idx}" style="flex: 1; background: linear-gradient(135deg, #10b981, #059669); border: none; font-weight: 800; font-size: 12px; border-radius: var(--radius-md); padding: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span>⚡</span> Add to Cart (₹${item.dish.price})
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // 1-Click Cart Addition
    pane.querySelectorAll('.btn-ai-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemObj = data.topDishes[btn.dataset.idx];
        if (itemObj) {
          addToCart(itemObj.dish, itemObj.restaurant.id, itemObj.restaurant.name);
          showToast(`Added ${itemObj.dish.name} from ${itemObj.restaurant.name} to Cart! 🛍️`, '✅');
          btn.innerHTML = `<span>✓</span> In Cart!`;
          btn.style.background = '#3b82f6';
        }
      });
    });
  }
}
