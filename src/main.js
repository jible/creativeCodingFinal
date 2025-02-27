// Variables
let currentPhaseIndex = 0;

const builtInSelections = {
    top: ["shirt", "tank top"],
    bottom: [],
    shoe: [],
    accessories: [],
};

const outfit = {
    top: null,
    bottom: null,
    shoe: null,
    accessories: null,
};

// Class for rendering scene
class ClothingSelection {
    constructor(name, displayName) {
        this.name = name;
        this.displayName = displayName;
        this.selectionNames = [...builtInSelections[name]];
        this.selection = this.configureSelection();
    }

    configureSelection() {
        // Configuration logic can be added here
    }
}

// Initialize scenes
const scenes = {
    top: new ClothingSelection("top", "Top"),
    bottom: new ClothingSelection("bottom", "Bottom"),
    shoe: new ClothingSelection("shoe", "Shoe"),
    accessories: new ClothingSelection("accessories", "Accessories"),
};

// Functions
function configurePage() {
    const phases = ["top", "bottom", "accessories", "shoe"];
    renderSelection(phases[currentPhaseIndex]);
}

function renderSelection(phaseName) {
    const currentScene = scenes[phaseName];

    document.getElementById("part-name").innerText = currentScene.displayName;

    const dropDown = document.getElementById("selection-drop-down");
    dropDown.innerHTML = "";

    currentScene.selectionNames.forEach((selection) => {
        const option = document.createElement("option");
        option.textContent = selection;
        dropDown.appendChild(option);
    });
}

// Main loop
configurePage();
