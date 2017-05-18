class Game{
  constructor(){
    this.fruits = 0;
    this.tickDuration = 1000;
    this.fields = [];
    this.fields.push(new Field('canvas' + this.fields.length));
    this.drawGrid();
  }

  drawGrid(){
    var htmlSnippet = "";
    for(var i = 0; i < this.fields.length; i++){
        if((i % 2) === 0){
          htmlSnippet += "<div class=\"col-md-6\"><button class=\"btn btn-primary\">+ fruits</button><button class=\"btn btn-primary\">bigger</button><br /><canvas id=\"" + this.fields[i].canvas + "\" width=\"300\" height=\"300\" style=\"border:1px solid #000000;\"></canvas></div></div>";
        }else{
          if(i != this.fields.length - 1){
              htmlSnippet += "<div class=\"row\"><div class=\"col-md-6\"><button class=\"btn btn-primary\">+ fruits</button><button class=\"btn btn-primary\">bigger</button><br /><canvas id=\"" + this.fields[i].canvas + "\" width=\"300\" height=\"300\" style=\"border:1px solid #000000;\"></canvas></div>";
          }else{
              htmlSnippet += "<div class=\"row\"><div class=\"col-md-6\"><button class=\"btn btn-primary\">+ fruits</button><button class=\"btn btn-primary\">bigger</button><br /><canvas id=\"" + this.fields[i].canvas + "\" width=\"300\" height=\"300\" style=\"border:1px solid #000000;\"></canvas></div><div class=\"col-md-6\"></div>";
          }
        }
    }
    var grid = document.getElementById("grid");
    grid.innerHTML = htmlSnippet;

    for(i = 0; i < this.fields.length; i++){
      this.fields[i].drawCanvas();
    }
  }
}
