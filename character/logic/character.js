// Parse URL params
const params = new URLSearchParams(window.location.search);
const charId = params.get("id");
const isNew = params.get("new");
const char = new CharacterStats();

// Whenever an input changes, update the object
document.querySelectorAll('.ability input').forEach(input => {
    input.addEventListener('input', e => {
        const stat = e.target.closest('.ability').dataset.stat;
        char.updateAbility(stat, parseInt(e.target.value) || 0);
    });
});

// On load
window.addEventListener('DOMContentLoaded', () => {
    char.updateUI();
});

// Handle back button
document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Placeholder for loading/saving characters
const characters = {
    ronso: { name: "Placeholder", level: 67 }
};

// Load existing or new character
const nameInput = document.getElementById("charName");
const levelInput = document.getElementById("charLevel");
const header = document.getElementById("charNameHeader");

if (isNew) {
    // Blank sheet
    header.textContent = "New Character";
} else if (charId && characters[charId]) {
    // Load existing data
    const char = characters[charId];
    nameInput.value = char.name;
    levelInput.value = char.level;
    header.textContent = char.name;
} else {
    // Invalid / unknown id fallback
    header.textContent = "Character Not Found";
}

/**
 * Enables click and hold behavior for proficiency toggles:
 * - Click: toggles proficiency (filled circle)
 * - Hold: sets expertise (gold star)
 */
function initializeProficiencyToggles() {
  const circles = document.querySelectorAll('.prof-circle');

  circles.forEach(circle => {
    let pressTimer;

    // Simple click toggles proficiency
    circle.addEventListener('click', () => {
      if (circle.dataset.level === 'none' || circle.dataset.level === 'expert') {
        circle.dataset.level = 'prof';
        circle.classList.add('filled');
        circle.classList.remove('expert');
      } else {
        circle.dataset.level = 'none';
        circle.classList.remove('filled', 'expert');
      }
    });

    // Hold for 0.8s → expertise
    circle.addEventListener('mousedown', () => {
      pressTimer = setTimeout(() => {
        circle.dataset.level = 'expert';
        circle.classList.add('expert');
        circle.classList.remove('filled');
      }, 800);
    });

    circle.addEventListener('mouseup', () => clearTimeout(pressTimer));
    circle.addEventListener('mouseleave', () => clearTimeout(pressTimer));
  });
}

document.addEventListener('DOMContentLoaded', initializeProficiencyToggles);

document.querySelectorAll('input').forEach(input => {
  if (!input.value) input.value = '--';
});
