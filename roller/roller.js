const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
const counts = {
    d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, custom: 0
};

const inputBox = document.getElementById('inputBox');
const customModInput = document.getElementById("custom-modifier");
const customSidesInput = document.getElementById("custom-sides");
const rollEntries = [];
const sides = parseInt(customSidesInput.value);

function getCurrentModifiersForDie(dieType) {
    return Array.from(activeModifiers).filter(mod => {
        const modData = modifiers[mod];
        return modData && (modData.limited_to.length === 0 || modData.limited_to.includes(dieType));
    });
}

function updateInputBox() {
    const grouped = {};

    for (const entry of rollEntries) {
        // Create a unique key for each (die, modifier combo)
        const key = `${entry.die}_${entry.modifiers.join(",")}`;

        if (!grouped[key]) {
            grouped[key] = {
                count: 0,
                sides: entry.die,
                modifiers: entry.modifiers
            };
        }

        grouped[key].count++;
    }

    const parts = Object.values(grouped).map(group => {
        const modIcons = group.modifiers
            .map(mod => modifiers[mod]?.symbol || "") // use symbol safely
            .filter(sym => sym !== "")                // remove any blanks
            .join("");

        return `${group.count}d${group.sides}${modIcons ? `[${modIcons}]` : ""}`;
    });

    const mod = parseInt(customModInput.value);
    if (!isNaN(mod) && mod !== 0) {
        parts.push(`${mod}`);
    }

    inputBox.textContent = parts.length > 0 ? parts.join(" + ") : "Click a die to begin";
}

// event listener
document.querySelectorAll('.modifier-button').forEach(button => {
    const modName = button.dataset.mod;

    if (!modifiers[modName]) {
        console.warn(`Modifier not found: "${modName}"`);
        return;
    }

    // Store the name for later use
    button.dataset.mod = modName;

    button.addEventListener('click', () => {
        toggleModifier(modName);
    });
});

const pagesWrapper = document.querySelector('.pages-wrapper');
const pages = document.querySelectorAll('.page');
const selector = document.getElementById('selectorIndicator');
const options = document.querySelectorAll('.selector-option');

let currentPage = 0;

function getVisiblePageCount() {
    const wrapper = document.querySelector('.pages-wrapper');
    const width = wrapper.offsetWidth;

    if (width >= 1500) return 3;
    if (width >= 1000) return 2;
    return 1;
}

function updatePageWidths() {
    const visiblePages = getVisiblePageCount();
    const pages = document.querySelectorAll('.page');
    const widthPercent = 100 / visiblePages;

    pages.forEach(page => {
        page.style.flex = `0 0 ${widthPercent}%`;
        page.style.maxWidth = `${widthPercent}%`;
    });
}

function updateSelector() {
    const visiblePages = getVisiblePageCount();
    const indicator = selector;
    const selectorBar = document.querySelector('.page-selector');
    const totalWidth = selectorBar.offsetWidth;

    const tabWidth = totalWidth / 3;

    if (visiblePages === 3) {
        // Fill the entire bar and reset position
        indicator.style.width = `${totalWidth}px`;
        indicator.style.transform = `translateX(0px)`;
    } else if (visiblePages === 2) {
        indicator.style.width = `${tabWidth * 2}px`;
        indicator.style.transform = `translateX(${currentPage >= 1 ? tabWidth : 0}px)`;
    } else {
        indicator.style.width = `${tabWidth}px`;
        indicator.style.transform = `translateX(${tabWidth * currentPage}px)`;
    }
}


function scrollToPage(index) {
    const visiblePages = getVisiblePageCount();

    // For 2-page layout, only allow index 0 or 1 (left or right chunk)
    if (visiblePages === 2) {
        currentPage = index === 0 ? 0 : 1;
    } else {
        currentPage = Math.max(0, Math.min(index, 2));
    }

    const pageWidth = pagesWrapper.offsetWidth / visiblePages;
    pagesWrapper.scrollTo({
        left: currentPage * pageWidth,
        behavior: 'smooth'
    });

    updateSelector();
}

options.forEach(option => {
    option.addEventListener('click', () => {
        const index = parseInt(option.dataset.index);
        scrollToPage(index);
    });
});


window.addEventListener('resize', () => {
    updatePageWidths();
    updateSelector();
    scrollToPage(currentPage);
    updateDebugInfo(); // already being called here, keep it
});

window.addEventListener('DOMContentLoaded', () => {
    updatePageWidths();
    updateSelector();
    scrollToPage(currentPage);
    updateDebugInfo();
});

