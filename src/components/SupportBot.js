// ============================================================
// AI Foodie Assistant & 24x7 Customer Support Chatbot
// ============================================================
import { sounds } from '../utils/audio.js';

let botWidgetEl = null;
let isOpen = false;

export function initSupportBot() {
  botWidgetEl = document.createElement('div');
  botWidgetEl.id = 'support-bot-container';
  document.body.appendChild(botWidgetEl);
  renderBotWidget();
}

function renderBotWidget() {
  botWidgetEl.innerHTML = `
    <!-- Floating Launcher Trigger Button -->
    <button id="support-bot-trigger" aria-label="Open Foodie Assistant Chat" style="position: fixed; bottom: 85px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #ff4757, #ff6b81); color: white; border: none; box-shadow: 0 8px 24px rgba(255, 71, 87, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 26px; z-index: 998; transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);">
      💬
    </button>

    <!-- Chat Box Window -->
    <div id="support-chat-window" style="display: none; position: fixed; bottom: 155px; right: 24px; width: 360px; height: 480px; max-width: calc(100vw - 48px); background: var(--clr-bg-elevated); border: 1px solid var(--clr-border); border-radius: var(--radius-xl); box-shadow: var(--shadow-2xl); z-index: 999; flex-direction: column; overflow: hidden; animation: scaleIn 0.2s ease;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1f2430 0%, #151821 100%); padding: 14px 18px; border-bottom: 1px solid var(--clr-border); display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #ff4757, #ff6b81); display: flex; align-items: center; justify-content: center; font-size: 16px;">
            🤖
          </div>
          <div>
            <div style="font-size: 14px; font-weight: bold; color: white;">FoodDash Assistant</div>
            <div style="font-size: 11px; color: #00e676; display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #00e676;"></span> Online 24x7
            </div>
          </div>
        </div>
        <button id="close-chat-btn" style="background: rgba(255,255,255,0.1); border: none; border-radius: 50%; width: 28px; height: 28px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Messages Area -->
      <div id="chat-messages" style="flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;">
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; border-top-left-radius: 2px; padding: 10px 14px; font-size: 13px; max-width: 85%; line-height: 1.4;">
          👋 Hi! I am your <b>FoodDash AI Assistant</b>. How can I help you today?
        </div>

        <!-- Quick suggestion chips -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;" id="bot-quick-chips">
          <button class="cart-chip" data-msg="Where is my order?">🛵 Track Order</button>
          <button class="cart-chip" data-msg="Today's best discount coupons?">🏷️ Top Coupons</button>
          <button class="cart-chip" data-msg="Refund and cancellation policy">💰 Refund Policy</button>
        </div>
      </div>

      <!-- Input Form -->
      <form id="chat-input-form" style="padding: 10px 14px; border-top: 1px solid var(--clr-border); display: flex; gap: 8px; background: var(--clr-bg);">
        <input type="text" id="chat-text-input" placeholder="Type a message or question..." class="login-modal__input" style="font-size: 13px; padding: 8px 12px;" autocomplete="off" />
        <button type="submit" class="btn btn-primary btn-sm" style="padding: 8px 14px;">➤</button>
      </form>
    </div>
  `;

  const trigger = botWidgetEl.querySelector('#support-bot-trigger');
  const chatWindow = botWidgetEl.querySelector('#support-chat-window');
  const closeBtn = botWidgetEl.querySelector('#close-chat-btn');
  const messagesEl = botWidgetEl.querySelector('#chat-messages');
  const form = botWidgetEl.querySelector('#chat-input-form');
  const input = botWidgetEl.querySelector('#chat-text-input');

  trigger.addEventListener('click', () => {
    isOpen = !isOpen;
    chatWindow.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      sounds.playPop();
      input.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    chatWindow.style.display = 'none';
  });

  botWidgetEl.querySelectorAll('#bot-quick-chips button').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.msg;
      sendUserMessage(text);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      sendUserMessage(text);
      input.value = '';
    }
  });

  async function sendUserMessage(text) {
    // Append user message
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'background: var(--clr-primary); color: white; border-radius: 14px; border-top-right-radius: 2px; padding: 10px 14px; font-size: 13px; max-width: 85%; align-self: flex-end; line-height: 1.4;';
    userMsg.textContent = text;
    messagesEl.appendChild(userMsg);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Typing indicator
    const typing = document.createElement('div');
    typing.style.cssText = 'background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; padding: 8px 12px; font-size: 12px; max-width: 80%; color: var(--clr-text-muted);';
    typing.innerHTML = 'Thinking... 💭';
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch('/api/orders/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      }).then(r => r.json());

      typing.remove();

      const botMsg = document.createElement('div');
      botMsg.style.cssText = 'background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 14px; border-top-left-radius: 2px; padding: 10px 14px; font-size: 13px; max-width: 85%; line-height: 1.4;';
      botMsg.innerHTML = res.reply ? res.reply.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') : 'I am here to help!';
      messagesEl.appendChild(botMsg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      sounds.playChime();
    } catch (e) {
      typing.remove();
    }
  }
}
