
$( document ).ready(function() {
    var game = new Game();
    $( "#addField" ).click(function(){
        game.addField();
    });

    setInterval(function(){
        game.cycle();    
     }, game.tickDuration);

});
