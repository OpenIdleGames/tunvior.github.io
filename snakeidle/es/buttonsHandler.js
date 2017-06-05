class ButtonsHandler{
  constructor(){
    this.buttonsEnabled = {};
    this.buttonsDisabled = {};
  }

  addEnabledButton(button, cost){
    var id = button.attr("id");
    this.buttonsEnabled[id] = [button, cost];
  }

  addDisabledButton(button, cost){
    var id = button.attr("id");
    this.buttonsDisabled[id] = [button, cost];
  }

  removeEnabledButton(button){
    var id = button.attr("id");
    delete this.buttonsEnabled[id];
  }

  removeDisabledButton(button){
    var id = button.attr("id");
    delete this.buttonsDisabled[id];
  }

  fruitUp(fruits){
    var handler = this;
    Object.keys(this.buttonsDisabled).forEach(function(key, index){
        var item = this[key];
        var button = item[0];
        var cost = item[1];
        if( fruits >= cost){
          button.prop("disabled", false);
          handler.removeDisabledButton(button);
          handler.addEnabledButton(button, cost);
        }
    }, this.buttonsDisabled);
  }

  fruitDown(fruits){
    var handler = this;
    Object.keys(this.buttonsEnabled).forEach(function(key, index){
      var item = this[key];
      var button = item[0];
      var cost = item[1];
      if( fruits < cost){
        button.prop("disabled", true);
        handler.removeEnabledButton(button);
        handler.addDisabledButton(button, cost);
      }
    }, this.buttonsEnabled);
  }

  deleteButton(button){
    var id = button.attr("id");
    if(id in this.buttonsDisabled){
      delete this.buttonsDisabled[id];
    }
    if(id in this.buttonsEnabled){
        delete this.buttonsEnabled[id];
    }
  }

}
