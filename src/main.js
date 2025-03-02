// Variables
let currentPhaseIndex = 0;
const phases = ["top", "bottom", "accessories", "shoe", "end"];


const builtInSelections = {
    top: ["shirt", "tank top"],
    bottom: ["apple bottom jeans"],
    shoe: ["boots with the fur"],
    accessories: [],
    end: "end",
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
    renderSelection(phases[currentPhaseIndex]);
}

function renderSelection(phaseName) {
    const currentScene = scenes[phaseName];
    const selectionSection = document.getElementById("selection-section")
    selectionSection.innerHTML = ""
    createSelectionElements(selectionSection)


    document.getElementById("part-name").innerText = currentScene.displayName;

    const dropDown = document.getElementById("selection-drop-down");
    dropDown.innerHTML = "";

    currentScene.selectionNames.forEach((selection) => {
        const option = document.createElement("option");
        option.textContent = selection;
        dropDown.appendChild(option);
    });

    const next = document.getElementById("next_but")
    next.addEventListener("click", ()=>{
        goNextSelection()
    })
    const back = document.getElementById("back_but")
    back.addEventListener("click", ()=>{
        goPrevSelection()
    })
}

function createSelectionElements(parent) {
    // Create selection section


    const partName = document.createElement("h2");
    partName.id = "part-name";
    
    const selectionDropDown = document.createElement("select");
    selectionDropDown.id = "selection-drop-down";

    parent.appendChild(partName);
    parent.appendChild(selectionDropDown);

    // Create renderer section
    const renderer = document.createElement("div");
    renderer.id = "renderer";

    const selectionHeader = document.createElement("h2");
    selectionHeader.textContent = "Selection";

    renderer.appendChild(selectionHeader);

    // Append sections to parent
    parent.appendChild(renderer);
}

// Example usage:
const parent = document.getElementById("some-parent-element"); // Replace with actual parent element
if (parent) {
    createElements(parent);
}






function goNextSelection(){
    currentPhaseIndex ++
    if (currentPhaseIndex >= phases.length){
        currentPhaseIndex  = phases.length -1
    }
    if (phases[currentPhaseIndex] == "end"){
        goToFinalScene()
    } else {
        renderSelection(phases[currentPhaseIndex])
    }
}

function goPrevSelection(){
    
    if (currentPhaseIndex > 0){
        currentPhaseIndex --
    } else{
        return
    }
    if (currentPhaseIndex >= phases.length){
        goToFinalScene()
    } else {
        renderSelection(phases[currentPhaseIndex])
    }
}


function goToFinalScene(){
    var selectionSection = document.getElementById("selection-section")
    selectionSection.innerHTML = ""
}

// Main loop
configurePage();
