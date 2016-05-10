var game = {
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
        var lastUpdate = new Date().getTime();

        setInterval(function() {
            var thisUpdate = new Date().getTime();
            var diff = (thisUpdate - lastUpdate) / 1000;
            game.money += diff * game.tickValue;
            game.updateDisplay();
            lastUpdate = thisUpdate;
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
    }
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




