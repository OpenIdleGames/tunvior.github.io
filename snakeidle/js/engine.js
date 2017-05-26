
$( document ).ready(function() {
    var save = JSON.parse(localStorage.getItem("save"));
    var game = new Game();
    if (save !== null){
        if (typeof save.gameFruits !== "undefined")game.fruits = save.gameFruits;
        if (typeof save.tickDuration !== "undefined")game.tickDuration = save.tickDuration;
        if (typeof save.multiplier !== "undefined")game.multiplier = save.multiplier;
        if (typeof save.snakeLengthBonus !== "undefined")game.snakeLengthBonus = save.snakeLengthBonus;
        if (typeof save.lastProg !== "undefined")game.prog = save.lastProg;
        if (typeof save.fields !== "undefined"){
          game.eraseField(0);
          game.fields = [];
          for(var i = 0; i < save.fields.length; i++){
              game.fields.push(new Field(game, save.fields[i].prog));
              game.drawField(save.fields[i].prog);
              game.fields[i].dimension = save.fields[i].dimension;
              game.fields[i].fruitNumber = save.fields[i].fruitNumber;
              game.fields[i].recreateGrid();
              game.fields[i].initialize();
              game.fields[i].updateButtons();
          }
        }
        if (typeof save.upgrades !== "undefined"){
          game.eraseUpgrades();
          game.upgrades = [];
          for(var i = 0; i < save.upgrades.length; i++){
            game.upgrades.push(new Upgrade(
              game,
              game.upgrades.length,
              save.upgrades[i].name,
              save.upgrades[i].description,
              save.upgrades[i].effect,
              save.upgrades[i].startingPrice,
              save.upgrades[i].ratio
            ));
            game.upgrades[i].level = save.upgrades[i].level;
            game.drawUpgrade(game.upgrades[i], i);
          }
        }
        game.updateUI();
        var savedNotation = JSON.parse(localStorage.getItem("notation"));
        if((savedNotation !== null) && (typeof savedNotation !== "undefined")){
            notation = savedNotation;
            $("#notation").val(notation);
        }
    }
    $( "#addField" ).click(function(){
        game.addField();
    });
    $( "#save").click(function(){
        game.save();
    });
    $( "#clearSave").click(function(){
        game.clearSave();
    });
    $('#snakes a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });
    $('#upgrades a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    });
    $("#notation").change(function(){
        notation = $("#notation option:selected").val();
        localStorage.setItem("notation",JSON.stringify(notation));
    });
    /*
    setInterval(function(){
        game.cycle();
     }, game.tickDuration);
     */
     var now, dt, last = Date.now();
     function cycle(){
         now = Date.now();
         dt = (now - last);
         var ticks = Math.floor(dt / game.tickDuration);
         var i = ticks;
         while(i > 0){
            if(ticks > 1){
                game.cycleNoGraphic();
            }else{
                game.cycle();
            }
            i--;
         }
         last = now - dt % game.tickDuration;
         requestAnimationFrame(cycle);
     }
     requestAnimationFrame(cycle);


     setInterval(function(){
         game.save();
     }, 10000);

     setInterval(function(){
         $(document).prop('title', "Snake Idle: " + numberformat.format(game.fruits, {format: notation}));
    }, 1000);
});
