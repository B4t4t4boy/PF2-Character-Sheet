const { invoke } = window.__TAURI__.core;

// Utility to calculate PF1e ability modifier
function calcMod(score) {
  if (!score || isNaN(score)) return 0;
  return Math.floor((score - 10) / 2);
}

// Ensure proper sign display (+/-)
function formatMod(mod) {
  if (mod > 0) return `+${mod}`;
  return mod.toString();
}

function getVal(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const val = parseInt(el.value, 10);
  return isNaN(val) ? 0 : val;
}

function setVal(id, val, format = false) {
  const el = document.getElementById(id);
  if (el) {
    if (format && el.type === 'number') {
      el.type = 'text';
    }
    el.value = format ? formatMod(val) : val;
  }
}

// Main recalculation logic
function recalculateAll() {
  // Abilities
  const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const mods = {};

  abilities.forEach(ab => {
    const base = getVal(`${ab}-base`);
    const bonus = getVal(`${ab}-bonus`);
    
    const score = base + bonus;
    setVal(`${ab}-score`, score);

    const mod = calcMod(score);
    setVal(`${ab}-mod`, mod, true);
    
    mods[ab] = mod;
  });

  // AC
  setVal('ac-dex', mods.dex, true);
  const acArmor = getVal('ac-armor');
  const acShield = getVal('ac-shield');
  const acSize = getVal('ac-size');
  const acNat = getVal('ac-nat');
  const acDefl = getVal('ac-defl');
  const acMisc = getVal('ac-misc');

  const acTotal = 10 + acArmor + acShield + mods.dex + acSize + acNat + acDefl + acMisc;
  const acTouch = 10 + mods.dex + acSize + acDefl + acMisc;
  const acFlat = 10 + acArmor + acShield + acSize + acNat + acDefl + acMisc; // Simplified flat footed (no dex if positive, unless uncanny dodge, ignoring complex rules for now)

  setVal('ac-total', acTotal);
  setVal('ac-touch', acTouch);
  setVal('ac-flat', acFlat);

  // Initiative
  setVal('init-dex', mods.dex, true);
  const initMisc = getVal('init-misc');
  setVal('init-total', mods.dex + initMisc, true);

  // Saves
  const saves = [
    { id: 'fort', ability: 'con' },
    { id: 'ref', ability: 'dex' },
    { id: 'will', ability: 'wis' }
  ];

  saves.forEach(save => {
    const abMod = mods[save.ability];
    setVal(`${save.id}-ability`, abMod, true);

    const base = getVal(`${save.id}-base`);
    const magic = getVal(`${save.id}-magic`);
    const misc = getVal(`${save.id}-misc`);
    
    // Read temp directly if user entered it (PF sheets usually have a manual temp input for saves)
    const tempEl = document.getElementById(`${save.id}-temp`);
    const temp = (tempEl && tempEl.value !== "") ? parseInt(tempEl.value, 10) : 0;

    const total = base + abMod + magic + misc + temp;
    setVal(`${save.id}-total`, total, true);
  });

  // Offense
  const bab = getVal('bab');
  setVal('cmb-bab', bab, true);
  setVal('cmb-str', mods.str, true);
  const cmbSize = getVal('cmb-size');
  setVal('cmb-total', bab + mods.str + cmbSize, true);

  setVal('cmd-bab', bab, true);
  setVal('cmd-str', mods.str, true);
  setVal('cmd-dex', mods.dex, true);
  const cmdSize = getVal('cmd-size');
  setVal('cmd-total', 10 + bab + mods.str + mods.dex + cmdSize);
}

function setupListeners() {
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    if (!input.readOnly) {
      input.addEventListener('input', recalculateAll);
    }
  });

  // Hook up roll buttons
  const rollBtns = document.querySelectorAll('.roll-btn');
  rollBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Very basic "roll" representation
      const name = btn.textContent;
      console.log(`Rolling ${name}...`);
    });
  });
}

async function loadCharacter() {
  try {
    const char = await invoke("get_character");
    console.log("Loaded character from rust:", char);
    
    // In a full app, we would map the `char` struct to our HTML inputs here.
    // For now, since it returns defaults, we will just run the calculations.
    
    recalculateAll();

  } catch (error) {
    console.error("Failed to load character:", error);
  }
}

