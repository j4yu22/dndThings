const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
const counts = {
    d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, custom: 0
};

const inputBox = document.getElementById('inputBox');
const customModInput = document.getElementById("custom-modifier");
const customSidesInput = document.getElementById("custom-sides");

function updateInputBox() {
    const parts = [];

    const grouped = {};

    // Build a list of currently active modifiers
    const active = Array.from(activeModifiers);

    // Group each die count with applicable modifiers
    for (const die of [...diceTypes, "custom"]) {
        const count = counts[die];
        if (count <= 0) continue;

        let sides = die.slice(1);
        if (die === "custom") {
            const val = parseInt(customSidesInput.value);
            if (isNaN(val) || val <= 0) continue;
            sides = val;
        }

        // Find applicable modifiers
        const modIcons = active
            .filter(modName => {
                const mod = modifiers[modName];
                return mod && (mod.limited_to.length === 0 || mod.limited_to.includes(die));
            })
            .map(modName => modifiers[modName].symbol);

        const key = `${sides}_${modIcons.join("")}`;

        if (!grouped[key]) {
            grouped[key] = {
                count: 0,
                sides,
                modifiers: modIcons
            };
        }

        grouped[key].count += count;
    }

    // Convert grouped results into display text
    for (const key in grouped) {
        const group = grouped[key];
        const diceStr = `${group.count}d${group.sides}`;
        const modStr = group.modifiers.map(sym => `[${sym}]`).join("");
        parts.push(`${diceStr}${modStr}`);
    }

    // Add custom flat modifier (e.g. +2 or -1)
    const mod = parseInt(customModInput.value);
    if (!isNaN(mod) && mod !== 0) {
        parts.push(mod > 0 ? `+${mod}` : `${mod}`);
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
    if (!isNaN(sides) && sides > 0) {
        customLabel.textContent = sides;
    } else {
        customLabel.textContent = "?";
    }
    updateInputBox();
});

let hoveredDie = null;
let typedInput = "";
let inputTimeout = null;

diceTypes.forEach(die => {
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
                document.getElementById(`${hoveredDie}-count`).textContent = value;
                updateInputBox();
            }
        }
        hoveredDie = null;
        typedInput = "";
    });

    button.addEventListener('click', () => {
        if (typedInput === "") {
            counts[die]++;
            counter.textContent = counts[die];
            updateInputBox();
        }
        typedInput = ""; // reset so next interaction is clean
    });

    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (typedInput === "" && counts[die] > 0) {
            counts[die]--;
            counter.textContent = counts[die];
            updateInputBox();
        }
        typedInput = ""; // also reset here
    });

});

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

customModInput.addEventListener("input", updateInputBox);

document.getElementById('clearButton').addEventListener('click', () => {
    // Reset all counts
    for (const die of diceTypes) {
        counts[die] = 0;
        document.getElementById(`${die}-count`).textContent = 0;
    }

    // Reset custom die count
    counts["custom"] = 0;
    document.getElementById("custom-count").textContent = 0;

    // Clear input fields
    customSidesInput.value = "";
    document.getElementById("custom-label").textContent = "?";
    customModInput.value = "";

    // Deactivate modifiers
    document.querySelectorAll('.modifier-button.active').forEach(btn => btn.classList.remove('active'));

    // Update text box
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
