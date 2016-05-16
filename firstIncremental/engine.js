var game = {
    lastUpdate : new Date().getTime(),
    money : 0,
    clickValue : 1,
    tickValue : 1,
    nextClickUpgradeCost : 10,
    nextTickUpgradeCost : 100,
    ratioClickUpgradeCost : 1.1,
    ratioTickUpgradeCost: 1.2,

    updateDisplay : function() {
        $("#money").text(game.money);
        $("#buyClickUpgrade").text("Upgrade Click: " + game.nextClickUpgradeCost);
        $("#buyTickUpgrade").text("Upgrade Tick: " + game.nextTickUpgradeCost);
    },

    engine : function() {
        game.load();
        setInterval(function() {
            var thisUpdate = new Date().getTime();
            var diff = (thisUpdate - game.lastUpdate) / 1000;
            game.money += diff * game.tickValue;
            game.updateDisplay();
            game.lastUpdate = thisUpdate;
            game.save();
        }, 1000);
    },
    
    click : function() {
        game.money += game.clickValue;
        game.updateDisplay();
    },
    
    buyClickUpgrade : function() {
        if(game.money >= game.nextClickUpgradeCost){
            game.money -= game.nextClickUpgradeCost;
            game.clickValue++;
            game.nextClickUpgradeCost *= game.ratioClickUpgradeCost;
            game.updateDisplay();
        }else{
            $("#log").show();
            $("#log").text("Need More money");
            $("#log").fadeOut(1000);
        }
    },
    
     buyTickUpgrade : function() {
        if(game.money >= game.nextTickUpgradeCost){
            game.money -= game.nextTickUpgradeCost;
            game.tickValue++;
            game.nextTickUpgradeCost *= game.ratioTickUpgradeCost;
            game.updateDisplay();
        }else{
            $("#log").show();
            $("#log").text("Need More money");
            $("#log").fadeOut(1000);
        }
    },
    
    save : function() { 
        var save = {
            money: game.money,
            clickValue: game.clickValue,
            tickValue: game.tickValue,
            nextClickUpgradeCost: game.nextClickUpgradeCost,
            nextTickUpgradeCost: game.nextTickUpgradeCost,
            ratioClickUpgradeCost: game.ratioClickUpgradeCost,
            ratioTickUpgradeCost: game.ratioTickUpgradeCost,
            lastUpdate: game.lastUpdate,
        };
        localStorage.setItem("save",JSON.stringify(save));
    },
    
    load : function() {
        var savegame = JSON.parse(localStorage.getItem("save"));
        if(savegame != null){
            if (typeof savegame.money !== "undefined") game.money = savegame.money;
            if (typeof savegame.clickValue !== "undefined") game.clickValue = savegame.clickValue;
            if (typeof savegame.tickValue !== "undefined") game.tickValue = savegame.tickValue;
            if (typeof savegame.nextClickUpgradeCost !== "undefined") game.nextClickUpgradeCost = savegame.nextClickUpgradeCost;
            if (typeof savegame.nextTickUpgradeCost !== "undefined") game.nextTickUpgradeCost = savegame.nextTickUpgradeCost;
            if (typeof savegame.ratioClickUpgradeCost !== "undefined") game.ratioClickUpgradeCost = savegame.ratioClickUpgradeCost;
            if (typeof savegame.ratioTickUpgradeCost !== "undefined") game.ratioTickUpgradeCost = savegame.ratioTickUpgradeCost;
            if (typeof savegame.lastUpdate !== "undefined") game.lastUpdate = savegame.lastUpdate;
        }
        
        game.updateDisplay;
    },
    
};


$(document).ready(function() {
    $("#clicker").click(function() {
        game.click();
    });
    $("#buyClickUpgrade").click(function() {
       game.buyClickUpgrade(); 
    });
    $("#buyTickUpgrade").click(function() {
       game.buyTickUpgrade(); 
    });
    game.engine();
});




