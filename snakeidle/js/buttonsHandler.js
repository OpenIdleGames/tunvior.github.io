"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ButtonsHandler = function () {
  function ButtonsHandler() {
    _classCallCheck(this, ButtonsHandler);

    this.buttonsEnabled = {};
    this.buttonsDisabled = {};
  }

  _createClass(ButtonsHandler, [{
    key: "addEnabledButton",
    value: function addEnabledButton(button, cost) {
      var id = button.attr("id");
      this.buttonsEnabled[id] = [button, cost];
    }
  }, {
    key: "addDisabledButton",
    value: function addDisabledButton(button, cost) {
      var id = button.attr("id");
      this.buttonsDisabled[id] = [button, cost];
    }
  }, {
    key: "removeEnabledButton",
    value: function removeEnabledButton(button) {
      var id = button.attr("id");
      delete this.buttonsEnabled[id];
    }
  }, {
    key: "removeDisabledButton",
    value: function removeDisabledButton(button) {
      var id = button.attr("id");
      delete this.buttonsDisabled[id];
    }
  }, {
    key: "fruitUp",
    value: function fruitUp(fruits) {
      var handler = this;
      Object.keys(this.buttonsDisabled).forEach(function (key, index) {
        var item = this[key];
        var button = item[0];
        var cost = item[1];
        if (fruits >= cost) {
          button.prop("disabled", false);
          handler.removeDisabledButton(button);
          handler.addEnabledButton(button, cost);
        }
      }, this.buttonsDisabled);
    }
  }, {
    key: "fruitDown",
    value: function fruitDown(fruits) {
      var handler = this;
      Object.keys(this.buttonsEnabled).forEach(function (key, index) {
        var item = this[key];
        var button = item[0];
        var cost = item[1];
        if (fruits < cost) {
          button.prop("disabled", true);
          handler.removeEnabledButton(button);
          handler.addDisabledButton(button, cost);
        }
      }, this.buttonsEnabled);
    }
  }, {
    key: "deleteButton",
    value: function deleteButton(button) {
      var id = button.attr("id");
      if (id in this.buttonsDisabled) {
        delete this.buttonsDisabled[id];
      }
      if (id in this.buttonsEnabled) {
        delete this.buttonsEnabled[id];
      }
    }
  }]);

  return ButtonsHandler;
}();