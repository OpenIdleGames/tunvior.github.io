"use strict";
exports.__esModule = true;
var state_1 = require("./state");
var Field = (function () {
    function Field(canvas) {
        this.dimension = 3;
        this.fruitNumber = 1;
        this.canvas = canvas;
        this.grid = [];
        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                this.grid[i][j] = state_1.State.FREE;
            }
        }
        this.snake = [];
        this.initialize();
    }
    Field.prototype.initialize = function () {
        var half = Math.floor(this.dimension / 2);
        this.snake = [[half, half]];
        this.updateSnakeGrid();
        this.generateFruits();
        this.drawCanvas();
    };
    Field.prototype.generateFruits = function () {
        for (var i = 0; i < this.fruitNumber; i++) {
            this.spawnFruit();
        }
    };
    Field.prototype.spawnFruit = function () {
        var x = Math.floor(Math.random() * this.dimension);
        var y = Math.floor(Math.random() * this.dimension);
        if (this.grid[x][y] == state_1.State.FREE) {
            this.grid[x][y] == state_1.State.FRUIT;
        }
        else {
            this.spawnFruit();
        }
    };
    Field.prototype.updateSnakeGrid = function () {
        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                if (this.grid[i][j] == state_1.State.SNAKE) {
                    this.grid[i][j] = state_1.State.FREE;
                }
            }
        }
        for (var i = 0; i < this.snake.length; i++) {
            var x = this.snake[i][0];
            var y = this.snake[i][1];
            this.grid[x][y] = state_1.State.SNAKE;
        }
    };
    Field.prototype.drawCanvas = function () {
        var canvas = document.getElementById(this.canvas);
        var ctx = canvas.getContext("2d");
        for (var i = 0; i < this.dimension; i++) {
            for (var j = 0; j < this.dimension; j++) {
                if (this.grid[i][j] == state_1.State.FRUIT) {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(i * 10, j * 10, 10, 10);
                }
                if (this.grid[i][j] == state_1.State.SNAKE) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(i * 10, j * 10, 10, 10);
                }
            }
        }
    };
    return Field;
}());
exports.Field = Field;
//# sourceMappingURL=field.js.map