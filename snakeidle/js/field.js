const MAX_DIM = 15;
const DRAWING_UNIT = 20;

class Field{
  constructor(game, prog, buttonsHandler){
    this.prog = prog;
    this.game = game;
    this.buttonsHandler = buttonsHandler;
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
    this.manualControl = false;
  }

  setUIElements(){
    this.fruitButton = $("#fruitButton" + this.prog);
    this.biggerButton = $("#biggerButton" + this.prog);
    this.prestigeButton = $("#prestigeButton" + this.prog);
    this.canvas = $("#canvas" + this.prog);
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
    this.fruitButton.html("More fruits: " + numberformat.format(mfCost, {format: notation}) + " fruits");
    this.biggerButton.html( "Bigger field: " + numberformat.format(bfCost, {format: notation}) + " fruits");

    if(this.fruitNumber >= (this.dimension + (this.dimension - 3) / 2 - 1)){
      if(this.dimension < MAX_DIM){
        this.fruitButton.html("More fruits: Need bigger field");
        this.fruitButton.prop("disabled", true);
      }else{
        this.fruitButton.hide();
        this.biggerButton.hide();
        this.prestigeButton.show();
      }
    }else{
      if(mfCost <= this.game.fruits){
        this.buttonsHandler.addEnabledButton(this.fruitButton, mfCost);
      }else{
        this.fruitButton.prop("disabled", true);
        this.buttonsHandler.addDisabledButton(this.fruitButton, mfCost);
      }
    }

    if(this.dimension == MAX_DIM){
      this.biggerButton.html("Bigger field: MAXED");
      this.biggerButton.prop("disabled", true);
    }else{
      if(bfCost <= this.game.fruits){
        this.buttonsHandler.addEnabledButton(this.biggerButton, bfCost);
      }else{
        this.biggerButton.prop("disabled", true);
        this.buttonsHandler.addDisabledButton(this.biggerButton, bfCost);
      }
    }

    var interval;
    var idle;

    this.canvas.focusin(function(){
      field.manualControl = true;
      idle =  setTimeout(function(){
          field.canvas.focusout();
          field.canvas.blur();
      }, 15000);
      interval = setInterval(function(){
        var destination = [];
        switch (field.direction) {
          case Direction.UP:
            destination = [field.snake[0][0] - 1, field.snake[0][1]];
            break;
          case Direction.DOWN:
            destination = [field.snake[0][0] + 1, field.snake[0][1]];
            break;
          case Direction.LEFT:
            destination = [field.snake[0][0], field.snake[0][1] - 1];
            break;
          case Direction.RIGHT:
            destination = [field.snake[0][0], field.snake[0][1] + 1];
            break;
        }
        if( field.isOutOfBound(destination) ||
            (field.grid[destination[0]][destination[1]] == State.SNAKE) ){
              field.death();
        }else{
          if(field.grid[destination[0]][destination[1]] == State.FRUIT){
            field.game.addFruits(field.snake.length, false);
            field.moveSnake(destination, true);
          }else if(field.grid[destination[0]][destination[1]] == State.GOLDEN_FRUIT){
            field.game.addFruits(field.snake.length, true);
            field.moveSnake(destination, true);
          }else{
            field.moveSnake(destination, false);
          }
        }
        field.drawCanvas();

      }, game.tickDuration);
      field.canvas.keydown(function(event){
        clearTimeout(idle);
        switch (event.which) {
          case 37:
            event.preventDefault();
          case 65://a
            field.direction = Direction.UP;
            break;
          case 38:
            event.preventDefault();
          case 87://w
            field.direction = Direction.LEFT;
            break;
          case 40:
            event.preventDefault();
          case 83://s
            field.direction = Direction.RIGHT;
            break;
          case 39:
            event.preventDefault();
          case 68://d
            field.direction = Direction.DOWN;
            break;
          }
          idle =  setTimeout(function(){
              field.canvas.focusout();
              field.canvas.blur();
          }, 15000);
      });

    });
    this.canvas.focusout(function(){
      field.manualControl = false;
      field.canvas.unbind("keydown");
      clearInterval(interval);
      clearTimeout(idle);
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
      var gold = Math.floor(Math.random() * 100);
      if (this.game.goldenFruitChance > gold){
          this.grid[coords[0]][coords[1]] = State.GOLDEN_FRUIT;
      }else{
          this.grid[coords[0]][coords[1]] = State.FRUIT;
      }

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
        }
        if(this.grid[i][j] == State.GOLDEN_FRUIT){
          ctx.fillStyle = 'gold';
          ctx.beginPath();
          ctx.arc((offset+i)*DRAWING_UNIT+DRAWING_UNIT/2, (offset+j)*DRAWING_UNIT+DRAWING_UNIT/2, DRAWING_UNIT/2, 0, 2 * Math.PI, false);
          ctx.fill();
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
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              break;
            case Direction.DOWN:
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
                (offset+i)*DRAWING_UNIT+DRAWING_UNIT*3/4,
                (offset+j)*DRAWING_UNIT+DRAWING_UNIT/4,
                DRAWING_UNIT/10,
                0, 2 * Math.PI, false
              );
              ctx.fill();
              ctx.stroke();
              break;
            case Direction.RIGHT:
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
          }
        }
      }
    }
  }

  increaseFruits(){
    var mfCost = this.calculateMoreFruitsCost();
    if(mfCost <= this.game.fruits){
      this.buttonsHandler.removeEnabledButton(this.fruitButton);
      this.game.removeFruits(mfCost);
      this.fruitNumber++;
      mfCost = this.calculateMoreFruitsCost();
      this.fruitButton.html("More fruits: " + numberformat.format(mfCost, {format: notation}) + " fruits");
      //if(this.fruitNumber > Math.ceil(this.dimension * this.dimension * 0.1)){
      if(this.fruitNumber >= (this.dimension + (this.dimension - 3) / 2 - 1)){
        if(this.dimension < MAX_DIM){
          this.fruitButton.html("More fruits: Need bigger field");
          this.fruitButton.prop("disabled", true);
        }else{
          this.fruitButton.hide();
          this.biggerButton.hide();
          this.prestigeButton.show();
        }
      }else{
        if(mfCost <= this.game.fruits){
          this.buttonsHandler.addEnabledButton(this.fruitButton, mfCost);
        }else{
          this.fruitButton.prop("disabled", true);
          this.buttonsHandler.addDisabledButton(this.fruitButton, mfCost);
        }
      }
      //this.initialize();
      this.spawnFruit();
      this.drawCanvas();
    }
  }

  increaseDimension(){
    var bfCost = this.calculateBiggerFieldCost();
    if(bfCost <= this.game.fruits){
      this.buttonsHandler.removeEnabledButton(this.biggerButton);
      this.game.removeFruits(bfCost);
      this.dimension = this.dimension + 2;
      bfCost = this.calculateBiggerFieldCost();
      if(this.dimension == MAX_DIM){
        this.biggerButton.html("Bigger field: MAXED");
        this.biggerButton.prop("disabled", true);
      }else{
        this.biggerButton.html("Bigger field: " + numberformat.format(bfCost, {format: notation}) + " fruits");
        if(bfCost <= this.game.fruits){
          this.buttonsHandler.addEnabledButton(this.biggerButton, bfCost);
        }else{
          this.biggerButton.prop("disabled", true);
          this.buttonsHandler.addDisabledButton(this.biggerButton, bfCost);
        }
      }
      var mfCost = this.calculateMoreFruitsCost();
      this.fruitButton.html("More fruits: " + numberformat.format(mfCost, {format: notation}) + " fruits");
      this.fruitButton.prop("disabled", false);
      if(mfCost <= this.game.fruits){
        this.buttonsHandler.addEnabledButton(this.fruitButton, mfCost);
      }else{
        this.fruitButton.prop("disabled", true);
        this.buttonsHandler.addDisabledButton(this.fruitButton, mfCost);
      }
      this.upgradeGrid();
      this.drawCanvas();
    }
  }

  upgradeGrid(){
    var newGrid = [];
    for(var i = 0; i < this.dimension; i++){
      newGrid[i] = [];
    }
    for(var i = 0; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        if( (i == 0) ||
            (i == this.dimension - 1) ||
            (j == 0) ||
            (j == this.dimension - 1)
          ){
            newGrid[i][j] = State.FREE;
          }else{
            newGrid[i][j] = this.grid[i - 1][j - 1];
          }
      }
    }
    this.grid = newGrid;
    for(var i = 0; i < this.snake.length; i++){
      this.snake[i][0]++;
      this.snake[i][1]++;
    }
    this.updateSnakeGrid();
    while(this.activeFruits() < this.fruitNumber){
      this.spawnFruit();
    }
  }

  activeFruits(){
    var count = 0;
    for(var i = 0; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        if( (this.grid[i][j] == State.FRUIT) ||
            (this.grid[i][j] == State.GOLDEN_FRUIT)
        ){
          count++;
        }
      }
    }
    return count;
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
                if( (this.grid[x][y] == State.FRUIT) ||
                    (this.grid[x][y] == State.GOLDEN_FRUIT)
                  ){
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
    var goldenFruitCoords = [];
    for(var i = 0; i < fruitCoords.length; i++){
      if(this.grid[fruitCoords[i][0]][fruitCoords[i][1]] == State.GOLDEN_FRUIT){
        goldenFruitCoords.push(fruitCoords[i]);
      }
    }
    var index;
    var target;

    if(goldenFruitCoords.length > 0){
      index = Math.floor(Math.random() * goldenFruitCoords.length);
      target = goldenFruitCoords[0];
    }else{
      index = Math.floor(Math.random() * fruitCoords.length);
      target = fruitCoords[0];
    }

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
      if(this.grid[coords[0]][coords[1]] == State.FRUIT){
        this.game.addFruits(this.snake.length, false);
        this.moveSnake(coords, true);
      }else{
        this.game.addFruits(this.snake.length, true);
        this.moveSnake(coords, true);
      }
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
      this.biggerButton.html("Bigger field: MAXED");
      this.biggerButton.prop("disabled", true);
    }else{
      this.biggerButton.html("Bigger field: " + numberformat.format(this.calculateBiggerFieldCost(), {format: notation}) + " fruits");
    }
    this.fruitButton.html("More fruits: " + numberformat.format(this.calculateMoreFruitsCost(), {format: notation}) + " fruits");
    //if(this.fruitNumber > Math.ceil(this.dimension * this.dimension * 0.1)){
    if(this.fruitNumber >= (this.dimension + (this.dimension - 3) / 2 - 1)){
      if(this.dimension < MAX_DIM){
        this.fruitButton.prop("disabled", true);
        this.fruitButton.html("More fruits: Need bigger field");
      }else{
        this.fruitButton.hide();
        this.biggerButton.hide();
        this.prestigeButton.show();
      }
    }

  }
}
