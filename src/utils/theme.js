// ============================================================
// FoodDash Theme & Template Style Engine
// ============================================================
import { sounds } from './audio.js';

const THEME_KEY = 'fooddash_theme';
const TEMPLATE_KEY = 'fooddash_template_style';

export const THEMES = [
  {
    id: 'cyber-dark',
    name: 'Midnight Crimson',
    icon: '🌙',
    primary: '#ff3366',
    accent: '#ffb703',
    bg: '#07090e',
    desc: 'Deep velvety midnight with energetic coral-crimson'
  },
  {
    id: 'hyper-neon',
    name: 'Hyper Neon Cyber',
    icon: '⚡',
    primary: '#00f0ff',
    accent: '#ff007f',
    bg: '#090814',
    desc: 'Futuristic neon cyan and radiant electric pink'
  },
  {
    id: 'royal-gold',
    name: 'Royal Dubai Gold',
    icon: '👑',
    primary: '#f59e0b',
    accent: '#e11d48',
    bg: '#0a0907',
    desc: 'Luxurious imperial gold with warm amber sheen'
  },
  {
    id: 'sunset-ember',
    name: 'Sunset Ember',
    icon: '🔥',
    primary: '#ff6b35',
    accent: '#f7b801',
    bg: '#110b08',
    desc: 'Warm fiery orange and golden honey'
  },
  {
    id: 'emerald-mint',
    name: 'Emerald Gourmet',
    icon: '🌿',
    primary: '#00e676',
    accent: '#ffd166',
    bg: '#05130d',
    desc: 'Fresh botanical mint and rich forest green'
  },
  {
    id: 'neon-violet',
    name: 'Neon Amethyst',
    icon: '💜',
    primary: '#a855f7',
    accent: '#ec4899',
    bg: '#0c0817',
    desc: 'Cyberpunk violet and electric magenta'
  },
  {
    id: 'ocean-azure',
    name: 'Ocean Azure',
    icon: '🌊',
    primary: '#00b4d8',
    accent: '#90e0ef',
    bg: '#040f1a',
    desc: 'Cool sapphire blue and crystal cyan'
  },
  {
    id: 'luxe-light',
    name: 'Luxe Daytime',
    icon: '☀️',
    primary: '#e11d48',
    accent: '#f59e0b',
    bg: '#f8fafc',
    desc: 'Pristine light background with crisp shadows'
  }
];

export const TEMPLATES = [
  {
    id: 'modern-glass',
    name: 'Modern Glassmorphic',
    icon: '✨',
    desc: 'Frosted backdrops, glowing borders, smooth rounded corners'
  },
  {
    id: 'clean-minimal',
    name: 'Crisp Minimalist',
    icon: '📐',
    desc: 'Clean geometric lines, compact spacing, focused typography'
  },
  {
    id: 'vibrant-punchy',
    name: 'Vibrant Dynamic',
    icon: '⚡',
    desc: 'High contrast badges, bold accents, prominent elevation'
  }
];

let currentTheme = localStorage.getItem(THEME_KEY) || 'cyber-dark';
let currentTemplate = localStorage.getItem(TEMPLATE_KEY) || 'modern-glass';
let listeners = [];

export function getTheme() {
  return currentTheme;
}

export function getTemplateStyle() {
  return currentTemplate;
}

export function setTheme(themeId) {
  currentTheme = themeId;
  localStorage.setItem(THEME_KEY, themeId);
  applyThemeToDOM();
  sounds.playPop();
  listeners.forEach(fn => fn({ theme: currentTheme, template: currentTemplate }));
}

export function setTemplateStyle(templateId) {
  currentTemplate = templateId;
  localStorage.setItem(TEMPLATE_KEY, templateId);
  applyThemeToDOM();
  sounds.playPop();
  listeners.forEach(fn => fn({ theme: currentTheme, template: currentTemplate }));
}

export function onThemeChange(fn) {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function applyThemeToDOM() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.setAttribute('data-template', currentTemplate);
}

// Initial apply
applyThemeToDOM();
