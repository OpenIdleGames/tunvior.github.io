"use strict";

var game;

$(document).ready(function () {
    game = new Game();
    game.load();

    $("#addField").click(function () {
        game.addField();
    });
    $("#save").click(function () {
        game.save();
    });
    $("#clearSave").click(function () {
        game.clearSave();
    });
    $("#exportButton").click(function () {
        game.export();
    });
    $("#importButton").click(function () {
        game.import();
    });
    $('#snakes a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#upgrades a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $("#notation").change(function () {
        notation = $("#notation option:selected").val();
        localStorage.setItem("notation", JSON.stringify(notation));
    });
    $("#heuristic").change(function () {
        heuristic = $("#heuristic").prop("checked");
        localStorage.setItem("heuristic", JSON.stringify(heuristic));
    });
    $("#offline").change(function () {
        offline = $("#offline").prop("checked");
        localStorage.setItem("offline", JSON.stringify(offline));
    });
    /*
    setInterval(function(){
        game.cycle();
     }, game.tickDuration);
     */
    var now,
        dt,
        last = Date.now();
    function cycle() {
        now = Date.now();
        dt = now - last;
        var ticks = Math.floor(dt / game.tickDuration);

        if (ticks > 1000 && heuristic) {
            game.heuristic(ticks - 1000);
            ticks = 1000;
        }

        var i = ticks;
        while (i > 0) {
            if (ticks > 1) {
                game.cycleNoGraphic();
            } else {
                game.cycle();
            }
            i--;
        }
        last = now - dt % game.tickDuration;
        requestAnimationFrame(cycle);
    }
    requestAnimationFrame(cycle);

    setInterval(function () {
        game.save();
    }, 10000);

    setInterval(function () {
        $(document).prop('title', "Snake Idle: " + numberformat.format(game.fruits, { format: notation }));
    }, 1000);

    var fruitValues = [];
    setInterval(function () {
        if (fruitValues.length < 10) {
            fruitValues.push(game.fruits);
        } else {
            fruitValues.splice(0, 1);
            fruitValues.push(game.fruits);
        }
        var sum = 0;
        var counter = 0;
        for (var i = 0; i < fruitValues.length - 1; i++) {
            var delta = fruitValues[i + 1] - fruitValues[i];
            if (delta > 0) {
                sum += delta;
                counter++;
            }
        }
        var average = sum / counter;
        $("#fruitSec").html(numberformat.format(average, { format: notation }) + " fruits/sec");
    }, 1000);
});