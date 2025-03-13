// TODO: Scale, Add second shoe and mirror on x axis, upload photo, color algorithm, rating system?
class ClothingItem {
  constructor(name, path) {
    this.name = name;
    this.path = path;
  }
}

let simpleV2 = {
  top: ["coat", "crop", "polo", "sweater", "tube"],
  bottom: ["khaki", "skirt", "snow", "sweat", "yoga"],
  shoe: ["boot", "run", "converse", "timb", "ugg"],
  accessory: ["chain", "cowboy", "mario", "marx", "prop"],
};

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
  accessories: null,
};

let fullRenderReferences = {};

// Functions
function configurePage() {
  let sections = ["top", "bottom", "accessory", "shoe"];

  sections.forEach((section) => {
    for (let i = 0; i < simpleV2[section].length; i++) {
      let current = simpleV2[section][i];
      builtInSelections[section].push(
        new ClothingItem(current, makePath(section, current))
      );
    }

    // for (let i = 0; i < simple[section].length; i++){
    //     let current = simple[section][i]
    //     builtInSelections[section].push(new ClothingItem(current[0], current[1]))
    // }

    fullRenderReferences[section] = document.getElementById(
      section + "-on-full-render"
    );
    makeDraggable(
      fullRenderReferences[section],
      document.getElementById("full-render")
    );
    let ref = document.getElementById(section);
    let selector = ref.getElementsByClassName("piece-selector")[0];
    const none = document.createElement("option");
    let renderer = ref.getElementsByClassName("piece-renderer")[0];
    let lookup = {};
    none.textContent = "None";
    selector.appendChild(none);
    builtInSelections[section].forEach((piece) => {
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
        updateRender(
          renderer,
          fullRenderReferences[section],
          lookup[event.target.value].path
        );
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
document.querySelectorAll(".stacked-img").forEach((img) => {
  let parentDiv = document.getElementById("full-render"); // or dynamically pass different div
  makeDraggable(img, parentDiv);
});

function updateRender(renderer, fullRenderer, value) {
  renderer.src = value;
  fullRenderer.src = value;

  return;
}

// Webcam Feed
// GPT Convo: https://chatgpt.com/share/67c92292-5788-800b-a833-899a613458a8
const video = document.getElementById("webcam");

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error("Error", error);
  });

// Color Picker
const colorPicker = document.getElementById("colorPicker");
const colorValue = document.getElementById("colorValue");
colorPicker.addEventListener("input", (event) => {
  colorValueHex.textContent = event.target.value;
  let HSV = hexToHSV(event.target.value);
  colorValueHSV.textContent = `H: ${HSV.h}, S: ${HSV.s}, V:${HSV.v}`;
});

// Convert to HSV
function hexToHSV(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Convert the Hexidecimal characters for Red Green and Blue values back to decimal notation, then dividing by 255 normalizes the values between 0 and 1
  let red = parseInt(hex.substring(0, 2), 16) / 255;
  let green = parseInt(hex.substring(2, 4), 16) / 255;
  let blue = parseInt(hex.substring(4, 6), 16) / 255;

  // Get min and max RGB values, used to find out what formula is used to calculate the Hue, Saturation and Value
  let max = Math.max(red, green, blue),
    min = Math.min(red, green, blue);
  let delta = max - min;

  // Depending on which channel is dominant, there is a different way of calculating the Hue value. This is a method of finding what degree on a color wheel that this color would be, and subsequently
  // Finding out what its analgous, complementary, etc. color sets are by adding to this value (rotating around the wheel)
  // I learned this algorithm from a chatGPT conversation, where I had it tutor me about the reasons behind this calculation and how it works.
  // Convo Link:
  let hue = 0;
  let complement = 0;
  let adj1 = 0,
    adj2 = 0;
  let tri1 = 0,
    tri2 = 0;
  let tet1 = 0,
    tet2 = 0;
  // Avoid division by 0 for gray colors.
  if (delta !== 0) {
    if (max === red) {
      hue = ((green - blue) / delta) % 6;
    } else if (max === green) {
      hue = (blue - red) / delta + 2;
    } else {
      hue = (red - green) / delta + 4;
    }
    hue = Math.round(hue * 60);
    // Don't allow for negative angles on the color wheel.
    if (hue < 0) hue += 360;

    // Calculate parts of the palette that satisfyingly match the color picked.
    complement = (hue + 180) % 360;
    console.log("Complementary: ", complement); // Opposite side
    adj1 = (hue + 30) % 360;
    adj2 = (hue + 330) % 360;
    console.log(`Adjacents ${hue}, ${adj1}, ${adj2}`); // +/- 30
    tri1 = (complement + 30) % 360;
    tri2 = (complement + 330) % 360;
    console.log(`Triad: ${hue}, ${tri1}, ${tri2}`); // Compliment +/- 30
    tet1 = tri1;
    tet2 = adj1;
    console.log(`Tetrads: ${complement}, ${tet1}, ${hue}, ${tet2}`);
  }

  // If the difference between the most dominant channel and least dominant channel is large, the color is very saturated, if they are close, then the color is less saturated.
  let saturation = 0;
  if (max != 0) {
    saturation = (delta / max) * 100;
  }
  // Value is based off of the intensity of the most dominant channel
  let value = max * 100;

  return { h: hue, s: saturation, v: value };
}
// Main loop
configurePage();
