const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
const counts = {
    d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, custom: 0
};

const inputBox = document.getElementById('inputBox');
const customModInput = document.getElementById("custom-modifier");
const customSidesInput = document.getElementById("custom-sides");
const rollEntries = [];

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

// Handle left-click to increment count
customButton.addEventListener("click", () => {
    counts["custom"]++;
    customCounter.textContent = counts["custom"];
    updateInputBox();
});

// Handle right-click to decrement count
customButton.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (counts["custom"] > 0) {
        counts["custom"]--;
        customCounter.textContent = counts["custom"];
        updateInputBox();
    }
});

// Update the ? label with the number from the input box
customSidesInput.addEventListener("input", () => {
    const sides = parseInt(customSidesInput.value);
    customLabel.textContent = (!isNaN(sides) && sides > 0) ? sides : "?";

    rollEntries = rollEntries.filter(entry => entry.type !== "custom");

    if (counts.custom > 0 && !isNaN(sides) && sides > 0) {
        rollEntries.push({
            type: "custom",
            count: counts.custom,
            sides: sides,
            modifiers: getCurrentModifiersForDie("custom")
        });
    }

    updateInputBox();
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

diceTypes.forEach(die => {
    const button = document.getElementById(die);
    const counter = document.getElementById(`${die}-count`);

    button.addEventListener('click', () => {
        // Determine sides
        const sides = parseInt(die.slice(1));
        // Get active modifiers at time of click that apply to this die
        const mods = Array.from(activeModifiers).filter(mod => {
            const m = modifiers[mod];
            return m && (m.limited_to.length === 0 || m.limited_to.includes(die));
        });

        rollEntries.push({ die: sides, modifiers: mods });
        counts[die]++;
        counter.textContent = counts[die];
        updateInputBox();
    });

    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const sides = parseInt(die.slice(1));
        const index = rollEntries.findIndex(r => r.die === sides);
        if (counts[die] > 0 && index !== -1) {
            counts[die]--;
            rollEntries.splice(index, 1);
            counter.textContent = counts[die];
            updateInputBox();
        }
    });
});
