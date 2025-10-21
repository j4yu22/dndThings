// Parse URL params
const params = new URLSearchParams(window.location.search);
const charId = params.get("id");
const isNew = params.get("new");

// Handle back button
document.getElementById("backButton").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Placeholder for loading/saving characters
const characters = {
    ronso: { name: "Ronso", level: 13 },
    mira: { name: "Mira", level: 7 },
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
