
$( document ).ready(function() {
    var game = new Game();
    $( "#addField" ).click(function(){
        game.addField();
    });
    $('#grid a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
    $('#upgrades a').click(function (e) {
      e.preventDefault()
      $(this).tab('show')
    })

    setInterval(function(){
        game.cycle();
     }, game.tickDuration);

});
