// ============================================================
// Theme & Template Customization Studio Modal
// ============================================================
import { 
  THEMES, 
  TEMPLATES, 
  getTheme, 
  getTemplateStyle, 
  setTheme, 
  setTemplateStyle, 
  onThemeChange 
} from '../utils/theme.js';
import { showToast } from './Toast.js';

let modalOverlayEl = null;

export function initThemeModal() {
  if (modalOverlayEl) return;
  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'login-overlay';
  modalOverlayEl.id = 'theme-modal-overlay';
  document.body.appendChild(modalOverlayEl);

  onThemeChange(() => {
    if (modalOverlayEl.classList.contains('active')) {
      renderThemeView();
    }
  });
}

export function openThemeModal() {
  if (!modalOverlayEl) initThemeModal();
  modalOverlayEl.classList.add('active');
  document.body.style.overflow = 'hidden';
  renderThemeView();
}

export function closeThemeModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderThemeView() {
  if (!modalOverlayEl) return;

  const currentTheme = getTheme();
  const currentTemplate = getTemplateStyle();

  modalOverlayEl.innerHTML = `
    <div class="login-modal theme-studio-modal" style="max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; padding: 0;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, var(--clr-bg-elevated) 0%, var(--clr-bg) 100%); padding: 18px 24px; border-bottom: 1px solid var(--clr-border); position: relative;">
        <button id="theme-close-btn" style="position: absolute; right: 18px; top: 18px; background: rgba(255,255,255,0.08); border-radius: 50%; width: 32px; height: 32px; color: var(--clr-text); cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: var(--grad-primary); display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: var(--shadow-glow);">
            🎨
          </div>
          <div>
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--clr-primary); letter-spacing: 1px;">Appearance Studio</div>
            <h3 style="font-size: 19px; font-weight: 800; color: var(--clr-text); margin: 2px 0 0;">Adjust Theme & Template</h3>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div style="flex: 1; overflow-y: auto; padding: 22px 24px; display: flex; flex-direction: column; gap: 24px;">
        
        <!-- Palette Chooser -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--clr-text-secondary); letter-spacing: 0.5px;">1. Color Theme Palette</span>
            <span style="font-size: 11px; color: var(--clr-text-muted);">Instant Live Preview</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px;">
            ${THEMES.map(theme => `
              <div class="theme-palette-card ${theme.id === currentTheme ? 'active' : ''}" data-theme-id="${theme.id}" style="background: var(--clr-surface); border: 2px solid ${theme.id === currentTheme ? 'var(--clr-primary)' : 'var(--clr-border)'}; border-radius: 12px; padding: 12px 14px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.2s;">
                <div style="display: flex; gap: 4px; align-items: center;">
                  <span style="width: 22px; height: 22px; border-radius: 50%; background: ${theme.primary}; display: inline-block; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></span>
                  <span style="width: 14px; height: 14px; border-radius: 50%; background: ${theme.accent}; display: inline-block; margin-left: -8px; border: 2px solid var(--clr-surface);"></span>
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 700; font-size: 13px; color: var(--clr-text); display: flex; align-items: center; gap: 6px;">
                    <span>${theme.icon}</span> ${theme.name}
                  </div>
                  <div style="font-size: 10px; color: var(--clr-text-muted); margin-top: 2px;">${theme.desc}</div>
                </div>
                ${theme.id === currentTheme ? `
                  <div style="font-size: 14px; color: var(--clr-primary); font-weight: bold;">✓</div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Template Layout Style Chooser -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: var(--clr-text-secondary); letter-spacing: 0.5px;">2. Template & UI Style</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${TEMPLATES.map(tpl => `
              <div class="template-style-card ${tpl.id === currentTemplate ? 'active' : ''}" data-tpl-id="${tpl.id}" style="background: var(--clr-surface); border: 2px solid ${tpl.id === currentTemplate ? 'var(--clr-primary)' : 'var(--clr-border)'}; border-radius: 12px; padding: 14px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="font-size: 22px;">${tpl.icon}</div>
                  <div>
                    <div style="font-weight: 700; font-size: 13px; color: var(--clr-text);">${tpl.name}</div>
                    <div style="font-size: 11px; color: var(--clr-text-muted); margin-top: 2px;">${tpl.desc}</div>
                  </div>
                </div>
                <input type="radio" name="tpl-radio" ${tpl.id === currentTemplate ? 'checked' : ''} style="accent-color: var(--clr-primary);" />
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Footer Action -->
      <div style="padding: 14px 24px; background: var(--clr-bg-elevated); border-top: 1px solid var(--clr-border); display: flex; justify-content: flex-end;">
        <button class="btn btn-primary" id="theme-done-btn" style="padding: 10px 24px; font-weight: 700; font-size: 13px;">
          Apply & Save Theme ✓
        </button>
      </div>
    </div>
  `;

  // Attach Listeners
  modalOverlayEl.querySelector('#theme-close-btn').addEventListener('click', closeThemeModal);
  modalOverlayEl.querySelector('#theme-done-btn').addEventListener('click', () => {
    closeThemeModal();
    showToast('Theme preferences saved!', '🎨');
  });

  // Palette Click
  modalOverlayEl.querySelectorAll('.theme-palette-card').forEach(card => {
    card.addEventListener('click', () => {
      const themeId = card.dataset.themeId;
      setTheme(themeId);
      renderThemeView();
    });
  });

  // Template Click
  modalOverlayEl.querySelectorAll('.template-style-card').forEach(card => {
    card.addEventListener('click', () => {
      const tplId = card.dataset.tplId;
      setTemplateStyle(tplId);
      renderThemeView();
    });
  });
}
