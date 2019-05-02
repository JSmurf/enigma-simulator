// Creating variables to reference for our main DOM elements is very useful
const lightsDiv = document.getElementById('lights');
const keyboardDiv = document.getElementById('keyboard');
const messageDiv = document.getElementById('message');
const plugboardDiv = document.getElementById('plugboard');
const positionsDiv = document.getElementById('positions');

//Define arrays for use later. A keyboard array makes building things much faster, the alphabet array is for reference.
const qwerty   = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
const alpha    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const rotorI   = {
  
  array: "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split(''),
  notch: 17
}
const rotorII  = {
  array: "AJDKSIRUXBLHWTMCQGZNPYFVOE".split(''),
  notch: 5
}
const rotorIII = {
  array:  "BDFHJLCPRTXVZNYEIWGAKMUSQO".split(''),
  notch: 22
}
const reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split('');

// Define Rotors in use, in this case we're just using some static rotors, but this can be changed later
var rotors = {
  rotor0: {
    array: rotorI.array,
    position: 0,
    notch: rotorI.notch
  },
  rotor1: {
    array: rotorII.array,
    position: 0,
    notch: rotorII.notch
  },
  rotor2: {
    array: rotorIII.array,
    position: 0,
    notch: rotorIII.notch
  }
}

// Define inital positions, and empty output array
var messageArr = [];

// Define a function that simply increments the rotor, and rotates when it hits 25
var cycle = function(rotor) {
  let currentPos = rotor.position
  let newPos = 0;
  if (currentPos == 25) {
    newPos =  0;
  }
  else {
    newPos = currentPos + 1;
  } 
  return newPos;
}

var rotate = function(rotors) {
  let newRotors = rotors
  newRotors.rotor2.position = cycle(newRotors.rotor2);
  if (newRotors.rotor2.position == newRotors.rotor2.notch) {
    newRotors.rotor1.position = cycle(newRotors.rotor1)
    if (newRotors.rotor1.position == newRotors.rotor1.notch) {
      newRotors.rotor0.position = cycle(newRotors.rotor0)
    }
  }
  return newRotors
}

// Define a function that takes a letter in, as well as a rotor and outputs another letter based on the rotor and position
var rotorChange = function(letter, rotor) {
  // Get the index of our input letter, this is the position in the alphabet
  let index = alpha.indexOf(letter);
  // Offset the index by the position of the rotor
  index = ((index + rotor.position) % 26);
  let newLetter = rotor.array[index];
  let newIndex = alpha.indexOf(newLetter);
  newIndex = (newIndex - rotor.position + 26) % 26;
  return alpha[newIndex];
}

var rotorBack = function(letter, rotor) {
  let index = alpha.indexOf(letter);
  index = ((index + rotor.position) % 26);
  let newIndex = rotor.array.indexOf(alpha[index]);
  let newLetter = alpha[(newIndex - rotor.position + 26) % 26]
  return newLetter;
}

var reflect = function(letter) {
  let index = alpha.indexOf(letter);
  return reflector[index];
}

var outputLetter = function(key) {
  document.getElementById(key).classList.add('lit');
    setTimeout(function(){
    document.getElementById(key).classList.remove("lit"); 
  }, 300);
  messageArr.push(key[0]);
  messageDiv.innerHTML = '<h1>' + messageArr.join(' ') + '</h1>';
  positionsDiv.innerHTML = '<p> Positions: ' + alpha[rotors.rotor0.position] + ' ' + alpha[rotors.rotor1.position] + ' ' + alpha[rotors.rotor2.position] + '</p>';
}

var handleKeyPress = function(key) {
  if (alpha.includes(key)) {
  rotors = rotate(rotors)
    let newLetter = rotorChange(key, rotors.rotor2);
    newLetter = rotorChange(newLetter, rotors.rotor1);
    newLetter = rotorChange(newLetter, rotors.rotor0);
    newLetter = reflect(newLetter);
    newLetter = rotorBack(newLetter, rotors.rotor0);
    newLetter = rotorBack(newLetter, rotors.rotor1);
    newLetter = rotorBack(newLetter, rotors.rotor2);
    // Output new Letter
    outputLetter(newLetter + 'light');
  }
}
// Create lightboard using the qwerty array
qwerty.map(function(letter){
  var lightText = document.createTextNode(letter);
  var newLight = document.createElement("div");
  newLight.appendChild(lightText);
  newLight.id = letter + 'light';
  newLight.classList.add("light");
  lightsDiv.appendChild(newLight);
});
// Create a keyboard using the qwerty array
qwerty.map(function(letter){
  var keyText = document.createTextNode(letter);
  var newKey = document.createElement("div");
  newKey.appendChild(keyText);
  newKey.id = letter + 'key';
  newKey.classList.add("key");
  keyboardDiv.appendChild(newKey);
  newKey.addEventListener("click", function(){
    handleKeyPress(letter)
  });
});
// Create a plugboard using the qwerty array
qwerty.map(function(letter) {
  var plugText = document.createTextNode(letter);
  var newPlug = document.createElement("div");
  var plugHole = document.createElement("div");
  var plugHole2 = document.createElement("div");
  var plugLabel = document.createElement("p");
  plugLabel.appendChild(plugText);
  plugHole.classList.add('plughole');
  plugHole2.classList.add('plughole');
  newPlug.id = letter + 'plug';
  newPlug.classList.add("plug");
  newPlug.appendChild(plugLabel);
  newPlug.appendChild(plugHole);
  newPlug.appendChild(plugHole2);
  plugboardDiv.appendChild(newPlug);
  // ToDO - Add plugboard function listener
})

// Create event listener for keypress
document.addEventListener('keydown', (event) => {
  var keyName = event.key.toUpperCase();
  handleKeyPress(keyName);
});
// Create event listener for when the key is lifted 
document.addEventListener('keyup', (event) => {
  const keyName = event.key.toUpperCase() + 'light';
  document.getElementById(keyName).classList.remove("lit")
});