const MAX_DIM = 15;
const DRAWING_UNIT = 20;

class Field{
  constructor(canvas){
    this.dimension = 3;
    this.fruitNumber = 1;
    this.canvas = canvas;
    this.grid = new Array(this.dimension);
    for(var i = 0; i < this.dimension; i++){
      this.grid[i] = new Array();
    }
    this.snake = [];
    this.initialize();
  }

  initialize(){
    var half = Math.floor(this.dimension / 2);
    this.snake = [[half, half]];
    this.generateFruits();
  }

  clearGrid(){
    for(var i = 0; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        this.grid[i][j] = State.FREE;
      }
    }
  }

  updateSnakeGrid(){
    this.clearGrid();
    for(var i = 0; i < this.snake.length; i++){
      var x = this.snake[i][0];
      var y = this.snake[i][1];
      this.grid[x][y] = State.SNAKE;
    }
  }

  generateFruits(){
    this.updateSnakeGrid();
    for(var i = 0; i < this.fruitNumber; i++){
      this.spawnFruit();
    }
  }

  spawnFruit(){
    var x = Math.floor(Math.random() * this.dimension);
    var y = Math.floor(Math.random() * this.dimension);
    if(this.grid[x][y] == State.FREE){
      this.grid[x][y] = State.FRUIT;
    }else{
      this.spawnFruit();
    }
  }

  drawCanvas(){
    var canvas = document.getElementById(this.canvas);
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, MAX_DIM*DRAWING_UNIT, MAX_DIM*DRAWING_UNIT);
    var offset = (MAX_DIM - this.dimension) / 2;
    ctx.rect(offset*DRAWING_UNIT, offset*DRAWING_UNIT, this.dimension*DRAWING_UNIT, this.dimension*DRAWING_UNIT);
    ctx.stroke();
    for(var i = 0 ; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        if(this.grid[i][j] == State.FRUIT){
          ctx.fillStyle = 'red';
          ctx.fillRect((offset+i)*DRAWING_UNIT, (offset+j)*DRAWING_UNIT, DRAWING_UNIT, DRAWING_UNIT);
        }
        if(this.grid[i][j] == State.SNAKE){
          ctx.fillStyle = 'green';
          ctx.fillRect((offset+i)*DRAWING_UNIT, (offset+j)*DRAWING_UNIT, DRAWING_UNIT, DRAWING_UNIT);
        }
      }
    }
  }

  increaseFruits(){
    this.fruitNumber++;
    this.generateFruits();
    this.drawCanvas();
  }

}
