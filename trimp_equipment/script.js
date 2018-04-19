// update frequency
var updateFrequency = 1000;

// support function for add event listeners
function addEvent(obj, evType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evType, fn, false);
        return true;
    } else if (obj.attachEvent) {
        var r = obj.attachEvent("on" + evType, fn);
        return r;
    } else {
        alert("Handler could not be attached");
    }
}

// this function find the best attack or defense item
function findBest(array, costProperty){
  var best = Number.MAX_SAFE_INTEGER;
  var id = "";
  for (var eq of array) {
    // check if item is avaiable
    if(game.equipment[eq].locked === 1){
      continue;
    }
    // check if item is max level
    if(game.equipment[eq].level >= 8){
      continue;
    }
    var current = (game.equipment[eq].cost.metal[0]*Math.pow(game.equipment[eq].cost.metal[1], game.equipment[eq].level)) / game.equipment[eq][costProperty];
    if(current < best){
      best = current;
      id = eq;
    }
  }
  return({id, best});
}


function updateBest(){
  // getting list of all equiments so i can clean up previus best
  var equipments = document.getElementById("equipmentHere").children;

  // set all background color to black
  for (var i = 0; i < equipments.length; i++){
    if(equipments[i].classList.contains("thingColorCanNotAfford")){
      equipments[i].style.backgroundColor = "Gray";
    }else{
      equipments[i].style.backgroundColor = "Black";
    }
  }
  // defining arrays for attack and defense equipment
  var attack = [
    "Dagger",
    "Mace",
    "Polearm",
    "Battleaxe",
    "Greatsword",
    "Arbalest"
  ];

  var defense = [
    "Boots",
    "Helmet",
    "Pants",
    "Shoulderguards",
    "Breastplate",
    "Gambeson"
  ];

  // calculating best attack and defense equipments
  var bestAttack = findBest(attack, "attackCalculated");
  var bestDefense = findBest(defense, "healthCalculated");

  // get their DOM elements
  var attackElement = document.getElementById(bestAttack.id);
  var defenseElement = document.getElementById(bestDefense.id);

  // change background color
  if(attackElement.classList.contains("thingColorCanNotAfford")){
    attackElement.style.backgroundColor = "LightSalmon";
  }else{
    attackElement.style.backgroundColor = "Red";
  }

  if(defenseElement.classList.contains("thingColorCanNotAfford")){
    defenseElement.style.backgroundColor = "PaleGreen";
  }else{
    defenseElement.style.backgroundColor = "Green";
  }
}

// retrive all DOM elements of equipments
var equipments = document.getElementById("equipmentHere").children;

// for each of them add listener for click event so i can trigger update
for (var i = 0; i < equipments.length; i++){
  addEvent(equipments[i], "click", updateBest);
}

setInterval(function() {
  updateBest();
}, updateFrequency);
