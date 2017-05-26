var notation = 'standard';

class Game{

  constructor(){
    this.buttonsHandler = new ButtonsHandler();
    this.fruits = 0;
    this.tickDuration = 1000;
    this.multiplier = 1000000000;
    this.snakeLengthBonus = 0;
    this.prog = 0;
    this.fields = [];
    this.fields.push(new Field(this, this.prog, this.buttonsHandler));
    this.prog++;
    this.fruitsSpan = $("#fruits");
    this.tickDurationSpan = $("#tickDuration");
    this.multiplierSpan = $("#multiplier");
    this.snakeLengthBonusSpan = $("#snakeLengthBonus");
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
      "this.game.multiplier = this.game.multiplier * 2",
      1000,
      10
    ));
    this.upgrades.push(new Upgrade(
      this,
      this.upgrades.length,
      "Snake length bonus",
      "Increase the bonus from snake length",
      "this.game.snakeLengthBonus = this.game.snakeLengthBonus + 1",
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
    var canvas = $("<canvas id=\"canvas" + i + "\" width=" + MAX_DIM*DRAWING_UNIT + " height=" + MAX_DIM*DRAWING_UNIT + "></canvas>");

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
    $("#field"+index).remove();
  }

  eraseUpgrades(){
    $("#upgradeList").empty();
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



  addFruits(snakeLength){
    var value = (snakeLength - 1) * this.snakeLengthBonus;
    this.fruits = this.fruits + ((1 + value) * this.multiplier);
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
    this.buttonsHandler.deleteButton(this.fields[index].fruitButton);
    this.buttonsHandler.deleteButton(this.fields[index].biggerButton);
    this.fields.splice(index, 1);
    this.multiplier *= 2;
    this.tickDuration *= 0.85;
    this.eraseField(prog);
    this.multiplierSpan.html(numberformat.format(this.multiplier, {format: notation}));
    this.tickDurationSpan.html(numberformat.format(this.tickDuration, {format: notation}));
  }

  updateUI(){
    this.fruitsSpan.html(numberformat.format(this.fruits,{format: notation}));
    this.multiplierSpan.html(numberformat.format(this.multiplier, {format: notation}));
    this.tickDurationSpan.html(numberformat.format(this.tickDuration, {format: notation}));
    this.snakeLengthBonusSpan.html(numberformat.format(this.snakeLengthBonus, {format: notation}));
    var nextFieldCost = this.calculateNextFieldCost();
    $("#addField").html("Add field: " + numberformat.format(nextFieldCost, {format: notation}) + " fruits");
  }

  cycle(){
    for(var i = 0; i < this.fields.length; i++){
      this.fields[i].cycle();
    }
  }

  cycleNoGraphic(){
    for(var i = 0; i < this.fields.length; i++){
      this.fields[i].cycleNoGraphic();
    }
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
        name: this.upgrades[i].name,
        description: this.upgrades[i].description,
        effect: this.upgrades[i].effect,
        startingPrice: this.upgrades[i].startingPrice,
        ratio: this.upgrades[i].ratio,
        level: this.upgrades[i].level,
      });
    }
    var save = {
        gameFruits: this.fruits,
        tickDuration: this.tickDuration,
        multiplier: this.multiplier,
        snakeLengthBonus: this.snakeLengthBonus,
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
    var savedNotation = JSON.parse(localStorage.getItem("notation"));
    if((savedNotation !== null) && (typeof savedNotation !== "undefined")){
        notation = savedNotation;
        $("#notation").val(notation);
    }
    var save = JSON.parse(localStorage.getItem("save"));
    if (save !== null){
        if (typeof save.gameFruits !== "undefined")this.fruits = save.gameFruits;
        if (typeof save.tickDuration !== "undefined")this.tickDuration = save.tickDuration;
        if (typeof save.multiplier !== "undefined")this.multiplier = save.multiplier;
        if (typeof save.snakeLengthBonus !== "undefined")this.snakeLengthBonus = save.snakeLengthBonus;
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
          this.eraseUpgrades();
          this.upgrades = [];
          for(var i = 0; i < save.upgrades.length; i++){
            this.upgrades.push(new Upgrade(
              this,
              this.upgrades.length,
              save.upgrades[i].name,
              save.upgrades[i].description,
              save.upgrades[i].effect,
              save.upgrades[i].startingPrice,
              save.upgrades[i].ratio
            ));
            this.upgrades[i].level = save.upgrades[i].level;
            this.drawUpgrade(this.upgrades[i], i);
          }
        }
        this.updateUI();
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
      this.load();
    }
    catch(e){
      $("#exportTextarea").val("Save not valid");
    }

  }
}
