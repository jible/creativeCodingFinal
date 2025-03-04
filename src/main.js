// TODO: Scale, Add second shoe and mirror on x axis, upload photo, color algorithm, rating system?
class ClothingItem {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }
}

let simpleV2 = {
    "top": [
        "coat",
        "crop",
        "polo",
        "sweater",
        "tube",
    ],
    "bottom": [
        "khaki",
        "skirt",
        "snow",
        "sweat",
        "yoga",
    ],
    "shoe": [
        "boot",
        "run",
        "converse",
        "timb", "ugg"
    ],
    "accessory": [
        "chain",
        "cowboy",
        "mario",
        "marx",
        "prop"
    ],
}

function makePath(section, name) {
    return `clothingImages/${section}/${name}.png`;
}

const builtInSelections = {
    top: [],
    bottom: [],
    shoe: [],
    accessory: [],
};

const outfit = {
    top: null,
    bottom: null,
    shoe: null,
    accessory: null, // Changed from 'accessories' to 'accessory'
};

let fullRenderReferences = {};

// Functions
function configurePage() {
    let sections = [
        "top",
        "bottom",
        "accessory",
        "shoe"
    ];

    sections.forEach(section => {
        for (let i = 0; i < simpleV2[section].length; i++) {
            let current = simpleV2[section][i];
            builtInSelections[section].push(new ClothingItem(current, makePath(section, current)));
        }

        fullRenderReferences[section] = document.getElementById(section + "-on-full-render");
        makeDraggable(fullRenderReferences[section], document.getElementById("full-render"));
        let ref = document.getElementById(section);
        let selector = ref.getElementsByClassName("piece-selector")[0];
        const none = document.createElement("option");
        let renderer = ref.getElementsByClassName("piece-renderer")[0];
        let lookup = {};
        none.textContent = "None";
        selector.appendChild(none);

        // upload button config
        let uploadButton = ref.getElementsByClassName("img-upload")[0]; // Select the first element
        console.log(uploadButton); // Changed from print to console.log
        setupImageUploader(uploadButton, section, selector, lookup, renderer, fullRenderReferences[section]);


        // size slider
        const base = 20;
        let slider = ref.getElementsByClassName("size-slider")[0];
        slider.addEventListener("input", (event) => {
            fullRenderReferences[section].style.width = `${event.target.value}px`;
            fullRenderReferences[section].style.height = 'auto'
        });


        builtInSelections[section].forEach(piece => {
            const option = document.createElement("option");
            lookup[piece.name] = piece;
            option.textContent = piece.name;
            selector.appendChild(option);
        });

        selector.addEventListener("change", (event) => {
            if (event.target.value == "None") {
                outfit[section] = null;
                updateRender(renderer, "");
            } else {
                outfit[section] = lookup[event.target.value];
                updateRender(renderer, fullRenderReferences[section], lookup[event.target.value].path);
            }
        });
    });
}

// function from chatgpt
function makeDraggable(element, parentDiv) {
    element.addEventListener("mousedown", (event) => {
        let imgElement = event.target;
        let shiftX = event.clientX - imgElement.getBoundingClientRect().left;
        let shiftY = event.clientY - imgElement.getBoundingClientRect().top;

        imgElement.style.position = "absolute"; // Ensure absolute positioning
        imgElement.style.zIndex = 1000; // Bring to front

        function moveAt(clientX, clientY) {
            // Constrain movement within the parent div
            let newLeft = clientX - shiftX - parentDiv.getBoundingClientRect().left;
            let newTop = clientY - shiftY - parentDiv.getBoundingClientRect().top;

            let maxX = parentDiv.clientWidth - imgElement.clientWidth;
            let maxY = parentDiv.clientHeight - imgElement.clientHeight;

            imgElement.style.left = Math.max(0, Math.min(newLeft, maxX)) + "px";
            imgElement.style.top = Math.max(0, Math.min(newTop, maxY)) + "px";
        }

        function onMouseMove(event) {
            moveAt(event.clientX, event.clientY);
        }

        document.addEventListener("mousemove", onMouseMove);

        imgElement.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMouseMove);
        });

        imgElement.ondragstart = () => false; // Disable default drag
    });
}

// Apply the draggable functionality to each image with its parent div
document.querySelectorAll(".stacked-img").forEach(img => {
    let parentDiv = document.getElementById("full-render"); // or dynamically pass different div
    makeDraggable(img, parentDiv);
});

function updateRender(renderer, fullRenderer, value) {
    renderer.src = value;
    if (fullRenderer) {
        fullRenderer.src = value;
    }
}

function setupImageUploader(button, section, selector, lookup, renderer, fullRenderer) {
    if (!(button instanceof HTMLElement)) {
        console.error('Invalid button element provided');
        return;
    }

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    button.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imagePath = e.target.result;
                const newClothingItem = new ClothingItem(`custom-${section}-${Date.now()}`, imagePath);
                builtInSelections[section].push(newClothingItem);

                console.log(`Image uploaded for section: ${section}, Name: ${newClothingItem.name}`);

                // Add the new option to the dropdown
                const option = document.createElement("option");
                option.textContent = newClothingItem.name;
                option.value = newClothingItem.name;
                lookup[newClothingItem.name] = newClothingItem;
                selector.appendChild(option);

                // Optionally, select the newly uploaded item
                selector.value = newClothingItem.name;
                outfit[section] = newClothingItem;
                updateRender(renderer, fullRenderer, newClothingItem.path);
            };
            reader.readAsDataURL(file);
        }
    });

    document.body.appendChild(fileInput);
}

// Main loop
configurePage();





// Ai Conversations
/*
https://chatgpt.com/share/67c6997b-7710-8000-adff-5106454dba2d
*/