import { State } from './state';

export class Field{
  dimension: number;
  fruitNumber: number;
  canvas: string;
  grid:State[];
  snake: Array<number>[];


  constructor(canvas:string){
    this.dimension = 3;
    this.fruitNumber = 1;
    this.canvas = canvas;
    this.grid = [];
    for(var i = 0; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        this.grid[i][j] = State.FREE;
      }
    }
    this.snake = [];
    this.initialize();
  }

  initialize(){
    var half = Math.floor(this.dimension / 2);
    this.snake = [[half, half]];
    this.updateSnakeGrid();
    this.generateFruits();
    this.drawCanvas();
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
      this.grid[x][y] == State.FRUIT;
    }else{
      this.spawnFruit();
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

    for(var i = 0; i < this.snake.length; i++){
      var x = this.snake[i][0];
      var y = this.snake[i][1];
      this.grid[x][y] = State.SNAKE;
    }
  }

  drawCanvas(){
    var canvas = <HTMLCanvasElement>document.getElementById(this.canvas);
    var ctx = canvas.getContext("2d");
    for(var i = 0 ; i < this.dimension; i++){
      for(var j = 0; j < this.dimension; j++){
        if(this.grid[i][j] == State.FRUIT){
          ctx.fillStyle = 'green';
          ctx.fillRect(i*10, j*10, 10, 10);
        }
        if(this.grid[i][j] == State.SNAKE){
          ctx.fillStyle = 'red';
          ctx.fillRect(i*10, j*10, 10, 10);
        }
      }
    }
  }
}
