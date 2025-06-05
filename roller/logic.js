const modifiers = {
  'Advantage': {
    abreviation: "adv",
    symbol: "☘",
    limited_to: ["d20"],
    mutually_exclusive: ['Disadvantage','Advantage: Elven Accuracy'],
    description: "You can reroll a d20 Test and use the higher result.",
    
  },
  'Disadvantage': {
    abreviation: "disadv",
    symbol: "☠",
    limited_to: ["d20"],
    mutually_exclusive: ['Advantage', 'Advantage: Elven Accuracy'],
    description: "You can reroll a d20 Test and use the lower result.",
  },
  'Advantage: Elven Accuracy': {
    abreviation: "adv:ea",
    symbol: "🍀",
    limited_to: ["d20"],
    mutually_exclusive: ['Advantage', 'Disadvantage', 'Starry Form: Dragon', 'Reliable Talent', 'Trance of Order'],
    description: "Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once.",
  },
  'Healer': {
    abreviation: "hlr",
    symbol: "♡",
    limited_to: [],
    mutually_exclusive: ['Savage Attacker', 'Tavern Brawler', 'Elemental Adept', 'Piercer', 'Great Weapon Fighting'],
    description: "Whenever you roll a die to determine the number of Hit Points you restore with a spell or with this feat’s Battle Medic benefit, you can reroll the die if it rolls a 1, and you must use the new roll.",
  },
  'Savage Attacker': {
    abreviation: "svg atk",
    symbol: "⚔",
    limited_to: [],
    mutually_exclusive: ['Healer', 'Elemental Adept', 'Tavern Brawler'],
    description: "Once per turn when you hit a target with a weapon, you can roll the weapon’s damage dice twice and use either roll against the target.",
  },
  'Tavern Brawler': {
    abreviation: "tvrn brwlr",
    symbol: "🤜",
    limited_to: [],
    mutually_exclusive: ['Healer', 'Elemental Adept', 'Savage Attacker', 'Piercer', 'Great Weapon Fighting'],
    description: "Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll.",
  },
  'Elemental Adept': {
    abreviation: "elm adpt",
    symbol: "⚡",
    limited_to: [],
    mutually_exclusive: ['Healer', 'Savage Attacker', 'Piercer', 'Great Weapon Fighting', 'Tavern Brawler'],
    description: "Spells you cast ignore Resistance to a chosen element. When you roll damage for a spell of that type, you can treat any 1 as a 2.",
  },
  'Piercer': {
    abreviation: "prcr",
    symbol: "↣",
    limited_to: [],
    mutually_exclusive: ['Healer', 'Elemental Adept', 'Tavern Brawler'],
    description: "Once per turn, when you hit a creature with an attack that deals Piercing damage, you can reroll one of the attack’s damage dice, and you must use the new roll.",
  },
  'Great Weapon Fighting': {
    abreviation: "gwf",
    symbol: "🔨",
    limited_to: [],
    mutually_exclusive: ['Healer', 'Elemental Adept', 'Tavern Brawler'],
    description: "When you roll damage with a two-handed melee weapon, treat 1s and 2s as 3s.",
  },
  'Starry Form: Dragon': {
    abreviation: "sf: drgn",
    symbol: "🐉",
    limited_to: ["d20"],
    mutually_exclusive: ['Advantage: Elven Accuracy', 'Reliable Talent', 'Trance of Order'],
    description: "When you make an INT/WIS check or CON save to maintain Concentration, treat a roll of 9 or lower on the d20 as a 10.",
  },
  'Reliable Talent': {
    abreviation: "rel tlnt",
    symbol: "🗡",
    limited_to: ["d20"],
    mutually_exclusive: ['Advantage: Elven Accuracy', 'Trance of Order', 'Starry Form: Dragon'],
    description: "Whenever you make an ability check using a skill/tool you're proficient in, treat a d20 roll of 9 or lower as a 10.",
  },
  'Trance of Order': {
    abreviation: "trnc of ord",
    symbol: "⏱",
    limited_to: ["d20"],
    mutually_exclusive: ['Advantage: Elven Accuracy', 'Starry Form: Dragon', 'Reliable Talent'],
    description: "Attack rolls against you can’t benefit from Advantage. When you make a d20 Test, treat rolls of 9 or lower as 10.",
  }
};

const symbolToModifier = {};
for (const [modName, data] of Object.entries(modifiers)) {
  symbolToModifier[data.symbol] = modName;
}

