// ============================================================
// Group Order Room & Split-Bill Calculator ("Order with Friends")
// ============================================================
import { 
  getGroupSession, 
  startGroupSession, 
  addGroupParticipant, 
  leaveGroupSession, 
  getCart, 
  getCartTotal,
  onGroupChange
} from './CartState.js';
import { showToast } from './Toast.js';
import { sounds } from '../utils/audio.js';

let modalOverlayEl = null;

export function initGroupOrderModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'group-order-modal-overlay';
  document.body.appendChild(modalOverlayEl);

  onGroupChange(() => {
    if (modalOverlayEl.classList.contains('active')) {
      renderGroupOrderView();
    }
  });
}

export function openGroupOrderModal() {
  if (!modalOverlayEl) initGroupOrderModal();
  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  sounds.playPop();
  renderGroupOrderView();
}

export function closeGroupOrderModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderGroupOrderView() {
  if (!modalOverlayEl) return;

  const session = getGroupSession();
  const cart = getCart();

  if (!session) {
    // Creation / Join View
    modalOverlayEl.innerHTML = `
      <div class="login-modal group-modal" style="max-width: 520px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
        <div style="background: linear-gradient(135deg, #1f2533 0%, #12151e 100%); padding: 20px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
          <button id="group-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #00b4d8, #0077b6); display: flex; align-items: center; justify-content: center; font-size: 24px;">
              👥
            </div>
            <div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #00b4d8;">Collaborative Ordering</div>
              <h3 style="font-size: 19px; font-weight: 800; color: white; margin: 2px 0 0;">Order Together with Friends</h3>
            </div>
          </div>
        </div>

        <div style="padding: 24px; display: flex; flex-direction: column; gap: 18px;">
          <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; padding: 16px;">
            <div style="font-weight: 700; font-size: 14px; color: white; margin-bottom: 6px;">✨ How Group Orders Work:</div>
            <ul style="font-size: 12px; color: var(--clr-text-muted); line-height: 1.6; padding-left: 18px; margin: 0;">
              <li>Create a room and invite friends via link or room code.</li>
              <li>Everyone picks their own dishes from the menu under their name.</li>
              <li>Instantly split the bill item-by-item or equally with 1-click UPI links.</li>
            </ul>
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase;">Room / Squad Name</label>
            <input type="text" id="group-room-name" placeholder="e.g. Weekend Biryani Party 🍕" value="Foodie Squad Room" class="login-modal__input" style="margin-top: 6px;" />
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase;">Your Name (Host)</label>
            <input type="text" id="group-host-name" placeholder="e.g. Alex" value="You (Host)" class="login-modal__input" style="margin-top: 6px;" />
          </div>

          <div>
            <label style="font-size: 12px; font-weight: 700; color: var(--clr-text-muted); text-transform: uppercase;">Default Bill Split Mode</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;">
              <label class="custom-option-card selected" data-mode="itemized" style="padding: 10px; border: 1px solid var(--clr-border); border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600;">
                <input type="radio" name="group-split-mode" value="itemized" checked style="accent-color: #00b4d8;" />
                <span>🧾 Itemized Split (Pay what you order)</span>
              </label>
              <label class="custom-option-card" data-mode="equal" style="padding: 10px; border: 1px solid var(--clr-border); border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600;">
                <input type="radio" name="group-split-mode" value="equal" style="accent-color: #00b4d8;" />
                <span>⚖️ Equal Split (Split bill evenly)</span>
              </label>
            </div>
          </div>

          <button class="btn btn-primary" id="group-create-btn" style="padding: 14px; font-size: 14px; font-weight: 800; border-radius: 10px; background: linear-gradient(135deg, #00b4d8, #0077b6); border: none; box-shadow: 0 4px 16px rgba(0, 180, 216, 0.4);">
            🚀 Launch Group Order Session
          </button>
        </div>
      </div>
    `;

    modalOverlayEl.querySelector('#group-close-btn').addEventListener('click', closeGroupOrderModal);

    modalOverlayEl.querySelector('#group-create-btn').addEventListener('click', () => {
      const room = modalOverlayEl.querySelector('#group-room-name').value.trim() || 'Foodie Squad';
      const host = modalOverlayEl.querySelector('#group-host-name').value.trim() || 'Host';
      const mode = modalOverlayEl.querySelector('input[name="group-split-mode"]:checked')?.value || 'itemized';

      startGroupSession(room, host, mode);
      sounds.playSuccess();
      showToast(`Group Room Created: ${room}`, '👥');
    });

    return;
  }

  // Active Session View & Bill Split
  const total = getCartTotal();
  const deliveryFee = total > 199 ? 0 : 25;
  const tax = Math.round(total * 0.05);
  const platformFee = 6;
  const grandTotal = total > 0 ? total + deliveryFee + tax + platformFee : 0;

  // Compute breakdown per participant
  const memberTotals = {};
  session.participants.forEach(p => {
    memberTotals[p] = { items: [], subtotal: 0, shareOfFees: 0, totalDue: 0 };
  });

  cart.items.forEach(item => {
    const owner = item.participant || session.participants[0] || 'Unassigned';
    if (!memberTotals[owner]) {
      memberTotals[owner] = { items: [], subtotal: 0, shareOfFees: 0, totalDue: 0 };
    }
    const itemCost = (item.unitPrice || item.price) * item.qty;
    memberTotals[owner].items.push({ name: item.name, qty: item.qty, price: itemCost });
    memberTotals[owner].subtotal += itemCost;
  });

  const totalParticipants = session.participants.length || 1;
  const totalFees = deliveryFee + tax + platformFee;

  Object.keys(memberTotals).forEach(p => {
    if (session.splitMode === 'equal') {
      memberTotals[p].totalDue = grandTotal > 0 ? Math.round(grandTotal / totalParticipants) : 0;
    } else {
      // Itemized: item cost + proportional share of taxes/delivery
      const ratio = total > 0 ? memberTotals[p].subtotal / total : 1 / totalParticipants;
      memberTotals[p].shareOfFees = Math.round(totalFees * ratio);
      memberTotals[p].totalDue = memberTotals[p].subtotal + memberTotals[p].shareOfFees;
    }
  });

  modalOverlayEl.innerHTML = `
    <div class="login-modal group-modal" style="max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Active Room Header -->
      <div style="background: linear-gradient(135deg, #1b2230 0%, #11141c 100%); padding: 18px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="group-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        
        <div style="display: flex; align-items: center; justify-content: space-between; padding-right: 40px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 11px; background: #00b4d8; color: #000; font-weight: 800; padding: 2px 8px; border-radius: 4px;">ROOM ACTIVE</span>
              <span style="font-size: 12px; color: var(--clr-text-muted); font-weight: bold;">PIN: ${session.code}</span>
            </div>
            <h3 style="font-size: 18px; font-weight: 800; color: white; margin: 4px 0 0;">${session.roomName}</h3>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; color: var(--clr-text-muted);">Grand Total</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--clr-primary);">₹${grandTotal}</div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Invite & Add Members Bar -->
        <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; font-weight: 700; color: white;">👥 Squad Members (${session.participants.length})</span>
            <button class="btn btn-secondary btn-sm" id="group-copy-invite-btn" style="padding: 4px 10px; font-size: 11px;">
              📋 Copy Invite Link
            </button>
          </div>

          <!-- Add Member Input -->
          <div style="display: flex; gap: 8px;">
            <input type="text" id="group-new-member-name" placeholder="Friend's Name (e.g. Priya, Rahul)" class="login-modal__input" style="padding: 8px 12px; font-size: 13px;" />
            <button class="btn btn-primary btn-sm" id="group-add-member-btn" style="padding: 8px 16px; white-space: nowrap;">
              + Add
            </button>
          </div>

          <!-- Member Chips -->
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            ${session.participants.map(p => `
              <span style="background: rgba(0, 180, 216, 0.15); border: 1px solid rgba(0, 180, 216, 0.4); color: #00b4d8; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); display: flex; align-items: center; gap: 4px;">
                👤 ${p}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Split Bill Calculator Breakdown -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-size: 14px; font-weight: 800; color: white;">
              🧾 ${session.splitMode === 'equal' ? 'Equal Split Summary' : 'Itemized Split Summary'}
            </div>
            <button class="btn btn-ghost btn-sm" id="group-toggle-mode-btn" style="font-size: 11px; color: #00b4d8;">
              Switch to ${session.splitMode === 'equal' ? 'Itemized Split' : 'Equal Split'}
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${Object.keys(memberTotals).map(p => {
              const info = memberTotals[p];
              return `
                <div style="background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: 12px; padding: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-weight: 700; font-size: 14px; color: white; display: flex; align-items: center; gap: 6px;">
                      <span>👤</span> ${p}
                    </div>
                    <div style="font-size: 15px; font-weight: 800; color: #00e676;">
                      Owes: ₹${info.totalDue}
                    </div>
                  </div>

                  ${info.items.length > 0 ? `
                    <div style="margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px; display: flex; flex-direction: column; gap: 4px;">
                      ${info.items.map(it => `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--clr-text-muted);">
                          <span>${it.qty}x ${it.name}</span>
                          <span>₹${it.price}</span>
                        </div>
                      `).join('')}
                      ${session.splitMode !== 'equal' && info.shareOfFees > 0 ? `
                        <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.4);">
                          <span>Taxes & Delivery Share</span>
                          <span>+₹${info.shareOfFees}</span>
                        </div>
                      ` : ''}
                    </div>
                  ` : `
                    <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 6px;">No items assigned yet</div>
                  `}
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Share Split Bill Button -->
        <button class="btn btn-secondary" id="group-share-bill-btn" style="padding: 12px; font-size: 13px; font-weight: 700; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
          📲 Copy WhatsApp / UPI Payment Split Request
        </button>

      </div>

      <!-- Footer Action -->
      <div style="padding: 14px 24px; background: var(--clr-bg-elevated); border-top: 1px solid var(--clr-border); display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-ghost btn-sm" id="group-leave-btn" style="color: #ff5252; font-size: 12px;">
          🚪 End Group Session
        </button>
        <button class="btn btn-primary" id="group-order-now-btn" style="padding: 10px 20px; font-size: 13px; font-weight: 700;">
          Continue with Order
        </button>
      </div>
    </div>
  `;

  // Attach Listeners
  modalOverlayEl.querySelector('#group-close-btn').addEventListener('click', closeGroupOrderModal);

  modalOverlayEl.querySelector('#group-order-now-btn').addEventListener('click', () => {
    closeGroupOrderModal();
    showToast('Group order active! Dishes will be tagged by member.', '🛍️');
  });

  // Add Member
  const addBtn = modalOverlayEl.querySelector('#group-add-member-btn');
  const inputEl = modalOverlayEl.querySelector('#group-new-member-name');
  addBtn.addEventListener('click', () => {
    const name = inputEl.value.trim();
    if (name) {
      addGroupParticipant(name);
      sounds.playPop();
      showToast(`Added ${name} to group!`, '👤');
      renderGroupOrderView();
    }
  });

  // Toggle Mode
  modalOverlayEl.querySelector('#group-toggle-mode-btn').addEventListener('click', () => {
    session.splitMode = session.splitMode === 'equal' ? 'itemized' : 'equal';
    localStorage.setItem('fooddash_group_session', JSON.stringify(session));
    sounds.playPop();
    renderGroupOrderView();
  });

  // Copy invite
  modalOverlayEl.querySelector('#group-copy-invite-btn').addEventListener('click', () => {
    const inviteText = `🍔 Join my FoodDash Group Order room: "${session.roomName}"! Use Room Code: ${session.code} to add your favorite dishes: ${window.location.origin}`;
    navigator.clipboard?.writeText(inviteText);
    sounds.playPop();
    showToast('Group invite link copied to clipboard!', '📋');
  });

  // Share split
  modalOverlayEl.querySelector('#group-share-bill-btn').addEventListener('click', () => {
    let billMsg = `🍕 *FoodDash Split Bill Request* — Room: ${session.roomName}\nTotal Bill: ₹${grandTotal}\n\n`;
    Object.keys(memberTotals).forEach(p => {
      billMsg += `• ${p}: ₹${memberTotals[p].totalDue}\n`;
    });
    billMsg += `\nPay via UPI to Host: upi://${session.code}@fooddash`;
    navigator.clipboard?.writeText(billMsg);
    sounds.playPop();
    showToast('Split bill breakdown copied to clipboard!', '📲');
  });

  // Leave / End
  modalOverlayEl.querySelector('#group-leave-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to end this group order session?')) {
      leaveGroupSession();
      sounds.playPop();
      showToast('Group order session ended', '🚪');
    }
  });
}
