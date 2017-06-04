var notation = 'standard';
var heuristic = true;
var offline = true;

class Game{

  constructor(){
    this.buttonsHandler = new ButtonsHandler();
    this.fruits = 0;
    this.tickDuration = 1000;
    this.multiplier = 1;
    this.fruitValue = 1;
    this.snakeLengthBonus = 0;
    this.goldenFruitChance = 0;
    this.goldenFruitValue = 2;
    this.prog = 0;
    this.fields = [];
    this.fields.push(new Field(this, this.prog, this.buttonsHandler));
    this.prog++;
    this.fruitsSpan = $("#fruits");
    this.tickDurationSpan = $("#tickDuration");
    this.multiplierSpan = $("#multiplier");
    this.snakeLengthBonusSpan = $("#snakeLengthBonus");
    this.fruitValueSpan = $("#fruitValue");
    this.goldenFruitChanceSpan = $("#goldenFruitChance");
    this.goldenFruitValueSpan = $("#goldenFruitValue");
    this.drawField(this.prog - 1);
    var nextFieldCost = this.calculateNextFieldCost();
    $("#addField").html("Add field: " + numberformat.format(nextFieldCost, {format: notation}) + " fruits");
    if( nextFieldCost <= this.fruits){
      this.buttonsHandler.addEnabledButton($("#addField"), nextFieldCost);
    }else{
      $("#addField").prop("disabled", true);
      this.buttonsHandler.addDisabledButton($("#addField"), nextFieldCost);
    }
    this.upgrades = [];
    this.upgrades.push(new Upgrade(
      this,
      this.upgrades.length,
      "Fruit value",
      "Double the value of fruits",
      "this.game.fruitValue = this.game.fruitValue * 2",
      1000,
      10,
      100
    ));
    this.upgrades.push(new Upgrade(
      this,
      this.upgrades.length,
      "Snake length bonus",
      "Increase the bonus from snake length",
      "this.game.snakeLengthBonus = this.game.snakeLengthBonus + 1",
      10,
      100,
      100
    ));
    this.upgrades.push(new Upgrade(
      this,
      this.upgrades.length,
      "Golden fruit chance",
      "Increase the chance for golden fruit spawn",
      "this.game.goldenFruitChance = this.game.goldenFruitChance + 10",
      1000,
      1000,
      10
    ));
    this.upgrades.push(new Upgrade(
      this,
      this.upgrades.length,
      "Golden fruit value",
      "Increase the value for golden fruits",
      "this.game.goldenFruitValue = this.game.goldenFruitValue + 1",
      100000,
      100,
      100
    ));
    for(var i = 0; i < this.upgrades.length; i++){
      this.drawUpgrade(this.upgrades[i], i);
    }
  }

  updateFieldButton(){
    this.buttonsHandler.deleteButton($("#addField"));
    $("#addField").prop("disabled", false);
    var nextFieldCost = this.calculateNextFieldCost();
    $("#addField").html("Add field: " + numberformat.format(nextFieldCost, {format: notation}) + " fruits");
    if( nextFieldCost <= this.fruits){
      this.buttonsHandler.addEnabledButton($("#addField"), nextFieldCost);
    }else{
      $("#addField").prop("disabled", true);
      this.buttonsHandler.addDisabledButton($("#addField"), nextFieldCost);
    }
  }

  drawField(prog){
    var row = $("#grid");

    var i = prog;
    var col = $("<div class=\"col-md-6\" id=\"field" + i + "\"></div>");

    var fruitButton = $("<button class=\"btn btn-primary\" id=\"fruitButton" + i +  "\">More fruits</button>");
    var biggerButton = $("<button class=\"btn btn-primary\" id=\"biggerButton" + i +  "\">Bigger field</button>");
    var prestigeButton = $("<button class=\"btn btn-success\" id=\"prestigeButton" + i +  "\">PRESTIGE</button>");
    var canvas = $("<canvas id=\"canvas" + i + "\" width=" + MAX_DIM*DRAWING_UNIT + " height=" + MAX_DIM*DRAWING_UNIT + " tabindex=\"0  \"></canvas>");

    col.append(fruitButton);
    col.append(biggerButton);
    col.append(prestigeButton);
    col.append($("<br>"));
    col.append(canvas);
    row.append(col);
    this.fields[this.fields.length - 1].setUIElements();
    this.fields[this.fields.length - 1].drawCanvas();
  }

  drawUpgrade(upgrade, prog){
    if(upgrade.level >= upgrade.maxLevel){
      return;
    }
    var row = $("#upgradeList");
    var col = $("<div class=\"col-md-6\" id=\"upgrade" + prog + "\"></div>");

    var nameSpan = $("<h3 id=\"name" + prog +"\"></h3>");
    var costSpan = $("<span id=\"cost" + prog +"\"></span>");
    var effectPar = $("<p id=\"effect" + prog +"\"></p>");
    var buyButton = $("<button class=\"btn btn-primary\" id=\"buyButton" + prog +  "\">Buy</button>");

    col.append(nameSpan);
    col.append($("<br>"));
    col.append(effectPar);
    col.append($("<br>"));
    col.append(costSpan);
    col.append($("<br>"));
    col.append(buyButton);
    row.append(col);

    $("#buyButton"+prog).click(function(){
      upgrade.levelUp();
    });

    upgrade.setUIElements();
    upgrade.updateUI();
  }

