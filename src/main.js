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
    top: [
        new ClothingItem("shirt", "images/a.jpg"), new ClothingItem("tank top", "images/a.jpg"),
    ],
    bottom: [
        new ClothingItem("apple Bottom Jeans", "images/a.jpg"),
    ],
    shoe: [
        new ClothingItem("boots with the fur", "images/a.jpg"),
    ],

    accessory: [new ClothingItem("neckalce", "images/a.jpg")],
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
        let pathLookup = {}
        none.textContent = "None"
        selector.appendChild(none)
        builtInSelections[section].forEach(piece => {
            const option = document.createElement("option")
            pathLookup[piece.name ] = piece.path
            option.textContent = piece.name
            selector.appendChild(option)
        });


        selector.addEventListener("change", (event)=>{
            if (event.target.value == "None"){
                updateRender( renderer,"")

            }else{
                updateRender( renderer, pathLookup[event.target.value] )

            }

        })
    });
}

function updateRender(renderer, value){
    renderer.src = value
    return
}




// Main loop
configurePage();