// Initial render
updateSelector();
// width debug logic

function updateDebugInfo() {
    const debug = document.getElementById('debugInfo');
    const pagesWrapper = document.querySelector('.pages-wrapper');
    const page = document.querySelector('.page');

    const screenWidth = window.innerWidth;
    const wrapperWidth = pagesWrapper.offsetWidth;
    const pageWidth = page.offsetWidth;
    const visiblePages = Math.floor(wrapperWidth / pageWidth);

    debug.textContent = `
Screen: ${screenWidth}px | Pages Wrapper: ${wrapperWidth}px | 
Page Width: ${pageWidth}px | Visible Pages: ${visiblePages}
`.trim();
}

window.addEventListener('resize', updateDebugInfo);
window.addEventListener('DOMContentLoaded', updateDebugInfo);

// Register the custom die in the dice count object
counts["custom"] = 0;

// Get DOM elements
const customButton = document.getElementById("custom");
const customCounter = document.getElementById("custom-count");
const customLabel = document.getElementById("custom-label");

// Update the ? label with the number from the input box
customSidesInput.addEventListener("input", () => {
    const sides = parseInt(customSidesInput.value);
    customLabel.textContent = (!isNaN(sides) && sides > 0) ? sides : "?";

    // Remove previous custom entries
    for (let i = rollEntries.length - 1; i >= 0; i--) {
        if (rollEntries[i].type === "custom") {
            rollEntries.splice(i, 1);
        }
    }

    // Re-add entries with new sides if valid
    if (counts.custom > 0 && !isNaN(sides) && sides > 0) {
        for (let i = 0; i < counts.custom; i++) {
            rollEntries.push({
                type: "custom",
                die: sides,
                modifiers: getCurrentModifiersForDie("custom")
            });
        }
    }

    updateInputBox();
});

// Hover typing and context menu for custom die
const customDieButton = document.getElementById("custom");
customDieButton.addEventListener('mouseenter', () => {
    hoveredDie = "custom";
    typedInput = "";
});

customDieButton.addEventListener('mouseleave', () => {
    if (typedInput !== "") {
        const value = parseInt(typedInput, 10);
        if (!isNaN(value)) {
            counts["custom"] = value;
            customCounter.textContent = value;

            // Remove old entries
            rollEntries = rollEntries.filter(entry => entry.type !== "custom");

            const sides = parseInt(customSidesInput.value);
            if (!isNaN(sides) && sides > 0) {
                for (let i = 0; i < value; i++) {
                    rollEntries.push({
                        type: "custom",
                        die: sides,
                        modifiers: getCurrentModifiersForDie("custom")
                    });
                }
            }
            updateInputBox();
        }
    }

    hoveredDie = null;
    typedInput = "";
});

let hoveredDie = null;
let typedInput = "";
let inputTimeout = null;

document.addEventListener('keydown', (e) => {
    if (hoveredDie && /^[0-9]$/.test(e.key)) {
        typedInput += e.key;

        // Optional: clear if user pauses typing too long (2 sec)
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            typedInput = "";
        }, 2000);
    }
});

customModInput.addEventListener("input", () => {
    updateInputBox();
});

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", () => {
    // Reset all dice counts
    rollEntries.length = 0;
    for (const die of [...diceTypes, "custom"]) {
        counts[die] = 0;
        const counter = document.getElementById(`${die}-count`);
        if (counter) counter.textContent = "0";
    }
    customModInput.value = "";
    updateInputBox();
});

const activeModifiers = new Set();

function toggleModifier(modName) {
    const modifierData = modifiers[modName];
    if (!modifierData) {
        console.warn(`Modifier not found: "${modName}"`);
        return;
    }

    const button = document.querySelector(`.modifier-button[data-mod="${modName}"]`);
    const isActive = activeModifiers.has(modName);

    if (isActive) {
        activeModifiers.delete(modName);
        button.classList.remove("active");
    } else {
        // Disable mutually exclusive modifiers
        modifierData.mutually_exclusive.forEach(conflict => {
            if (activeModifiers.has(conflict)) {
                activeModifiers.delete(conflict);
                const conflictBtn = document.querySelector(`.modifier-button[data-mod="${conflict}"]`);
                if (conflictBtn) {
                    conflictBtn.classList.remove("active");
                }
            }
        });

        activeModifiers.add(modName);
        button.classList.add("active");
    }

    updateInputBox();
}

