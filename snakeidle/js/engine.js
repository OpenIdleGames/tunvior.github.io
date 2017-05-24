
$( document ).ready(function() {
    var save = JSON.parse(localStorage.getItem("save"));
    var game = new Game();
    if (save !== null){
        if (typeof save.gameFruits !== "undefined")game.fruits = save.gameFruits;
        if (typeof save.tickDuration !== "undefined")game.tickDuration = save.tickDuration;
        if (typeof save.multiplier !== "undefined")game.multiplier = save.multiplier;
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
        game.updateUI();
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
    });

    setInterval(function(){
        game.cycle();
     }, game.tickDuration);

     setInterval(function(){
         game.save();
     }, 10000);

});
