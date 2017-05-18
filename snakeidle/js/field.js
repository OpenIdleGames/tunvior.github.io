const MAX_DIM = 15;
const DRAWING_UNIT = 20;

class Field{
  constructor(game){
    this.game = game;
    this.dimension = 3;
    this.fruitNumber = 1;
    this.fruitButton = null;
    this.biggerButton = null;
    this.canvas = null;
    this.grid = new Array(this.dimension);
    for(var i = 0; i < this.dimension; i++){
      this.grid[i] = new Array(this.dimension);
    }
    this.snake = [];
    this.direction = Math.floor(Math.random() * 4);
  }

  setUIElements(fruitButton, biggerButton, canvas){
    this.fruitButton = fruitButton;
    this.biggerButton = biggerButton;
    this.canvas = canvas;
    var field = this;
    this.fruitButton.click(function(){
      field.increaseFruits();
    });
    this.biggerButton.click(function(){
      field.increaseDimension();
    });
    this.initialize();
  }

  initialize(){
    var half = Math.floor(this.dimension / 2);
    this.snake = [[half, half]];
    this.clearGrid();
    this.updateSnakeGrid();
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
    for(var i = 0; i < this.snake.length; i++){
      var x = this.snake[i][0];
      var y = this.snake[i][1];
      this.grid[x][y] = State.SNAKE;
    }
  }

  generateFruits(){
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
    var ctx = this.canvas[0].getContext("2d");
    ctx.clearRect(0, 0, MAX_DIM*DRAWING_UNIT, MAX_DIM*DRAWING_UNIT);
    ctx.beginPath();
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
    if(this.fruitNumber <= Math.ceil(this.dimension * this.dimension * 0.1)){
      this.fruitNumber++;
      this.initialize();
      this.drawCanvas();
    }
  }

  increaseDimension(){
    if(this.dimension < MAX_DIM){
      this.dimension = this.dimension + 2;
      this.grid = new Array(this.dimension);
      for(var i = 0; i < this.dimension; i++){
        this.grid[i] = new Array(this.dimension);
      }
      this.initialize();
      this.drawCanvas();
    }
  }

  checkCollision(x, y){
    var cell = this.grid[x][y];

  }

  generateDirection(){
    var offset = Math.floor(Math.random() * 3);
    this.direction = this.mod((this.direction + offset - 1), 4);

    console.log("Direzione: " + this.direction);
  }

  findDestination(){
    var x, y;
    switch (this.direction) {
      case Direction.UP:
        x = this.snake[0][0];
        y = this.snake[0][1] - 1;
        break;
      case Direction.DOWN:
        x = this.snake[0][0];
        y = this.snake[0][1] + 1;
        break;
      case Direction.LEFT:
        x = this.snake[0][0] - 1;
        y = this.snake[0][1];
        break;
      case Direction.RIGHT:
        x = this.snake[0][0] + 1;
        y = this.snake[0][1];
        break;
    }
    console.log("X: " + x + " Y: " + y);
    return [x, y];
  }

  checkDestination(coordinates){
    var x = coordinates[0];
    var y = coordinates[1];
    if( (x >= this.dimension) ||
        (y >= this.dimension) ||
        (x < 0) ||
        (y < 0) ){
      this.death();
    }else{
      if(this.grid[x][y] == State.SNAKE){
        this.death();
      }else{
        if(this.grid[x][y] == State.FRUIT){
          this.game.addFruits(this.snake.length);
          this.moveSnake(coordinates, true);
          this.spawnFruit();
        }else{
          this.moveSnake(coordinates, false);
        }
      }
    }

  }

  death(){
    console.log("morto");
    this.initialize();
  }

  moveSnake(coordinates, fruitEaten){

    if(fruitEaten){
      this.grid[coordinates[0]][coordinates[1]] = State.SNAKE;
      var newSnake = [coordinates];
      for(var i = 0; i < this.snake.length; i++){
        newSnake.push(this.snake[i]);
      }
      this.snake = newSnake;
    }else{
      var tail = this.snake[this.snake.length - 1];
      this.grid[coordinates[0]][coordinates[1]] = State.SNAKE;
      this.grid[tail[0]][tail[1]] = State.FREE;
      var newSnake = [coordinates];
      for(var i = 0; i < this.snake.length - 1; i++){
        newSnake.push(this.snake[i]);
      }
      this.snake = newSnake;
    }
  }

  cycle(){
    this.generateDirection();
    var coords = this.findDestination();
    this.checkDestination(coords);
    this.drawCanvas();
  }

  cycleNoGraphic(){
    this.generateDirection();
    var coords = this.findDestination();
    this.checkDestination(coords);
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }
}
