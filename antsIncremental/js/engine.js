var game = {   
    //current resources
    food: 0,
    dirt: 0,
    land: 0,
    science: 0,
    population: 0,
    gatherers: 0,
    miners: 0,
    soldiers: 0,
    scientists: 0,
    eggs: 0,
    
    //max resources
    maxFood: 0,
    maxDirt: 0,
    maxLand: 0,
    maxScience: 0,
    maxPopulation: 0,
    maxGatherers: 0,
    maxMiners: 0,
    maxSoldiers: 0,
    maxScientists: 0,
    
    //prestige
    crystals: 0,
    prestigeProductionBonus: 0,
    prestigeWarehouseBonus: 0,
    prestigeDirtCostReduction: 0,
    prestigeLandCostReduction: 0,
    prestigeSoldierBonus: 0,
    prestigeQueenBonus: 0,
    
    //research
    researchFoodBonus: 0,
    researchDirtBonus: 0,
    researchWarehouseBonus: 0,
    researchDirtCostReduction: 0,
    researchLandCostReduction: 0,
    researchQueenBonus: 0,
    
    //war
    trainingSoldierBonus: 0,
    
    //buildings
    gates: [1],
    mines: [1],
    barracks: [1],
    laboratories: [1],
    dormitories: [1],
    warehouses: [1],
    
    updateLimits: function(){
        game.maxGatherers = 0;
        var actualValue = gateBase;
        for(var i = 0; i < game.gates.length; i++){
            game.maxGatherers += actualValue * game.gates[i];
            actualValue *= gateIncrementRatio;
        }
        
        game.maxMiners = 0;
        actualValue = mineBase;
        for(var i = 0; i < game.mines.length; i++){
            game.maxMiners += actualValue * game.mines[i];
            actualValue *= mineIncrementRatio;
        }
        
        game.maxSoldiers = 0;
        actualValue = barrackBase;
        for(var i = 0; i < game.barracks.length; i++){
            game.maxSoldiers += actualValue * game.barracks[i];
            actualValue *= barrackIncrementRatio;
        }
        
        game.maxFood = 0;
        game.maxDirt = 0;
        actualValue = warehouseBase;
        for(var i = 0; i < game.warehouses.length; i++){
            game.maxFood += actualValue * game.warehouses[i];
            game.maxDirt = game.maxFood;
            actualValue *= warehouseIncrementRatio;
        }
        
        game.maxScience = 0;
        actualValue = scienceBase;
        for(var i = 0; i < game.laboratories.length; i++){
            game.maxScience += actualValue * game.laboratories[i];
            actualValue *= scienceIncrementRatio;
        }
        
        game.maxSciencentists = 0;
        actualValue = laboratoryBase;
        for(var i = 0; i < game.laboratories.length; i++){
            game.maxSciencentists += actualValue * game.laboratories[i];
            actualValue *= laboratoryIncrementRatio;
        }
        
        game.maxPopulation = 0;
        actualValue = dormitoryBase;
        for(var i = 0; i < game.dormitories.length; i++){
            game.maxPopulation += actualValue * game.dormitories[i];
            actualValue *= dormitoryIncrementRatio;
        }
        
        game.maxLand = 0;
        actualValue = landBase;
        for(var i = 0; i < game.barracks.length; i++){
            game.maxLand += actualValue * game.barracks[i];
            actualValue *= landIncrementRatio;
        }
        
        game.updateResourcesDisplay();
    },
    
    updateResourcesDisplay: function(){
        $('#food').text("Food : " + game.food + "/" + game.maxFood);
        $('#dirt').text("Dirt : " + game.dirt + "/" + game.maxDirt);
        $('#land').text("Land : " + game.land + "/" + game.maxLand);
        $('#science').text("Science : " + game.science + "/" + game.maxScience);
        $('#population').text("Population: " + game.population + "/" + game.maxPopulation);
        $('#gatherers').text("Gatherers: " + game.gatherers + "/" + game.maxGatherers);
        $('#miners').text("Miners : " + game.miners + "/" + game.maxMiners);
        $('#soldiers').text("Soldiers : " + game.soldiers + "/" + game.maxSoldiers);
        $('#scientists').text("Scientists: " + game.scientists + "/" + game.maxSciencentists);
    },
};

$(document).ready(function() {
    game.updateLimits();
});

