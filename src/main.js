const colorPicker = document.getElementById("colorPicker");
const colorValue = document.getElementById("colorValue");

var colorsHex = []
var colorsHSV = []
var colorsRGB = []
let fullRenderReferences = {};

// Functions
function configurePage() {
  const addColorButton = document.getElementById("add-color")
  addColorButton.addEventListener('click', ()=>{
    colorsHex.push(colorPicker.value)
    colorsRGB.push(hexToRGB(colorPicker.value))
    colorsHSV.push ( hexToHSV( colorPicker.value) )
    colorsUpdated()
  })
  const clearColorButton = document.getElementById("clear-colors")
  clearColorButton.addEventListener('click' , ()=>{
    colorsHSV = []
    colorsHex = []
    colorsRGB = []
    colorsUpdated()
  })

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
// convo link : https://chatgpt.com/share/67c92851-8358-800b-9ec7-ba9bee3a4462
colorPicker.addEventListener("input", (event) => {
  colorValueHex.textContent = event.target.value;
  let HSV = hexToHSV(event.target.value);
  colorValueHSV.textContent = `H: ${Math.floor(HSV.h)}, S: ${Math.floor(HSV.s)}, V:${Math.floor(HSV.v)}`;
});


function hexToRGB(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, "");
  
    // Convert the Hexidecimal characters for Red Green and Blue values back to decimal notation, then dividing by 255 normalizes the values between 0 and 1
    let red = parseInt(hex.substring(0, 2), 16) ;
    let green = parseInt(hex.substring(2, 4), 16) ;
    let blue = parseInt(hex.substring(4, 6), 16) ;
    return ([red,green,blue])
}
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


// Currently expects colors in rgb
function updateColorList(colors){
    
  let colorHolder = document.getElementById("outfit-colors")
  colorHolder.innerHTML = ''
  var count = 0
  colors.forEach(color=>{
    
    let newColor = document.createElement("div")
    newColor.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    newColor.style.color = `rgb(${(255 - color[0] )}, ${(255 - color[1] )}, ${(255 - color[2] )})`
    newColor.innerText =`H: ${Math.floor(colorsHSV[count].h)}, S: ${Math.floor(colorsHSV[count].s)}, V:${Math.floor(colorsHSV[count].v)}`
    colorHolder.appendChild(newColor);
    count ++
  })
}

var compDisplay = document.getElementById("comp-score")
var adjDisplay = document.getElementById("adj-score")
var triDisplay = document.getElementById("tri-score")
var tetDisplay = document.getElementById("tet-score")
var monoDisplay = document.getElementById("mono-score")
var totalDisplay = document.getElementById("total-score")

function updateScoreRenders(scores){
  if (colorsHSV.length <= 2){
    compDisplay.innerText = ''
    adjDisplay.innerText = ''
    triDisplay.innerText = ''
    tetDisplay.innerText =  ''
    monoDisplay.innerText = ''
    totalDisplay.innerText = ''
    return
  }

  let allGrades = [average(scores.comp), average(scores.adj), average(scores.tri),average(scores.tet), average(scores.mono)]
  compDisplay.innerText = `Complementary Grade: ${allGrades[0]}`
  adjDisplay.innerText = `Adjacent Grade: ${allGrades[1]}`
  triDisplay.innerText = `Triad Grade: ${allGrades[2]}`
  tetDisplay.innerText = `Tetrad Grade: ${allGrades[3]}`
  monoDisplay.innerText =`Monochromatic Grade: ${allGrades[4]}`
  totalDisplay.innerText =`Fashionista Score: ${Math.max(...allGrades)}`
}



function colorsUpdated(){
  var scores = adjustGrade(colorsHSV)
  updateColorList(colorsRGB)
  updateScoreRenders(scores)
}



function average(input){
  var output = 0
  for (let i in input){
    output+= input[i]
  }
  output = output/input.length
  return Math.floor(output)
}

// Main loop
configurePage();
