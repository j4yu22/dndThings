const modifiers = {
  'Advantage': {
    abreviation: "adv",
    limited_to: ["d20"],
    mutually_exclusive: ['Disadvantage', ],
    description: "You can reroll a d20 Test and use the higher result.",
  },
  'Disadvantage': {
    abreviation: "disadv",
    limited_to: ["d20"],
    mutually_exclusive: [],
    description: "You can reroll a d20 Test and use the lower result.",
  },
  'Advantage: Elven Accuracy': {
    abreviation: "elven",
    limited_to: ["d20"],
    mutually_exclusive: [],
    description: "Whenever you have advantage on an attack roll using Dexterity, Intelligence, Wisdom, or Charisma, you can reroll one of the dice once.",
  },
  'Healer': {
    abreviation: "healer",
    limited_to: [],
    mutually_exclusive: [],
    description: "Whenever you roll a die to determine the number of Hit Points you restore with a spell or with this feat’s Battle Medic benefit, you can reroll the die if it rolls a 1, and you must use the new roll.",
  },
  "Savage Attacker": {
    abreviation: "savage",
    limited_to: [],
    mutually_exclusive: [],
    description: "Once per turn when you hit a target with a weapon, you can roll the weapon’s damage dice twice and use either roll against the target.",
  },
  "Tavern Brawler": {
    abreviation: "tavern",
    limited_to: [],
    mutually_exclusive: [],
    description: "Whenever you roll a damage die for your Unarmed Strike, you can reroll the die if it rolls a 1, and you must use the new roll.",
  },
  "Elemental Adept": {
    abreviation: "elemental",
    limited_to: [],
    mutually_exclusive: [],
    description: "Spells you cast ignore Resistance to a chosen element. When you roll damage for a spell of that type, you can treat any 1 as a 2.",
  },
  'Piercer': {
    abreviation: "piercer",
    limited_to: [],
    mutually_exclusive: [],
    description: "Once per turn, when you hit a creature with an attack that deals Piercing damage, you can reroll one of the attack’s damage dice, and you must use the new roll.",
  },
  "Great Weapon Fighting": {
    abreviation: "gwm",
    limited_to: [],
    mutually_exclusive: [],
    description: "When you roll damage with a two-handed melee weapon, treat 1s and 2s as 3s.",
  },
  "Starry Form: Dragon": {
    abreviation: "dragon",
    limited_to: ["d20"],
    mutually_exclusive: [],
    description: "When you make an INT/WIS check or CON save to maintain Concentration, treat a roll of 9 or lower on the d20 as a 10.",
  },
  "Reliable Talent": {
    abreviation: "reliable",
    limited_to: ["d20"],
    mutually_exclusive: [],
    description: "Whenever you make an ability check using a skill/tool you're proficient in, treat a d20 roll of 9 or lower as a 10.",
  },
  "Trance of Order": {
    abreviation: "trance",
    limited_to: ["d20"],
    mutually_exclusive: [],
    description: "Attack rolls against you can’t benefit from Advantage. When you make a d20 Test, treat rolls of 9 or lower as 10.",
  }
};
