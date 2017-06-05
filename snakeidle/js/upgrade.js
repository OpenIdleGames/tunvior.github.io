"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Upgrade = function () {
  function Upgrade(game, prog, name, description, effect, startingPrice, ratio, maxLevel) {
    _classCallCheck(this, Upgrade);

    this.game = game;
    this.prog = prog;
    this.name = name;
    this.description = description;
    this.effect = effect;
    this.startingPrice = startingPrice;
    this.ratio = ratio;
    this.maxLevel = maxLevel;
    this.level = 0;
    //UI elements
    this.nameSpan = null;
    this.costSpan = null;
    this.effectPar = null;
    this.buyButton = null;
  }

  _createClass(Upgrade, [{
    key: "setUIElements",
    value: function setUIElements() {
      this.nameSpan = $("#name" + this.prog);
      this.costSpan = $("#cost" + this.prog);
      this.effectPar = $("#effect" + this.prog);
      this.buyButton = $("#buyButton" + this.prog);
    }
  }, {
    key: "updateUI",
    value: function updateUI() {
      var cost = this.calculateCost();
      this.nameSpan.html(this.name + " level " + this.level);
      this.costSpan.html(numberformat.format(cost, { format: notation }) + " fruits");
      this.effectPar.html(this.description);

      if (cost <= this.game.fruits) {
        this.game.buttonsHandler.addEnabledButton(this.buyButton, cost);
      } else {
        this.buyButton.prop("disabled", true);
        this.game.buttonsHandler.addDisabledButton(this.buyButton, cost);
      }
    }
  }, {
    key: "calculateCost",
    value: function calculateCost() {
      return this.startingPrice * Math.pow(this.ratio, this.level);
    }
  }, {
    key: "levelUp",
    value: function levelUp() {
      if (this.calculateCost() <= this.game.fruits) {
        this.game.buttonsHandler.removeEnabledButton(this.buyButton);
        this.game.removeFruits(this.calculateCost());
        this.level++;
        eval(this.effect);
        if (this.level >= this.maxLevel) {
          this.game.eraseUpgrade(this.prog);
          this.game.updateUI();
        } else {
          this.updateUI();
          this.game.updateUI();
        }
      }
    }
  }]);

  return Upgrade;
}();