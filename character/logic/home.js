// Example character data
const characters = [
    { id: "ronso", name: "Placeholder", level: 67 }
];

// Grab the grid
const grid = document.getElementById("characterGrid");

// Render existing characters
characters.forEach(c => {
    const card = document.createElement("div");
    card.classList.add("character-card");

    card.innerHTML = `
        <div class="char-image"></div>
        <h3>${c.name}</h3>
        <p>Level ${c.level}</p>
    `;

    // Navigate to that character's sheet
    card.addEventListener("click", () => {
        window.location.href = `character.html?id=${c.id}`;
    });

    grid.appendChild(card);
});

// Handle "Add New" card
const addCard = document.querySelector(".add-card");
addCard.addEventListener("click", () => {
    window.location.href = "character.html?new=true";
});