diceTypes.concat("custom").forEach(die => {
    const button = document.getElementById(die);
    const counter = document.getElementById(`${die}-count`);

    button.addEventListener('mouseenter', () => {
        hoveredDie = die;
        typedInput = "";
    });

    button.addEventListener('mouseleave', () => {
        if (typedInput !== "") {
            const value = parseInt(typedInput, 10);
            if (!isNaN(value)) {
                counts[hoveredDie] = value;

                // Remove previous entries for this die type
                for (let i = rollEntries.length - 1; i >= 0; i--) {
                    if ((hoveredDie === "custom" && rollEntries[i].type === "custom") ||
                        (rollEntries[i].type === "standard" && `d${rollEntries[i].die}` === hoveredDie)) {
                        rollEntries.splice(i, 1);
                    }
                }

                // Push new entries with current modifiers
                const dieValue = hoveredDie === "custom" ? parseInt(customSidesInput.value) : parseInt(hoveredDie.slice(1));
                for (let i = 0; i < value; i++) {
                    rollEntries.push({
                        type: hoveredDie === "custom" ? "custom" : "standard",
                        die: dieValue,
                        modifiers: getCurrentModifiersForDie(hoveredDie)
                    });
                }

                document.getElementById(`${hoveredDie}-count`).textContent = value;
                updateInputBox();
            }
        }
        hoveredDie = null;
        typedInput = "";
    });

    button.addEventListener('click', () => {
        const sides = die === "custom" ? parseInt(customSidesInput.value) : parseInt(die.slice(1));
        if (isNaN(sides)) return;

        rollEntries.push({
            type: die === "custom" ? "custom" : "standard",
            die: sides,
            modifiers: getCurrentModifiersForDie(die)
        });

        counts[die]++;
        counter.textContent = counts[die];
        updateInputBox();
    });

    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const sides = die === "custom" ? parseInt(customSidesInput.value) : parseInt(die.slice(1));
        const type = die === "custom" ? "custom" : "standard";
        const index = rollEntries.findIndex(r => r.die === sides && r.type === type);

        if (counts[die] > 0 && index !== -1) {
            rollEntries.splice(index, 1);
            counts[die]--;
            counter.textContent = counts[die];
            updateInputBox();
        }
    });
});

const resetModifiersButton = document.getElementById("resetModifiersButton");

resetModifiersButton.addEventListener("click", () => {
    activeModifiers.clear();
    document.querySelectorAll(".modifier-button").forEach(btn => {
        btn.classList.remove("active");
    });
    updateInputBox();
});

document.getElementById("rollButton").addEventListener("click", executeFullRoll);

document.getElementById("clearHistoryButton").addEventListener("click", () => {
    const historyBox = document.getElementById("rollHistory");
    historyBox.innerHTML = "";
});

/**
 * Adds a new saved roll to the saved rolls section
 *
 * Parameters:
 *    name (string): The custom label given by the user
 *    formula (string): The current roll formula text
 *
 * Returns:
 *    None
 */
function addSavedRoll(name, fullHtml) {
  const savedBox = document.getElementById("savedRolls");
  const entry = document.createElement("div");
  entry.classList.add("saved-roll-entry");

  const formulaOnly = fullHtml.split("➤")[0].trim();

  entry.innerHTML = `
    <div class="saved-label">${name}</div>
    <div class="saved-formula">${formulaOnly}</div>
  `;

  // LEFT CLICK - Load & Roll
  entry.addEventListener("click", () => {
    inputBox.textContent = formulaOnly;
    rollEntries.length = 0; // clear previous entries
    updateInputBox();       // re-render text
    executeFullRoll();      // roll it
  });

  // RIGHT CLICK - Custom Context Menu
  entry.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    const menu = document.getElementById("savedContextMenu");
    menu.style.left = `${e.pageX}px`;
    menu.style.top = `${e.pageY}px`;
    menu.style.display = "block";

    // Store the entry being acted on
    menu.dataset.targetEntry = JSON.stringify({
      nameElementSelector: `.saved-label`,
      entry: entry.outerHTML
    });
    menu.currentEntry = entry;
  });

  savedBox.prepend(entry);
}

document.getElementById("saveButton").addEventListener("click", () => {
  const formula = inputBox.textContent;
  if (!formula || formula === "Click a die to begin") return;

  const name = prompt("Enter a name for this saved roll:");
  if (name && name.trim() !== "") {
    addSavedRoll(name.trim(), formula);
  }
});
