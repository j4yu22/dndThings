const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];
const counts = {
    d4: 0,
    d6: 0,
    d8: 0,
    d10: 0,
    d12: 0,
    d20: 0
};

const inputBox = document.getElementById('inputBox');

function updateInputBox() {
    const parts = [];

    for (const die of diceTypes) {
        const count = counts[die];
        if (count > 0) {
            parts.push(`${count}d${die.slice(1)}`);
        }
    }

    inputBox.textContent = parts.length > 0 ? parts.join(' + ') : 'Click a die to begin';
}

diceTypes.forEach(die => {
    const button = document.getElementById(die);
    const counter = document.getElementById(`${die}-count`);

    button.addEventListener('click', () => {
        counts[die]++;
        counter.textContent = counts[die];
        updateInputBox();
    });

    button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (counts[die] > 0) {
            counts[die]--;
            counter.textContent = counts[die];
            updateInputBox();
        }
    });
});

// Toggle modifier buttons
document.querySelectorAll('.modifier-button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
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
