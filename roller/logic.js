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
/**
 * Rolls a single die with the given number of sides.
 *
 * Parameters:
 *     sides (number): Number of sides on the die
 *
 * Returns:
 *     result (number): Random roll between 1 and sides
 */
function roll(sides) {
    if (sides <= 0 || !Number.isInteger(sides)) {
        throw new Error("Invalid die sides");
    }
    return Math.floor(Math.random() * sides) + 1;
}

/**
 * Rolls a d20 with advantage (roll twice, take higher)
 */
function advantage(sides) {
    const a = roll(sides);
    const b = roll(sides);
    return Math.max(a, b);
}

/**
 * Rolls a d20 with disadvantage (roll twice, take lower)
 */
function disadvantage(sides) {
    const a = roll(sides);
    const b = roll(sides);
    return Math.min(a, b);
}

/**
 * Elven Accuracy: roll 3 times, take highest
 */
function elvenAdvantage(sides) {
    const rolls = [roll(sides), roll(sides), roll(sides)];
    return Math.max(...rolls);
}

/**
 * Re-roll all 1s, use new roll
 */
function rerollOnes(sides, count) {
    const results = [];
    for (let i = 0; i < count; i++) {
        let r = roll(sides);
        if (r === 1) r = roll(sides);
        results.push(r);
    }
    return results;
}

/**
 * Savage Attacker: roll twice, use total from higher set
 */
function savageAttack(sides, count) {
    const first = Array.from({ length: count }, () => roll(sides));
    const second = Array.from({ length: count }, () => roll(sides));

    const totalFirst = first.reduce((a, b) => a + b, 0);
    const totalSecond = second.reduce((a, b) => a + b, 0);

    return totalFirst >= totalSecond ? first : second;
}

/**
 * Elemental Adept: treat all 1s as 2s
 */
function elemAdept(sides, count) {
    return Array.from({ length: count }, () => {
        const r = roll(sides);
        return r === 1 ? 2 : r;
    });
}

/**
 * Piercer: reroll lowest die once, must use new value
 */
function piercer(sides, count) {
    const results = Array.from({ length: count }, () => roll(sides));
    let lowestIndex = 0;
    for (let i = 1; i < results.length; i++) {
        if (results[i] < results[lowestIndex]) {
            lowestIndex = i;
        }
    }

    // Reroll the lowest and replace it
    results[lowestIndex] = roll(sides);
    return results;
}

/**
 * Great Weapon Fighting: treat 1s and 2s as 3s
 */
function gwf(sides, count) {
    return Array.from({ length: count }, () => {
        const r = roll(sides);
        return r <= 2 ? 3 : r;
    });
}

/**
 * Treat any roll under 10 as a 10 (used for Reliable Talent, Starry Form, etc.)
 */
function tenLow(sides) {
    const r = roll(sides);
    return r < 10 ? 10 : r;
}

/**
 * Parses the dice input text and returns structured dice clusters.
 *
 * Returns:
 *     clusters (Array): Array of objects with shape:
 *         {
 *           count (number): number of dice
 *           sides (number): number of sides
 *           modifiers (Array of strings): symbols of applied modifiers
 *         }
 */
function parseDiceInputBox() {
    const rawText = inputBox.textContent.trim();
    const clusters = [];

    // Skip empty or placeholder
    if (!rawText || rawText === "Click a die to begin") {
        return clusters;
    }

    // Separate by + signs
    const parts = rawText.split(/\s*\+\s*/);

    for (const part of parts) {
        // Match clusters like "2d6[⚔][🔨]"
        const match = part.match(/^(\d+)d(\d+)((?:\[[^\]]+\])*)$/);

        if (match) {
            const [, countStr, sidesStr, modBlock] = match;
            const count = parseInt(countStr, 10);
            const sides = parseInt(sidesStr, 10);

            // Extract all modifier symbols within brackets
            const modifiers = [];
            const symbolMatches = [...modBlock.matchAll(/\[([^\]]+)\]/g)];
            for (const m of symbolMatches) {
                const group = m[1];
                for (const char of group) {
                    modifiers.push(char);
                }
            }

            clusters.push({ count, sides, modifiers });
        } else {
            // Assume it's a standalone modifier like "+5"
            const mod = parseInt(part, 10);
            if (!isNaN(mod)) {
                clusters.push({ type: "modifier", value: mod });
            }
        }
    }

    return clusters;
}

const symbolToModifier = {};
for (const [name, data] of Object.entries(modifiers)) {
    symbolToModifier[data.symbol] = name;
}


/**
 * Safely checks if a modifier symbol exists in a cluster and maps to a given modifier name
 */
function hasMod(cluster, targetMod) {
    if (!cluster.modifiers || !Array.isArray(cluster.modifiers)) return false;

    return cluster.modifiers.some(sym => {
        const name = symbolToModifier[sym];
        return name === targetMod;
    });
}

/**
 * Rolls a dice cluster with appropriate modifier logic applied.
 */
function rollDiceCluster(cluster) {
    const { count, sides, modifiers } = cluster;

    // ADVANTAGE/DISADVANTAGE/ELVEN
    if (hasMod(cluster, "Advantage")) {
        return Array.from({ length: count }, () => advantage(sides)).reduce((a, b) => a + b, 0);
    }
    if (hasMod(cluster, "Disadvantage")) {
        return Array.from({ length: count }, () => disadvantage(sides)).reduce((a, b) => a + b, 0);
    }
    if (hasMod(cluster, "Advantage: Elven Accuracy")) {
        return Array.from({ length: count }, () => elvenAdvantage(sides)).reduce((a, b) => a + b, 0);
    }

    // ADVANCED ROLLERS (return full sets)
    if (hasMod(cluster, "Savage Attacker")) {
        return savageAttack(sides, count).reduce((a, b) => a + b, 0);
    }
    if (hasMod(cluster, "Piercer")) {
        return piercer(sides, count).reduce((a, b) => a + b, 0);
    }

    // FLAT MODIFIER ALTERING LOGIC
    let rolls = Array.from({ length: count }, () => roll(sides));

    if (hasMod(cluster, "Healer") || hasMod(cluster, "Tavern Brawler")) {
        rolls = rerollOnes(sides, count);
    }

    if (hasMod(cluster, "Elemental Adept")) {
        rolls = rolls.map(v => v === 1 ? 2 : v);
    }

    if (hasMod(cluster, "Great Weapon Fighting")) {
        rolls = rolls.map(v => v <= 2 ? 3 : v);
    }

    if (
        hasMod(cluster, "Starry Form: Dragon") ||
        hasMod(cluster, "Reliable Talent") ||
        hasMod(cluster, "Trance of Order")
    ) {
        rolls = rolls.map(v => v < 10 ? 10 : v);
    }

    return rolls.reduce((a, b) => a + b, 0);
}

/**
 * Executes the full roll sequence:
 * - Parses the dice input box
 * - Rolls each dice cluster with appropriate modifiers
 * - Sums the results and adds flat modifier
 * - Displays the final total
 */
function executeFullRoll() {
    const clusters = parseDiceInputBox();  // Get dice + modifier groupings
    let total = 0;

    for (const cluster of clusters) {
        total += rollDiceCluster(cluster); // Sum the results of each cluster
    }

    // Add flat modifier if present
    const flatMod = parseInt(customModInput.value);
    if (!isNaN(flatMod)) {
        total += flatMod;
    }
    
    // Display the result
    inputBox.textContent = `${total}`;
}
