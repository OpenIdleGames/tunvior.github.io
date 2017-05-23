const MAX_DIM = 15;
const DRAWING_UNIT = 20;

class Field{
  constructor(game, prog){
    this.prog = prog;
    this.game = game;
    this.dimension = 3;
    this.fruitNumber = 1;
    this.fruitButton = null;
    this.biggerButton = null;
    this.prestigeButton = null;
    this.canvas = null;
    this.grid = new Array(this.dimension);
    for(var i = 0; i < this.dimension; i++){
      this.grid[i] = new Array(this.dimension);
    }
    this.snake = [];
    this.direction = Math.floor(Math.random() * 4);
  }

  setUIElements(fruitButton, biggerButton, prestigeButton, canvas){
    this.fruitButton = fruitButton;
    this.biggerButton = biggerButton;
    this.prestigeButton = prestigeButton;
    this.canvas = canvas;
    var field = this;
    this.fruitButton.click(function(){
      field.increaseFruits();
    });
    this.biggerButton.click(function(){
      field.increaseDimension();
    });
    this.prestigeButton.click(function(){
      field.game.prestigeField(this.prog);
    })
    this.prestigeButton.hide();
    var mfCost = this.calculateMoreFruitsCost();
    var bfCost = this.calculateBiggerFieldCost();
    this.fruitButton[0].innerHTML+= ": " + mfCost + " fruits";
    this.biggerButton[0].innerHTML+= ": " + bfCost + " fruits";
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
    for(var i = 0; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        if(this.grid[i][j] == State.SNAKE){
          this.grid[i][j] = State.FREE;
        }
      }
    }
    for(i = 0; i < this.snake.length; i++){
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
          ctx.beginPath();
          ctx.arc((offset+i)*DRAWING_UNIT+DRAWING_UNIT/2, (offset+j)*DRAWING_UNIT+DRAWING_UNIT/2, DRAWING_UNIT/2, 0, 2 * Math.PI, false);
          ctx.fill();
          //ctx.fillRect((offset+i)*DRAWING_UNIT, (offset+j)*DRAWING_UNIT, DRAWING_UNIT, DRAWING_UNIT);
        }
        if(this.grid[i][j] == State.SNAKE){
          ctx.fillStyle = 'green';
          ctx.fillRect((offset+i)*DRAWING_UNIT, (offset+j)*DRAWING_UNIT, DRAWING_UNIT, DRAWING_UNIT);
        }
      }
    }
  }

  increaseFruits(){
    if(this.calculateMoreFruitsCost() <= this.game.fruits){
      this.game.removeFruits(this.calculateMoreFruitsCost());
      this.fruitNumber++;
      this.fruitButton[0].innerHTML= "More fruits: " + this.calculateMoreFruitsCost() + " fruits";
      if(this.fruitNumber > Math.ceil(this.dimension * this.dimension * 0.1)){
        if(this.dimension < MAX_DIM){
          this.fruitButton.prop("disabled", true);
        }else{
          this.fruitButton.hide();
          this.biggerButton.hide();
          this.prestigeButton.show();
        }
      }
      this.initialize();
      this.drawCanvas();
    }
  }

  increaseDimension(){
    if(this.calculateBiggerFieldCost() <= this.game.fruits){
      this.game.removeFruits(this.calculateBiggerFieldCost());
      this.dimension = this.dimension + 2;
      this.grid = new Array(this.dimension);
      for(var i = 0; i < this.dimension; i++){
        this.grid[i] = new Array(this.dimension);
      }
      this.biggerButton[0].innerHTML= "Bigger field: " + this.calculateBiggerFieldCost() + " fruits";
      if(this.dimension == MAX_DIM){
        this.biggerButton.prop("disabled", true);
      }
      this.fruitButton.prop("disabled", false);
      this.initialize();
      this.drawCanvas();
    }
  }

  generateDirection(){
    var offset = Math.floor(Math.random() * 3);
    this.direction = this.mod((this.direction + offset - 1), 4);
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
    this.initialize();
  }

  moveSnake(coordinates, fruitEaten){

    if(fruitEaten){
      var newSnake = [coordinates];
      for(var i = 0; i < this.snake.length; i++){
        newSnake.push(this.snake[i]);
      }
      this.snake = newSnake;
      this.updateSnakeGrid();
    }else{
      var tail = this.snake[this.snake.length - 1];
      var newSnake = [coordinates];
      for(var i = 0; i < this.snake.length - 1; i++){
        newSnake.push(this.snake[i]);
      }
      this.snake = newSnake;
      this.updateSnakeGrid();
    }
  }

  cycle(){
    var coords = this.findDestination();
    this.checkDestination(coords);
    this.drawCanvas();
    this.generateDirection();
  }

  cycleNoGraphic(){
    var coords = this.findDestination();
    this.checkDestination(coords);
    this.generateDirection();
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  calculateMoreFruitsCost(){
    return Math.pow(10, this.prog) * Math.pow(2, this.fruitNumber - 1);
  }

  calculateBiggerFieldCost(){
    return Math.pow(10, this.prog) * Math.pow(10, (this.dimension - 1) / 2 );
  }
}
