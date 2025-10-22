/**
 * CharacterStats
 * -------------------------
 * Represents a full D&D character's stats and information.
 * Handles linking between data and the character sheet UI.
 *
 * Parameters:
 *     data (object): Optional — initial character data to load
 *
 * Methods:
 *     updateAbility(stat, value): updates an ability score and recalculates modifier
 *     getModifier(score): returns the D&D modifier for a given score
 *     calculateProficiencyBonus(): sets PB based on level
 *     updateUI(): syncs all current data to visible elements
 *     loadFromUI(): reads current input values from the sheet into the object
 *     toggleProficiency(category, key): toggles proficiency/expertise (saving throws, skills)
 */

class CharacterStats {
    constructor(data = {}) {
        this.name = data.name || '';
        this.level = data.level || 1;
        this.xp = data.xp || 0;
        this.class = data.class || '';
        this.background = data.background || '';
        this.species = data.species || '';

        this.abilities = {
            str: data.str || 10,
            dex: data.dex || 10,
            con: data.con || 10,
            int: data.int || 10,
            wis: data.wis || 10,
            cha: data.cha || 10
        };

        this.savingThrows = {
            str: false,
            dex: false,
            con: false,
            int: false,
            wis: false,
            cha: false
        };

        this.skills = {}; // e.g. { acrobatics: "expertise", stealth: "proficient" }

        this.proficiencyBonus = this.calculateProficiencyBonus();
        this.passivePerception = this.getModifier(this.abilities.wis) + 10;
    }


    /**
     * Calculates the D&D modifier for a given ability score.
     */
    getModifier(score) {
        return Math.floor((score - 10) / 2);
    }


    /**
     * Calculates proficiency bonus from character level.
     */
    calculateProficiencyBonus() {
        return Math.floor((this.level - 1) / 4) + 2;
    }


    /**
     * Updates an ability and recalculates related values.
     */
    updateAbility(stat, value) {
        this.abilities[stat] = value;
        this.passivePerception = this.getModifier(this.abilities.wis) + 10;
        this.updateUI();
    }


    /**
     * Loads data from the visible character sheet inputs into this object.
     */
    loadFromUI() {
        this.name = document.getElementById('char-name').value;
        this.class = document.getElementById('char-class').value;
        this.background = document.getElementById('background').value;
        this.species = document.getElementById('species').value;
        this.level = parseInt(document.getElementById('level').value) || 1;
        this.xp = parseInt(document.getElementById('xp').value) || 0;

        document.querySelectorAll('.ability').forEach(box => {
            const stat = box.dataset.stat;
            const input = box.querySelector('input');
            if (stat && input) {
                this.abilities[stat] = parseInt(input.value) || 10;
            }
        });
    }


    /**
     * Updates all relevant UI elements to reflect current data.
     */
    updateUI() {
        // Update proficiency bonus
        document.getElementById('proficiency-bonus').textContent = `+${this.calculateProficiencyBonus()}`;

        // Update passive perception
        document.getElementById('passive-perception').textContent = this.passivePerception;

        // Update ability modifiers and scores
        for (const [stat, value] of Object.entries(this.abilities)) {
            const box = document.querySelector(`.ability[data-stat="${stat}"]`);
            if (!box) continue;

            const mod = this.getModifier(value);
            const modEl = box.querySelector('.modifier');
            const input = box.querySelector('input');
            if (modEl) modEl.textContent = mod >= 0 ? `+${mod}` : mod;
            if (input) input.value = value;
        }
    }
}

export default CharacterStats;
