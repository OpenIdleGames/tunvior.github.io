$( document ).ready(function() {
    var game = new Game();
    game.load();

    $( "#addField" ).click(function(){
        game.addField();
    });
    $( "#save").click(function(){
        game.save();
    });
    $( "#clearSave").click(function(){
        game.clearSave();
    });
    $( "#exportButton").click(function(){
      game.export();
    });
    $( "#importButton").click(function(){
      game.import();
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
