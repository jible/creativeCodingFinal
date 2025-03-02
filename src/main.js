// // Variables
// let currentPhaseIndex = 0;
// const phases = ["top", "bottom", "accessories", "shoe", "end"];
class ClothingItem {
    constructor(name,path){
        this.name = name
        this.path = path
    }
}

const builtInSelections = {
    top: ["shirt", "tank top"],
    bottom: ["apple bottom jeans"],
    shoe: ["boots with the fur"],
    accessory: ["e"],
};

const outfit = {
    top: null,
    bottom: null,
    shoe: null,
    accessories: null,
};





// Functions
function configurePage() {
    let sections = [
        "top",
        "bottom",
        "accessory",
        "shoe"
    ]

    sections.forEach(section => {
        let ref = document.getElementById(section)
        let selector = ref.getElementsByClassName("piece-selector")[0]
        console.log(selector)
        const none = document.createElement("option")
        let renderer = ref.getElementsByClassName("piece-renderer")[0]

        none.textContent = "None"
        selector.appendChild(none)
        builtInSelections[section].forEach(piece => {
            const option = document.createElement("option")
            option.textContent = piece.name
            selector.appendChild(option)
        });


        selector.addEventListener("change", (value)=>{
            updateRender(renderer,value)

        })
    });
}

function updateRender(renderer, value){
    // Set the renderer to have image of value
    return
}




// Main loop
configurePage();