  eraseField(index){
    this.buttonsHandler.deleteButton(this.fields[index].fruitButton);
    this.buttonsHandler.deleteButton(this.fields[index].biggerButton);
    $("#field"+this.fields[index].prog).remove();
  }

  eraseUpgrade(index){
    this.buttonsHandler.deleteButton(this.upgrades[index].buyButton);
    $("#upgrade"+index).remove();
  }

  calculateNextFieldCost(){
    return Math.pow(10, this.prog);
  }

  addField(){
    var nextFieldCost = this.calculateNextFieldCost();
    if( nextFieldCost <= this.fruits){
      this.buttonsHandler.removeEnabledButton($("#addField"));
      this.fruits -= this.calculateNextFieldCost();
      this.buttonsHandler.fruitDown(this.fruits);
      this.fields.push(new Field(this, this.prog, this.buttonsHandler));
      this.prog++;
      this.drawField(this.prog - 1);
      this.fruitsSpan.html(numberformat.format(this.fruits,{format: notation}));
      nextFieldCost = this.calculateNextFieldCost();
      $("#addField").html("Add field: " + numberformat.format(nextFieldCost, {format: notation}) + " fruits");
      if( nextFieldCost <= this.fruits){
        this.buttonsHandler.addEnabledButton($("#addField"), nextFieldCost);
      }else{
        $("#addField").prop("disabled", true);
        this.buttonsHandler.addDisabledButton($("#addField"), nextFieldCost);
      }
    }
  }



  addFruits(snakeLength, goldenFruit){
    var value = (snakeLength - 1) * this.snakeLengthBonus;
    if(goldenFruit){
        this.fruits = this.fruits + ((1 + value) * this.fruitValue * this.goldenFruitValue * this.multiplier);
    }else{
        this.fruits = this.fruits + ((1 + value) * this.fruitValue * this.multiplier);
    }

    this.fruitsSpan.html(numberformat.format(this.fruits, {format: notation}));
    this.buttonsHandler.fruitUp(this.fruits);
  }

  removeFruits(number){
    this.fruits = this.fruits - number;
    this.fruitsSpan.html(numberformat.format(this.fruits, {format: notation}));
    this.buttonsHandler.fruitDown(this.fruits);
  }

  prestigeField(prog){
    var index = 0;
    for(var i = 0; i < this.fields.length; i++){
      if(this.fields[i].prog == prog){
        index = i;
      }
    }
    this.multiplier *= 2;
    this.tickDuration *= 0.85;
    this.eraseField(index);
    this.fields.splice(index, 1);
    this.multiplierSpan.html(numberformat.format(this.multiplier, {format: notation}));
    this.tickDurationSpan.html(numberformat.format(this.tickDuration, {format: notation}));
  }

  updateUI(){
    this.fruitsSpan.html(numberformat.format(this.fruits,{format: notation}));
    this.multiplierSpan.html(numberformat.format(this.multiplier, {format: notation}));
    this.tickDurationSpan.html(numberformat.format(this.tickDuration, {format: notation}));
    this.fruitValueSpan.html(numberformat.format(this.fruitValue, {format: notation}));
    this.snakeLengthBonusSpan.html(numberformat.format(this.snakeLengthBonus, {format: notation}));
    this.goldenFruitChanceSpan.html(numberformat.format(this.goldenFruitChance, {format: notation}));
    this.goldenFruitValueSpan.html(numberformat.format(this.goldenFruitValue, {format: notation}));
    var nextFieldCost = this.calculateNextFieldCost();
    $("#addField").html("Add field: " + numberformat.format(nextFieldCost, {format: notation}) + " fruits");
  }

  cycle(){
    for(var i = 0; i < this.fields.length; i++){
      if(!this.fields[i].manualControl){
          this.fields[i].cycle();
      }
    }
  }

  cycleNoGraphic(){
    for(var i = 0; i < this.fields.length; i++){
      if(!this.fields[i].manualControl){
          this.fields[i].cycleNoGraphic();
      }
    }
  }

  heuristic(ticks){
    var fruitsEarned = 0;
    for(var i = 0; i < this.fields.length; i++){
      var average = this.fields[i].dimension;
      var chance = this.fields[i].fruitNumber * 1.0 / (this.fields[i].dimension * this.fields[i].dimension);
      var gain = (
        ((average - 1) * this.snakeLengthBonus + 1) * this.fruitValue * this. multiplier * (1 - this.goldenFruitChance * 1.0 / 100) +
        ((average - 1) * this.snakeLengthBonus + 1) * this.fruitValue * this. multiplier * this.goldenFruitValue * this.goldenFruitChance * 1.0 / 100
      ) * chance * ticks;
      gain = Math.ceil(gain);
      fruitsEarned += gain;
    }
    this.fruits += fruitsEarned;
    this.updateUI();
    return fruitsEarned;
  }

