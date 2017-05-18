class Game{

  constructor(){
    this.fruits = 0;
    this.tickDuration = 1000;
    this.fields = [];
    this.fields.push(new Field(this));
    this.fruitsSpan = document.getElementById("fruits");
    this.tickDurationSpan = document.getElementById("tickDuration");
    this.drawGrid();
  }


  drawGrid(){
    $("#grid").empty();
    for(var i = 0; i < this.fields.length;){
      var row = $("<div class=\"row\"></div>");
      var col1 = $("<div class=\"col-md-6\"></div>");
      var col2 = $("<div class=\"col-md-6\"></div>");

      var fruitButton = $("<button class=\"btn btn-primary\" id=\"fruitButton" + i +  "\">More Fruits</button>");
      var biggerButton = $("<button class=\"btn btn-primary\" id=\"biggerButton" + i +  "\">Bigger Field</button>");
      var canvas = $("<canvas id=\"canvas" + i + "\" width=" + MAX_DIM*DRAWING_UNIT + " height=" + MAX_DIM*DRAWING_UNIT + "></canvas>");

      col1.append(fruitButton);
      col1.append(biggerButton);
      col1.append($("<br>"));
      col1.append(canvas);
      i++;
      if(i <= this.fields.length - 1){
        fruitButton = $("<button class=\"btn btn-primary\" id=\"fruitButton" + i +  "\">More Fruits</button>");
        biggerButton = $("<button class=\"btn btn-primary\" id=\"biggerButton" + i +  "\">Bigger Field</button>");
        canvas = $("<canvas id=\"canvas" + i + "\" width=" + MAX_DIM*DRAWING_UNIT + " height=" + MAX_DIM*DRAWING_UNIT + "></canvas>");

        col2.append(fruitButton);
        col2.append(biggerButton);
        col2.append($("<br>"));
        col2.append(canvas);

        i++;
      }
      row.append(col1);
      row.append(col2);
      $("#grid").append(row);
    }

    for(i = 0; i < this.fields.length; i++){
      this.fields[i].setUIElements($("#fruitButton"+i), $("#biggerButton"+i), $("#canvas"+i));
    }

    for(i = 0; i < this.fields.length; i++){
      this.fields[i].drawCanvas();
    }
  }

  addField(){
    this.fields.push(new Field(this));
    this.drawGrid();
  }

  addFruits(number){
    this.fruits = this.fruits + number;
    this.fruitsSpan.innerHTML = this.fruits;
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
}