// --- Classes Logic ---
const PF1E_CLASSES = {
  // Core Classes
  "Barbarian": { bab: "full", fort: "good", ref: "poor", will: "poor" },
  "Bard": { bab: "medium", fort: "poor", ref: "good", will: "good" },
  "Cleric": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  "Druid": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  "Fighter": { bab: "full", fort: "good", ref: "poor", will: "poor" },
  "Monk": { bab: "medium", fort: "good", ref: "good", will: "good" },
  "Paladin": { bab: "full", fort: "good", ref: "poor", will: "good" },
  "Ranger": { bab: "full", fort: "good", ref: "good", will: "poor" },
  "Rogue": { bab: "medium", fort: "poor", ref: "good", will: "poor" },
  "Sorcerer": { bab: "slow", fort: "poor", ref: "poor", will: "good" },
  "Wizard": { bab: "slow", fort: "poor", ref: "poor", will: "good" },
  
  // Base Classes
  "Alchemist": { bab: "medium", fort: "good", ref: "good", will: "poor" },
  "Cavalier": { bab: "full", fort: "good", ref: "poor", will: "poor" },
  "Gunslinger": { bab: "full", fort: "good", ref: "good", will: "poor" },
  "Inquisitor": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  "Magus": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  "Oracle": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  "Summoner": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  "Witch": { bab: "slow", fort: "poor", ref: "poor", will: "good" },
  
  // Alternate Classes
  "Antipaladin": { bab: "full", fort: "good", ref: "poor", will: "good" },
  "Ninja": { bab: "medium", fort: "poor", ref: "good", will: "poor" },
  "Samurai": { bab: "full", fort: "good", ref: "poor", will: "poor" },
  
  // Hybrid Classes
  "Arcanist": { bab: "slow", fort: "poor", ref: "poor", will: "good" },
  "Bloodrager": { bab: "full", fort: "good", ref: "poor", will: "poor" },
  "Brawler": { bab: "full", fort: "good", ref: "good", will: "poor" },
  "Hunter": { bab: "medium", fort: "good", ref: "good", will: "poor" },
  "Investigator": { bab: "medium", fort: "poor", ref: "good", will: "good" },
  "Shaman": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  "Skald": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  "Slayer": { bab: "full", fort: "good", ref: "good", will: "poor" },
  "Swashbuckler": { bab: "full", fort: "poor", ref: "good", will: "poor" },
  "Warpriest": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  
  // Occult Classes
  "Kineticist": { bab: "medium", fort: "good", ref: "good", will: "poor" },
  "Medium": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  "Mesmerist": { bab: "medium", fort: "poor", ref: "good", will: "good" },
  "Occultist": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  "Psychic": { bab: "slow", fort: "poor", ref: "poor", will: "good" },
  "Spiritualist": { bab: "medium", fort: "good", ref: "poor", will: "good" },
  
  // Unchained Classes
  "Unchained Barbarian": { bab: "full", fort: "good", ref: "poor", will: "poor" },
  "Unchained Monk": { bab: "full", fort: "good", ref: "good", will: "poor" },
  "Unchained Rogue": { bab: "medium", fort: "poor", ref: "good", will: "poor" },
  "Unchained Summoner": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  
  // NPC Classes
  "Adept": { bab: "slow", fort: "poor", ref: "poor", will: "good" },
  "Aristocrat": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  "Commoner": { bab: "slow", fort: "poor", ref: "poor", will: "poor" },
  "Expert": { bab: "medium", fort: "poor", ref: "poor", will: "good" },
  "Warrior": { bab: "full", fort: "good", ref: "poor", will: "poor" }
};

let classData = [
  { type: 'Fighter', name: '', level: 1, bab: 1, fort: 2, ref: 0, will: 0 }
];

function updateClassStats(cls) {
  const data = PF1E_CLASSES[cls.type];
  if (!data) return;
  
  const level = cls.level;
  
  if (data.bab === 'full') cls.bab = Math.floor(level);
  else if (data.bab === 'medium') cls.bab = Math.floor(level * 0.75);
  else if (data.bab === 'slow') cls.bab = Math.floor(level * 0.5);
  
  const calcSave = (progression) => {
    if (progression === 'good') return Math.floor(level / 2) + 2;
    return Math.floor(level / 3);
  };
  
  cls.fort = calcSave(data.fort);
  cls.ref = calcSave(data.ref);
  cls.will = calcSave(data.will);
}

