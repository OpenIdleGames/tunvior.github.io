"use strict";
exports.__esModule = true;
var field_1 = require("./field");
var Game = (function () {
    function Game() {
        this.fruits = 0;
        this.tickDuration = 1000;
        this.fields = [];
        this.fields.push(new field_1.Field('canvas' + this.fields.length));
        this.drawGrid();
    }
    Game.prototype.drawGrid = function () {
        var htmlSnippet = "";
        for (var i = 0; i < this.fields.length; i++) {
            if ((i % 2) == 0) {
                htmlSnippet += "<div class=\"col-md-6\"><button class=\"btn btn-primary\">+ fruits</button><button class=\"btn btn-primary\">bigger</button><br /><canvas " + this.fields[i].canvas + "width=\"300\" height=\"300\" style=\"border:1px solid #000000;\"></canvas></div></div>";
            }
            else {
                if (i != this.fields.length - 1) {
                    htmlSnippet += "<div class=\"row\"><div class=\"col-md-6\"><button class=\"btn btn-primary\">+ fruits</button><button class=\"btn btn-primary\">bigger</button><br /><canvas " + this.fields[i].canvas + " width=\"300\" height=\"300\" style=\"border:1px solid #000000;\"></canvas></div>";
                }
                else {
                    htmlSnippet += "<div class=\"row\"><div class=\"col-md-6\"><button class=\"btn btn-primary\">+ fruits</button><button class=\"btn btn-primary\">bigger</button><br /><canvas " + this.fields[i].canvas + " width=\"300\" height=\"300\" style=\"border:1px solid #000000;\"></canvas></div><div class=\"col-md-6\"></div>";
                }
            }
        }
    };
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map