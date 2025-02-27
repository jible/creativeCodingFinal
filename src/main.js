// Variables

let currentPhaseIndex = 0

let builtInSelections = {
    "top" : [
        "shirt",
        "tnaker",
        
    ],
    "bottom" : [],
    "shoe" : [],
    "accessories": [],
}


let outfit = {
    top : null,
    bottom : null,
    shoe : null,
    accessories: null
}



// Class for rendering scene
class ClothingSelection {
    constructor(name, displayName){
        this.displayName = displayName
        this.name = name
        this.setSelectionNames()
        this.selection = this.configureSelection()
    }
    setSelectionNames( ){
        this.selectionNames = []
        builtInSelections[this.name].forEach( name=>{
            this.selectionNames.push(name)
        })
    }

    configureSelection( ){

    }
}

let scenes = {
    "top" : new ClothingSelection("top", "Top"),
    "bottom" : new ClothingSelection("bottom", "Bottom"),
    "shoe" : new ClothingSelection("shoe", "Shoe"),
    "accessories": new ClothingSelection("accessories", "Accessories"),
}

// Functions
function configurePage(){
    let phases = [
        "top",
        "bottom",
        "accessories",
        "shoe"
    ]




    renderSelection(phases[currentPhaseIndex])
}


function renderSelection(  phaseName ){
    let currentScene = scenes[phaseName]

    let title = document.getElementById("part-name") 
    title.innerText = scenes[phaseName].displayName

    let dropDown = document.getElementById("selection-drop-down")
    dropDown.innerHTML = ""


    currentScene.selectionNames.forEach ( selection => {
        let option = document.createElement("option")
        option.textContent = selection
        dropDown.appendChild(option)
    })
}




// Main loop
configurePage()