var tick = 200; //duration of a game tick in milliseconds

var dormitoryBase = 10;
var gateBase = 5;
var mineBase = 5;
var barrackBase = 5;
var landBase = 100;
var warehouseBase = 100;
var scienceBase = 10;
var laboratoryBase = 2;
var queenBase = 0.2;

var dormitoryIncrementRatio = 2;
var gateIncrementRatio = 2;
var mineIncrementRatio = 2;
var barrackIncrementRatio = 2;
var landIncrementRatio = 2;
var warehouseIncrementRatio = 2;
var queenIncrementRatio = 2;
var scienceIncrementRatio = 2;
var laboratoryIncrementRatio = 2;

var dormitoryLevelUpRatioCost = 10;
var gateLevelUpRatioCost = 10;
var mineLevelUpRatioCost = 10;
var barrackLevelUpRatioCost = 10;
var warehouseLevelUpRatioCost = 10;
var queenLevelUpRatioCost = 10;
var laboratoryLevelUpRatioCost = 10;

//cost expressed as couple (food, dirt)
var dormitoryBaseCost = [0, 50];
var gateBaseCost = [0, 75];
var mineBaseCost = [0, 40];
var barrackBaseCost = [50, 50];
var warehouseBaseCost = [0, 60];
var queenBaseCost = [200, 200];
var laboratoryBaseCost = [0, 150];

var baseTerritoryCost = 10;