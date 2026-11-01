const menuToggle = document.getElementById('menuToggle');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closePanelBtn = document.getElementById('closePanelBtn');
const playBtn = document.getElementById('playBtn');
const hudPresetBtn = document.getElementById('hudPresetBtn');
const inventoryBtn = document.getElementById('inventoryBtn');
const closeInventoryBtn = document.getElementById('closeInventoryBtn');
const inventoryOverlay = document.getElementById('inventoryOverlay');
const tabButtons = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.inventory-panel');
const hudArrangementBtn = document.getElementById('hudArrangementBtn');
const hudArrangementOverlay = document.getElementById('hudArrangementOverlay');
const closeHudArrangementBtn = document.getElementById('closeHudArrangementBtn');
const STORAGE_KEY = 'aexo-client-settings-v1';

function getToggleKey(input) {
  const row = input.closest('.mod-row, .toggle-row, .setting-row');
  const label = row?.querySelector('span');
  const raw = label?.textContent?.trim() || input.id || input.name || 'checkbox';
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveState() {
  const toggles = {};
  document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    toggles[getToggleKey(input)] = input.checked;
  });

  const hud = {};
  document.querySelectorAll('.hud-item').forEach((item) => {
    const key = item.dataset.name || 'hud-item';
    hud[key] = {
      left: item.style.left || '',
      top: item.style.top || '',
      right: item.style.right || '',
      bottom: item.style.bottom || ''
    };
  });

  const state = {
    inventoryOpen: !inventoryOverlay?.classList.contains('hidden'),
    settingsOpen: !settingsPanel?.classList.contains('hidden'),
    hudOpen: !hudArrangementOverlay?.classList.contains('hidden'),
    toggles,
    hud
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applySavedState() {
  const state = loadState();

  if (state.toggles) {
    document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      const key = getToggleKey(input);
      if (state.toggles[key] !== undefined) {
        input.checked = Boolean(state.toggles[key]);
      }
    });
  }

  if (state.hud) {
    document.querySelectorAll('.hud-item').forEach((item) => {
      const key = item.dataset.name || 'hud-item';
      const pos = state.hud[key];
      if (!pos) return;
      if (pos.left) item.style.left = pos.left;
      if (pos.top) item.style.top = pos.top;
      if (pos.right) item.style.right = pos.right;
      if (pos.bottom) item.style.bottom = pos.bottom;
    });
  }

  if (state.inventoryOpen === false) {
    inventoryOverlay?.classList.add('hidden');
  } else {
    inventoryOverlay?.classList.remove('hidden');
  }

  if (state.settingsOpen === false) {
    settingsPanel?.classList.add('hidden');
  } else {
    settingsPanel?.classList.remove('hidden');
  }

  if (state.hudOpen === false) {
    hudArrangementOverlay?.classList.add('hidden');
  } else {
    hudArrangementOverlay?.classList.remove('hidden');
  }
}

function toggleSettingsPanel() {
  settingsPanel.classList.toggle('hidden');
  saveState();
}

function toggleInventory() {
  inventoryOverlay.classList.toggle('hidden');
  saveState();
}

function toggleHudArrangement() {
  hudArrangementOverlay.classList.toggle('hidden');
  saveState();
}

menuToggle?.addEventListener('click', () => {
  settingsPanel.classList.add('hidden');
  saveState();
});

settingsBtn?.addEventListener('click', toggleSettingsPanel);
closePanelBtn?.addEventListener('click', toggleSettingsPanel);
inventoryBtn?.addEventListener('click', toggleInventory);
closeInventoryBtn?.addEventListener('click', toggleInventory);
hudArrangementBtn?.addEventListener('click', () => {
  toggleInventory();
  toggleHudArrangement();
});
closeHudArrangementBtn?.addEventListener('click', toggleHudArrangement);

playBtn?.addEventListener('click', () => {
  alert('Connect the verified Eaglercraft 26.3 build or approved server URL here.');
});

hudPresetBtn?.addEventListener('click', () => {
  const hudText = document.querySelector('.hud-text');
  const miniText = document.querySelector('.hud-text.mini');

  if (hudText && miniText) {
    hudText.textContent = 'Preset: Compact';
    miniText.textContent = 'FPS 60 • Dmg 0.0';
  }
});

const themeRoot = document.documentElement;
const colorInput = document.querySelector('input[type="color"]');

colorInput?.addEventListener('input', (event) => {
  const value = event.target.value;
  themeRoot.style.setProperty('--accent', value);
  themeRoot.style.setProperty('--accent-strong', value);
  saveState();
});

const touchToggles = document.querySelectorAll('input[type="checkbox"]');
for (const toggle of touchToggles) {
  toggle.addEventListener('change', () => {
    const row = toggle.closest('label, .mod-row');
    if (row) {
      row.style.opacity = toggle.checked ? '1' : '0.82';
    }
    saveState();
  });
}

const serverItems = document.querySelectorAll('.list-item');
serverItems.forEach((item) => {
  item.addEventListener('click', () => {
    serverItems.forEach((entry) => entry.classList.remove('active'));
    item.classList.add('active');
  });
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetName = button.dataset.tab;

    tabButtons.forEach((tab) => tab.classList.toggle('active', tab === button));
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === targetName);
    });
  });
});

const dragItems = document.querySelectorAll('.hud-item');
let dragState = null;

for (const item of dragItems) {
  item.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    const stage = document.getElementById('hudStage');
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    dragState = {
      element: item,
      offsetX: event.clientX - rect.left - item.offsetLeft,
      offsetY: event.clientY - rect.top - item.offsetTop,
    };

    item.setPointerCapture(event.pointerId);
  });

  item.addEventListener('pointermove', (event) => {
    if (!dragState || dragState.element !== item) return;

    const stage = document.getElementById('hudStage');
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - rect.left - dragState.offsetX, 0), rect.width - item.offsetWidth);
    const y = Math.min(Math.max(event.clientY - rect.top - dragState.offsetY, 0), rect.height - item.offsetHeight);

    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.bottom = 'auto';
    item.style.right = 'auto';
  });

  item.addEventListener('pointerup', () => {
    dragState = null;
    saveState();
  });

  item.addEventListener('pointerleave', () => {
    dragState = null;
    saveState();
  });
}

applySavedState();

if (window.matchMedia('(display-mode: standalone)').matches || /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.body.classList.add('ios-mode');
}

console.log('aexo Client shell initialized. Settings and HUD layout are saved locally on this device.');
