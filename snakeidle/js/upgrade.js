class Upgrade{
  constructor(game, prog, name, description, effect, startingPrice, ratio){
    this.game = game;
    this.prog = prog;
    this.name = name;
    this.description = description;
    this.effect = effect;
    this.startingPrice = startingPrice;
    this.ratio = ratio;
    this.level = 0;
    //UI elements
    this.nameSpan = null;
    this.costSpan = null;
    this.effectPar = null;
    this.buyButton = null;
  }

  setUIElements(){
    this.nameSpan = $("#name" + this.prog);
    this.costSpan = $("#cost" + this.prog);
    this.effectPar = $("#effect" + this.prog);
    this.buyButton = $("#buyButton" + this.prog);
  }

  updateUI(){
    var cost = this.calculateCost();
    this.nameSpan.html(this.name + " level " + this.level);
    this.costSpan.html(numberformat.format(cost, {format: notation}) + " fruits");
    this.effectPar.html(this.description);

    if( cost <= this.game.fruits){
      this.game.buttonsHandler.addEnabledButton(this.buyButton, cost);
    }else{
      this.buyButton.prop("disabled", true);
      this.game.buttonsHandler.addDisabledButton(this.buyButton, cost);
    }
  }

  calculateCost(){
    return this.startingPrice * Math.pow(this.ratio, this.level);
  }

  levelUp(){
    if(this.calculateCost() <= this.game.fruits){
      this.game.buttonsHandler.removeEnabledButton(this.buyButton);
      this.game.removeFruits(this.calculateCost());
      this.level++;
      eval(this.effect);
      this.updateUI();
      this.game.updateUI();
    }
  }
}