function renderClasses() {
  const container = document.getElementById('classes-container');
  if (!container) return;
  container.innerHTML = '';
  
  const classNames = ["Custom", ...Object.keys(PF1E_CLASSES).sort()];
  
  classData.forEach((cls, idx) => {
    const isKnown = PF1E_CLASSES[cls.type] !== undefined;
    const readonlyAttr = isKnown ? 'readonly' : '';
    const styling = isKnown ? 'style="background-color: #f0f0f0; color: #555;"' : '';
    
    // Create dropdown options
    const optionsHtml = classNames.map(cn => 
      `<option value="${cn}" ${cls.type === cn || (cn === 'Custom' && !PF1E_CLASSES[cls.type]) ? 'selected' : ''}>${cn}</option>`
    ).join('');

    const row = document.createElement('div');
    row.className = 'class-row';
    row.innerHTML = `
      <select class="cls-type" data-idx="${idx}" style="text-align: left; height: 25px; border: 1px solid var(--input-border); font-family: inherit; font-size: 14px;">
        ${optionsHtml}
      </select>
      <input type="text" class="cls-name" data-idx="${idx}" value="${cls.name}" placeholder="e.g. Archetype" style="text-align: left; padding-left: 5px; height: 25px;">
      <input type="number" class="cls-level" data-idx="${idx}" value="${cls.level}">
      <input type="number" class="cls-bab" data-idx="${idx}" value="${cls.bab}" ${readonlyAttr} ${styling}>
      <input type="number" class="cls-fort" data-idx="${idx}" value="${cls.fort}" ${readonlyAttr} ${styling}>
      <input type="number" class="cls-ref" data-idx="${idx}" value="${cls.ref}" ${readonlyAttr} ${styling}>
      <input type="number" class="cls-will" data-idx="${idx}" value="${cls.will}" ${readonlyAttr} ${styling}>
      <button class="del-class-btn" data-idx="${idx}" ${classData.length === 1 ? 'disabled' : ''}>X</button>
    `;
    container.appendChild(row);
  });

  // Attach listeners for inputs (Level, Name and stats if Custom)
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx, 10);
      const field = e.target.className.split('-')[1]; // e.g. cls-bab -> bab or cls-name -> name
      
      if (field === 'name') {
        classData[idx].name = e.target.value;
      } else {
        const val = parseInt(e.target.value, 10);
        classData[idx][field] = isNaN(val) ? 0 : val;
        
        // If level changed and it's a known class, auto-calc
        if (field === 'level' && PF1E_CLASSES[classData[idx].type]) {
           updateClassStats(classData[idx]);
           const row = e.target.closest('.class-row');
           row.querySelector('.cls-bab').value = classData[idx].bab;
           row.querySelector('.cls-fort').value = classData[idx].fort;
           row.querySelector('.cls-ref').value = classData[idx].ref;
           row.querySelector('.cls-will').value = classData[idx].will;
        }
      }
      
      aggregateClasses();
    });
  });

  // Attach listener for the select dropdown
  container.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.idx, 10);
      const selectedVal = e.target.value;
      classData[idx].type = selectedVal;
      
      if (PF1E_CLASSES[selectedVal]) {
        updateClassStats(classData[idx]);
      }
      
      renderClasses(); // Re-render to lock/unlock inputs
      aggregateClasses();
    });
  });

  container.querySelectorAll('.del-class-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx, 10);
      classData.splice(idx, 1);
      renderClasses();
      aggregateClasses();
    });
  });
}

function aggregateClasses() {
  let totalLevel = 0;
  let totalBab = 0;
  let totalFort = 0;
  let totalRef = 0;
  let totalWill = 0;

  classData.forEach(cls => {
    totalLevel += cls.level;
    totalBab += cls.bab;
    totalFort += cls.fort;
    totalRef += cls.ref;
    totalWill += cls.will;
  });

  let classSummary = classData.map(c => `${c.name || c.type || 'Custom'} ${c.level}`).join(' / ');
  const classHeaderEl = document.getElementById('char-class');
  if (classHeaderEl) classHeaderEl.value = classSummary;

  setVal('bab', totalBab);
  setVal('fort-base', totalFort);
  setVal('ref-base', totalRef);
  setVal('will-base', totalWill);

  recalculateAll();
}

function setupClassListeners() {
  const addBtn = document.getElementById('add-class-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      classData.push({ type: 'Custom', name: '', level: 1, bab: 0, fort: 0, ref: 0, will: 0 });
      renderClasses();
      aggregateClasses();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  setupListeners();
  setupClassListeners();
  setupToolbarListeners();
  renderClasses();
  aggregateClasses(); // Initialize values on load
  loadCharacter();
});

// --- Export and Persistence Logic ---

async function saveCharacter() {
  const data = {
    classData: classData,
    inputs: {}
  };

  // Grab all inputs and selects that have an ID
  const elements = document.querySelectorAll('input[id], select[id]');
  elements.forEach(el => {
    if (el.id !== 'file-upload') {
      data.inputs[el.id] = el.value;
    }
  });

  const dataStr = JSON.stringify(data, null, 2);
  try {
    await invoke("save_character_file", { json: dataStr });
  } catch (error) {
    console.error("Failed to save:", error);
  }
}

async function loadCharacterData() {
  try {
    const jsonStr = await invoke("load_character_file");
    const data = JSON.parse(jsonStr);
    
    if (data.classData && Array.isArray(data.classData)) {
      classData = data.classData;
      renderClasses();
    }
    
    if (data.inputs) {
      for (const [id, value] of Object.entries(data.inputs)) {
        const el = document.getElementById(id);
        if (el) {
          el.value = value;
        }
      }
    }
    
    aggregateClasses();
    recalculateAll();
  } catch (err) {
    if (err !== "No file selected") {
      console.error("Failed to parse JSON", err);
      alert("Invalid character file.");
    }
  }
}

function printToPDF() {
  window.print();
}

function setupToolbarListeners() {
  const btnSave = document.getElementById('btn-save');
  const btnLoad = document.getElementById('btn-load');
  const btnPrint = document.getElementById('btn-print');

  if (btnSave) btnSave.addEventListener('click', saveCharacter);
  if (btnPrint) btnPrint.addEventListener('click', printToPDF);
  if (btnLoad) btnLoad.addEventListener('click', loadCharacterData);
}
