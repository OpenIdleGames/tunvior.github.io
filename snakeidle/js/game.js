var notation = 'standard';

class Game{

  constructor(){
    this.fruits = 0;
    this.tickDuration = 1000;
    this.multiplier = 1;
    this.snakeLengthBonus = 0;
    this.prog = 0;
    this.fields = [];
    this.fields.push(new Field(this, this.prog));
    this.prog++;
    this.fruitsSpan = $("#fruits");
    this.tickDurationSpan = $("#tickDuration");
    this.multiplierSpan = $("#multiplier");
    this.snakeLengthBonusSpan = $("#snakeLengthBonus");
    this.drawField(this.prog - 1);
    $("#addField").html("Add field: " + numberformat.format(this.calculateNextFieldCost(), {format: notation}) + " fruits");
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
    $("#field"+index).remove();
  }

  eraseUpgrades(){
    $("#upgradeList").empty();
  }

  calculateNextFieldCost(){
    return Math.pow(10, this.prog);
  }

  addField(){
    if(this.calculateNextFieldCost() <= this.fruits){
      this.fruits -= this.calculateNextFieldCost();
      this.fields.push(new Field(this, this.prog));
      this.prog++;
      this.drawField(this.prog - 1);
      this.fruitsSpan.html(numberformat.format(this.fruits,{format: notation}));
      $("#addField").html("Add field: " + numberformat.format(this.calculateNextFieldCost(), {format: notation}) + " fruits");
    }
  }

  addFruits(snakeLength){
    var value = (snakeLength - 1) * this.snakeLengthBonus;
    this.fruits = this.fruits + ((1 + value) * this.multiplier);
    this.fruitsSpan.html(numberformat.format(this.fruits, {format: notation}));
  }

  removeFruits(number){
    this.fruits = this.fruits - number;
    this.fruitsSpan.html(numberformat.format(this.fruits, {format: notation}));
  }

  prestigeField(prog){
    var index = 0;
    for(var i = 0; i < this.fields.length; i++){
      if(this.fields[i].prog == prog){
        index = i;
      }
    }
    this.fields.splice(index, 1);
    this.multiplier *= 2;
    this.tickDuration *= 0.85;
    this.eraseField(prog);
    this.multiplierSpan.html(numberformat.format(this.multiplier, {format: notation}));
    this.tickDurationSpan.html(numberformat.format(this.tickDuration, {format: notation}));
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
  }

  clearSave(){
    if(confirm("Are you sure you want to delete your save? (all progress will be lost!)")){
      localStorage.clear();
      location.reload();
    }
  }

  updateUI(){
    this.fruitsSpan.html(numberformat.format(this.fruits,{format: notation}));
    this.multiplierSpan.html(numberformat.format(this.multiplier, {format: notation}));
    this.tickDurationSpan.html(numberformat.format(this.tickDuration, {format: notation}));
    this.snakeLengthBonusSpan.html(numberformat.format(this.snakeLengthBonus, {format: notation}));
    $("#addField").html("Add field: " + numberformat.format(this.calculateNextFieldCost(), {format: notation}) + " fruits");
  }

}
