var notation = 'standard';

class Game{

  constructor(){
    this.fruits = 0;
    this.tickDuration = 1000;
    this.multiplier = 1;
    this.prog = 0;
    this.fields = [];
    this.fields.push(new Field(this, this.prog));
    this.prog++;
    this.fruitsSpan = document.getElementById("fruits");
    this.tickDurationSpan = document.getElementById("tickDuration");
    this.multiplierSpan = document.getElementById("multiplier");
    this.drawField(this.prog - 1);
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
    this.fields[this.fields.length - 1].setUIElements($("#fruitButton"+i), $("#biggerButton"+i), $("#prestigeButton"+i), $("#canvas"+i));
    this.fields[this.fields.length - 1].drawCanvas();
  }

  eraseField(index){
    $("#field"+index).remove();
  }

  /*
  drawGrid(){

    $("#grid").empty();
    for(var i = 0; i < this.fields.length;){
      var row = $("<div class=\"row\"></div>");
      var col1 = $("<div class=\"col-md-6\"></div>");
      var col2 = $("<div class=\"col-md-6\"></div>");

      var fruitButton = $("<button class=\"btn btn-primary\" id=\"fruitButton" + i +  "\">More fruits</button>");
      var biggerButton = $("<button class=\"btn btn-primary\" id=\"biggerButton" + i +  "\">Bigger field</button>");
      var prestigeButton = $("<button class=\"btn btn-success\" id=\"prestigeButton" + i +  "\">PRESTIGE</button>");
      var canvas = $("<canvas id=\"canvas" + i + "\" width=" + MAX_DIM*DRAWING_UNIT + " height=" + MAX_DIM*DRAWING_UNIT + "></canvas>");

      col1.append(fruitButton);
      col1.append(biggerButton);
      col1.append(prestigeButton);
      col1.append($("<br>"));
      col1.append(canvas);
      i++;
      if(i <= this.fields.length - 1){
        fruitButton = $("<button class=\"btn btn-primary\" id=\"fruitButton" + i +  "\">More fruits</button>");
        biggerButton = $("<button class=\"btn btn-primary\" id=\"biggerButton" + i +  "\">Bigger field</button>");
        prestigeButton = $("<button class=\"btn btn-success\" id=\"prestigeButton" + i +  "\">PRESTIGE</button>");
        canvas = $("<canvas id=\"canvas" + i + "\" width=" + MAX_DIM*DRAWING_UNIT + " height=" + MAX_DIM*DRAWING_UNIT + "></canvas>");

        col2.append(fruitButton);
        col2.append(biggerButton);
        col2.append(prestigeButton);
        col2.append($("<br>"));
        col2.append(canvas);

        i++;
      }
      row.append(col1);
      row.append(col2);
      $("#grid").append(row);
    }

    for(i = 0; i < this.fields.length; i++){
      this.fields[i].setUIElements($("#fruitButton"+i), $("#biggerButton"+i), $("#prestigeButton"+i), $("#canvas"+i));
    }

    for(i = 0; i < this.fields.length; i++){
      this.fields[i].drawCanvas();
    }
  }
  */
  addField(){
    this.fields.push(new Field(this, this.prog));
    this.prog++;
    this.drawField(this.prog - 1);
  }

  addFruits(number){
    this.fruits = this.fruits + (number * this.multiplier);
    this.fruitsSpan.innerHTML = numberformat.format(this.fruits, {format: notation});
  }

  removeFruits(number){
    this.fruits = this.fruits - number;
    this.fruitsSpan.innerHTML = numberformat.format(this.fruits, {format: notation});
  }

  prestigeField(prog){
    var index = 0;
    for(var i = 0; i < this.fields.length; i++){
      if(this.fields[i].prog == prog){
        index = i;
      }
    }
    this.fields.splice(index, 1);
    this.multiplier *= 1.15;
    this.tickDuration *= 0.85;
    this.eraseField(prog);
    this.multiplierSpan.innerHTML = numberformat.format(this.multiplier, {format: notation});
    this.tickDurationSpan.innerHTML = numberformat.format(this.tickDuration, {format: notation});
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
    var save = {
        gameFruits: this.fruits,
        tickDuration: this.tickDuration,
        multiplier: this.multiplier,
        lastProg: this.prog,
        fields: fieldsArray,
    };
    localStorage.setItem("save",JSON.stringify(save));
  }

  clearSave(){
    localStorage.clear();
  }

  updateUI(){
    this.fruitsSpan.innerHTML = this.fruits;
    this.tickDurationSpan.innerHTML = this.tickDuration;
    this.multiplierSpan.innerHTML = this.multiplier;
  }
}