  offlineProgress(lastTimestamp){
    var now = Date.now();
    var dt = (now - lastTimestamp);
    var ticks = Math.floor(dt / game.tickDuration);
    var fruitsEarned = this.heuristic(ticks);
    var alert = "<div class=\"alert alert-info alert-dismissible\">";
    alert += "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">";
    alert += "<span aria-hidden=\"true\">&times;</span></button>";
    alert += "While you were offline you earned " + numberformat.format(fruitsEarned, {format: notation}) + " fruits";
    alert += "</div>";
    $("#snakes").prepend(alert);
  }

  save(){
    var fieldsArray = [];
    for(var i = 0; i < this.fields.length; i++){
      fieldsArray.push({
        prog: this.fields[i].prog,
        dimension: this.fields[i].dimension,
        fruitNumber: this.fields[i].fruitNumber,
      });
    }
    var upgradesArray = [];
    for(var i = 0; i < this.upgrades.length; i++){
      upgradesArray.push({
        level: this.upgrades[i].level,
      });
    }
    var save = {
        timestamp: Date.now(),
        gameFruits: this.fruits,
        tickDuration: this.tickDuration,
        multiplier: this.multiplier,
        fruitValue: this.fruitValue,
        snakeLengthBonus: this.snakeLengthBonus,
        goldenFruitChance: this.goldenFruitChance,
        goldenFruitValue: this.goldenFruitValue,
        lastProg: this.prog,
        fields: fieldsArray,
        upgrades: upgradesArray,
    };
    localStorage.setItem("save",JSON.stringify(save));
    return JSON.stringify(save);
  }

  clearSave(){
    if(confirm("Are you sure you want to delete your save? (all progress will be lost!)")){
      localStorage.clear();
      location.reload();
    }
  }

  load(){
    var lastTimestamp = Date.now();
    var savedNotation = JSON.parse(localStorage.getItem("notation"));
    var savedHeuristic = JSON.parse(localStorage.getItem("heuristic"));
    var savedOffline = JSON.parse(localStorage.getItem("offline"));
    if((savedNotation !== null) && (typeof savedNotation !== "undefined")){
        notation = savedNotation;
        $("#notation").val(notation);
    }
    if((savedHeuristic !== null) && (typeof savedHeuristic !== "undefined")){
        heuristic = savedHeuristic;
        $("#heuristic").prop("checked", heuristic);
    }
    if((savedOffline !== null) && (typeof savedOffline !== "undefined")){
        offline = savedOffline;
        $("#offline").prop("checked", offline);
    }
    var save = JSON.parse(localStorage.getItem("save"));
    if (save !== null){
        if (typeof save.timestamp !== "undefined")lastTimestamp = save.timestamp;
        if (typeof save.gameFruits !== "undefined")this.fruits = save.gameFruits;
        if (typeof save.tickDuration !== "undefined")this.tickDuration = save.tickDuration;
        if (typeof save.multiplier !== "undefined")this.multiplier = save.multiplier;
        if (typeof save.fruitValue !== "undefined"){
          this.fruitValue = save.fruitValue;
        }else{
          if (typeof save.upgrades !== "undefined"){
            this.fruitValue = Math.pow(2, save.upgrades[0].level);
            this.multiplier = this.multiplier / this.fruitValue;
          }
        }
        if (typeof save.snakeLengthBonus !== "undefined")this.snakeLengthBonus = save.snakeLengthBonus;
        if (typeof save.goldenFruitChance !== "undefined")this.goldenFruitChance = save.goldenFruitChance;
        if (typeof save.goldenFruitValue !== "undefined")this.goldenFruitValue = save.goldenFruitValue;
        if (typeof save.lastProg !== "undefined")this.prog = save.lastProg;
        if (typeof save.fields !== "undefined"){
          for(var i = 0; i < this.fields.length; i++){
              this.eraseField(i);
          }
          this.fields = [];
          for(var i = 0; i < save.fields.length; i++){
              this.fields.push(new Field(this, save.fields[i].prog, this.buttonsHandler));
              this.fields[i].dimension = save.fields[i].dimension;
              this.fields[i].fruitNumber = save.fields[i].fruitNumber;
              this.fields[i].recreateGrid();
              this.fields[i].initialize();
              this.drawField(save.fields[i].prog);
              this.fields[i].updateButtons();
          }
          this.updateFieldButton();
        }
        if (typeof save.upgrades !== "undefined"){
          for(var i = 0; i < save.upgrades.length; i++){
            this.eraseUpgrade(i);
            this.upgrades[i].level = save.upgrades[i].level;
            this.drawUpgrade(this.upgrades[i], i);
          }
        }
        this.updateUI();
    }
    if(offline){
        this.offlineProgress(lastTimestamp);
    }

  }

  export(){
    var save = this.save();
    var string = btoa(save);
    $("#exportTextarea").val(string);
  }

  import(){
    var string = $("#exportTextarea").val();
    try{
      string = atob(string);
      var save = JSON.parse(string);
      localStorage.setItem("save",string);
      location.reload();
    }
    catch(e){
      $("#exportTextarea").val("Save not valid");
    }

  }
}