// ----------------------
// UTILITY ROLL FUNCTION
// ----------------------
function roll(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// ----------------------
// FORMULA + CLUSTERING
// ----------------------
function getFormulaText(rollEntries) {
  const grouped = {};
  for (const entry of rollEntries) {
    const key = `${entry.die}_${entry.modifiers.join(",")}`;
    if (!grouped[key]) {
      grouped[key] = { count: 0, die: entry.die, modifiers: entry.modifiers };
    }
    grouped[key].count++;
  }

  return Object.values(grouped).map(group => {
    const modIcons = group.modifiers.map(mod => modifiers[mod].symbol).join("");
    return `${group.count}d${group.die}${modIcons ? `[${modIcons}]` : ""}`;
  }).join(" + ");
}

function parseClusters(rollEntries) {
  const clustered = {};
  for (const entry of rollEntries) {
    const key = `${entry.die}_${entry.modifiers.join(",")}`;
    if (!clustered[key]) {
      clustered[key] = { count: 0, die: entry.die, modifiers: entry.modifiers };
    }
    clustered[key].count++;
  }
  return Object.values(clustered);
}

// Modifiers
function advantage(die) {
  const a = roll(die);
  const b = roll(die);
  const used = Math.max(a, b);
  const formatted = `[${a === used ? `<b>${a}</b>` : a}|${b === used ? `<b>${b}</b>` : b}]`;
  return { sum: used, formatted };
}

function disadvantage(die) {
  const a = roll(die);
  const b = roll(die);
  const used = Math.min(a, b);
  const formatted = `[${a === used ? `<b>${a}</b>` : a}|${b === used ? `<b>${b}</b>` : b}]`;
  return { sum: used, formatted };
}

function elvenAdvantage(die) {
  const rolls = [roll(die), roll(die), roll(die)];
  const used = Math.max(...rolls);
  const formatted = `[${rolls.map(v => v === used ? `<b>${v}</b>` : v).join("|")}]`;
  return { sum: used, formatted };
}

function rerollOnes(die) {
  const r1 = roll(die);
  if (r1 === 1) {
    const r2 = roll(die);
    return { sum: r2, formatted: `[1 > <b>${r2}</b>]` };
  }
  return { sum: r1, formatted: `${r1}` };
}

function savageAttacker(die, count) {
  const first = Array.from({ length: count }, () => roll(die));
  const second = Array.from({ length: count }, () => roll(die));
  const sum1 = first.reduce((a, b) => a + b);
  const sum2 = second.reduce((a, b) => a + b);
  const used = sum1 >= sum2 ? first : second;
  return {
    sum: used.reduce((a, b) => a + b),
    formatted: `[${used.map(v => `<b>${v}</b>`).join("+")}]`
  };
}

function elemAdept(die) {
  const r = roll(die);
  if (r === 1) return { sum: 2, formatted: `[1 > <b>2</b>]` };
  return { sum: r, formatted: `${r}` };
}

function piercer(die, count) {
  const rolls = Array.from({ length: count }, () => roll(die));
  let lowestIndex = 0;

  for (let i = 1; i < rolls.length; i++) {
    if (rolls[i] < rolls[lowestIndex]) lowestIndex = i;
  }

  const old = rolls[lowestIndex];
  const rerollThreshold = Math.floor(die / 2);  // Reroll if strictly less than this

  let note = "";
  if (old < rerollThreshold) {
    const replacement = roll(die);
    rolls[lowestIndex] = replacement;
    note = `, was ${old}`;
  }

  return {
    sum: rolls.reduce((a, b) => a + b),
    formatted: `[${rolls.map((v, i) =>
      i === lowestIndex ? `<b>${v}</b>` : v
    ).join("+")}${note}]`
  };
}


function gwf(die) {
  const r = roll(die);
  if (r <= 2) return { sum: 3, formatted: `[${r} > <b>3</b>]` };
  return { sum: r, formatted: `${r}` };
}

function leastTen(die) {
  const r = roll(die);
  if (r < 10) return { sum: 10, formatted: `[${r} > <b>10</b>]` };
  return { sum: r, formatted: `${r}` };
}

// ----------------------
// SUBTOTAL / MODIFIER LOGIC
// ----------------------
function getSubtotal(cluster) {
  const { count, die, modifiers } = cluster;
  const sym = (symbol) => cluster.modifiers.includes(symbolToModifier[symbol]);


  let results = [];
  let sum = 0;

  // Whole-cluster modifiers (like Savage Attacker or Piercer)
  if (sym("⚔")) {
    const { sum: s, formatted } = savageAttacker(die, count);
    return { sum: s, text: formatted };
  }

  if (sym("↣")) {
    const { sum: s, formatted } = piercer(die, count);
    return { sum: s, text: formatted };
  }

  // Individual die rolls with per-die modifiers
  for (let i = 0; i < count; i++) {
    let result;

    if (sym("☘")) result = advantage(die);
    else if (sym("☠")) result = disadvantage(die);
    else if (sym("🍀")) result = elvenAdvantage(die);
    else if (sym("♡") || sym("🤜")) result = rerollOnes(die);
    else if (sym("⚡")) result = elemAdept(die);
    else if (sym("🔨")) result = gwf(die);
    else if (sym("🐉") || sym("🗡") || sym("⏱")) result = leastTen(die);
    else {
      const r = roll(die);
      result = { sum: r, formatted: `${r}` };
    }

    sum += result.sum;
    results.push(result.formatted);
  }

  return {
    sum,
    text: results.join(" + ")
  };
}

// ----------------------
// RENDER ROLL RESULTS
// ----------------------
function renderRollResult(rollEntries) {
  const clusters = parseClusters(rollEntries);
  const formula = getFormulaText(rollEntries);
  const subtotals = [];
  let total = 0;

  for (const cluster of clusters) {
    const { sum, text } = getSubtotal(cluster);
    subtotals.push(text);
    total += sum;
  }

  const mod = parseInt(document.getElementById("custom-modifier").value);
    if (!isNaN(mod) && mod !== 0) {
    total += mod;
    subtotals.push(`${mod}`);
    }


  const inputBox = document.getElementById("inputBox");
  inputBox.innerHTML = `${formula} ➤ ${subtotals.join(" + ")} ➤ ${total}`;
}

// ----------------------
// MAIN EXECUTION ENTRY
// ----------------------
function executeFullRoll() {
  renderRollResult(rollEntries);
}