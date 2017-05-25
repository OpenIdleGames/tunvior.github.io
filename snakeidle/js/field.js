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
      field.game.prestigeField(field.prog);
    });
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

  recreateGrid(){
    this.grid = new Array(this.dimension);
    for(var i = 0; i < this.dimension; i++){
      this.grid[i] = new Array(this.dimension);
    }
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
        if( (this.grid[i][j] == State.SNAKE) ||
            (this.grid[i][j] == State.HEAD) ){
          this.grid[i][j] = State.FREE;
        }
      }
    }
    for(i = 0; i < this.snake.length; i++){
      var x = this.snake[i][0];
      var y = this.snake[i][1];
      if(i === 0){
          this.grid[x][y] = State.HEAD;
      }else{
          this.grid[x][y] = State.SNAKE;
      }

    }
  }

  generateFruits(){
    for(var i = 0; i < this.fruitNumber; i++){
      this.spawnFruit();
    }
  }

  spawnFruit(){
    var freeCells = [];
    for(var i = 0; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        if(this.grid[i][j] == State.FREE){
          freeCells.push([i, j]);
        }
      }
    }
    if(freeCells.length === 0){
      return;
    }else{
      var index = Math.floor(Math.random() * freeCells.length);
      var coords = freeCells[index];
      this.grid[coords[0]][coords[1]] = State.FRUIT;
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
        if(this.grid[i][j] == State.HEAD){
          ctx.fillStyle = 'green';
          ctx.fillRect((offset+i)*DRAWING_UNIT, (offset+j)*DRAWING_UNIT, DRAWING_UNIT, DRAWING_UNIT);
          ctx.fillStyle = 'yellow';
          switch (this.direction) {
            case Direction.UP:
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              break;
            case Direction.DOWN:
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              break;
            case Direction.LEFT:
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              break;
            case Direction.RIGHT:
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              break;
          }
        }
      }
    }
  }

  increaseFruits(){
    if(this.calculateMoreFruitsCost() <= this.game.fruits){
      this.game.removeFruits(this.calculateMoreFruitsCost());
      this.fruitNumber++;
      this.fruitButton[0].innerHTML= "More fruits: " + numberformat.format(this.calculateMoreFruitsCost(), {format: notation}) + " fruits";
      if(this.fruitNumber > Math.ceil(this.dimension * this.dimension * 0.1)){
        if(this.dimension < MAX_DIM){
          this.fruitButton.html("More fruits: Need bigger field");
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
      if(this.dimension == MAX_DIM){
        this.biggerButton[0].innerHTML= "Bigger field: MAXED";
        this.biggerButton.prop("disabled", true);
      }else{
        this.biggerButton[0].innerHTML= "Bigger field: " + numberformat.format(this.calculateBiggerFieldCost(), {format: notation}) + " fruits";
      }
      this.fruitButton[0].innerHTML= "More fruits: " + numberformat.format(this.calculateMoreFruitsCost(), {format: notation}) + " fruits";
      this.fruitButton.prop("disabled", false);
      this.initialize();
      this.drawCanvas();
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
      this.spawnFruit();
    }else{
      var newSnake = [coordinates];
      for(var i = 0; i < this.snake.length - 1; i++){
        newSnake.push(this.snake[i]);
      }
      this.snake = newSnake;
      this.updateSnakeGrid();
    }
  }

  findDestination(){
    var distances = [];
    for(var i = 0; i < this.dimension; i++){
      distances[i] = [];
    }
    for(var i = 0; i < distances.length; i++){
      for(var j = 0; j < distances.length; j++){
        distances[i][j] = 1000;
      }
    }
    var directions = [];
    for(var i = 0; i < this.dimension; i++){
      directions[i] = [];
    }
    for(var i = 0; i < directions.length; i++){
      for(var j = 0; j < directions.length; j++){
        directions[i][j] = [];
      }
    }

    //setting starting point
    distances[this.snake[0][0]][this.snake[0][1]] = 0;

    var fruitFound = false;
    var fruitCoords = [];
    var distance = 0;
    var pathAvaiable = true;
    //main cycle
    while( (!fruitFound) && (pathAvaiable) ){
      pathAvaiable = false;
      for(var i = 0; i < this.dimension; i++){
        for(var j = 0; j < this.dimension; j++){
          if(distances[i][j] == distance){ //looking for the cells at certain distance
            var possibleDirections = [ //making a list of 4 cardinal points
              [i - 1, j, Direction.UP],
              [i + 1, j, Direction.DOWN],
              [i, j - 1, Direction.LEFT],
              [i, j + 1, Direction.RIGHT]
            ];
            var badIndexes = [];
            for(var k = 0; k < possibleDirections.length; k++){//removing direction where there is a wall or snake
              var x = possibleDirections[k][0];
              var y = possibleDirections[k][1];
              if(
                (this.isOutOfBound(possibleDirections[k])) ||
                (this.grid[x][y] == State.HEAD) ||
                (this.grid[x][y] == State.SNAKE)
              ){
                badIndexes.push(k);
              }
            }
            for(var k = badIndexes.length - 1; k >= 0; k--){
                possibleDirections.splice(badIndexes[k], 1);
            }

            if(possibleDirections.length === 0){
              //return this.death();
            }else{
              for(var k = 0; k < possibleDirections.length; k++){//updating distance and direction matrix
                var x = possibleDirections[k][0];
                var y = possibleDirections[k][1];
                var dir = possibleDirections[k][2];
                if(distances[x][y] >= (distance + 1)){
                  pathAvaiable = true;
                  distances[x][y] = distance + 1;
                  directions[x][y].push(dir);
                }
              }
              for(var k = 0; k < possibleDirections.length; k++){//looking for fruit
                var x = possibleDirections[k][0];
                var y = possibleDirections[k][1];
                if(this.grid[x][y] == State.FRUIT){
                  fruitFound = true;
                  fruitCoords.push(possibleDirections[k]);
                }
              }
            }
          }
        }
      }
      distance++;
    }

    if(!pathAvaiable){
      return this.death();
    }

    var index = Math.floor(Math.random() * fruitCoords.length);
    var target = fruitCoords[index];
    var nextDirections = directions[target[0]][target[1]];//contains the list of direction that reach the fruit
    var chosenDirection = null; //will contain the chosen direction
    while(nextDirections.length > 0){
      index = Math.floor(Math.random() * nextDirections.length); //picking a random direction between possible
      chosenDirection = nextDirections[index];
      switch (chosenDirection) {
        case Direction.UP:
          target = [target[0] + 1, target[1]];
          break;
        case Direction.DOWN:
          target = [target[0] - 1, target[1]];
          break;
        case Direction.LEFT:
          target = [target[0], target[1] + 1];
          break;
        case Direction.RIGHT:
          target = [target[0], target[1] - 1];
          break;
      }
      nextDirections = directions[target[0]][target[1]];
    }
    var x = this.snake[0][0];
    var y = this.snake[0][1];
    var coords = [];
    switch (chosenDirection) {
      case Direction.UP:
        coords = [x - 1, y];
        break;
      case Direction.DOWN:
        coords = [x + 1, y];
        break;
      case Direction.LEFT:
        coords = [x, y - 1];
        break;
      case Direction.RIGHT:
        coords = [x, y + 1];
        break;
    }
    this.direction = chosenDirection;
    if(distance === 1){
      this.game.addFruits(this.snake.length);
      this.moveSnake(coords, true);
    }else{
      this.moveSnake(coords, false);
    }
  }

  isOutOfBound(coords){
    return ( (coords[0] < 0) ||
             (coords[1] < 0) ||
             (coords[0] >= this.dimension) ||
             (coords[1] >= this.dimension) );
  }

  cycle(){
    this.findDestination();
    this.drawCanvas();
  }

  cycleNoGraphic(){
    this.findDestination();
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

  updateButtons(){
    if(this.dimension == MAX_DIM){
      this.biggerButton[0].innerHTML= "Bigger field: MAXED";
      this.biggerButton.prop("disabled", true);
    }else{
      this.biggerButton[0].innerHTML= "Bigger field: " + numberformat.format(this.calculateBiggerFieldCost(), {format: notation}) + " fruits";
    }
    this.fruitButton[0].innerHTML= "More fruits: " + numberformat.format(this.calculateMoreFruitsCost(), {format: notation}) + " fruits";
    if(this.fruitNumber > Math.ceil(this.dimension * this.dimension * 0.1)){
      if(this.dimension < MAX_DIM){
        this.fruitButton.prop("disabled", true);
        this.fruitButton[0].innerHTML="More fruits: Need bigger field";
      }else{
        this.fruitButton.hide();
        this.biggerButton.hide();
        this.prestigeButton.show();
      }
    }

  }
}
