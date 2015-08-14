// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)

var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var gapSize = 150;
var gapMargin = 50;
var blockHeight = 50;
var pipeEndExtraWidth = 50;
var pipeEndHeight = 25;

/*
 * Loads all resources for the game and gives them names.
 */
var score = 0;
var player;
var labelScore;
var pipes = [];

var starHeight = 10;
var greeting = { language: "English", first: "Hello", last: "Goodbye"};
var balloons = [];
var weights = [];
var splashDisplay;
var stars = [];



jQuery("#greeting-form").on("submit", function(event_details){
    var greeting = "Hello ";
    var name = jQuery("#fullName").val() + "(" + jQuery("#email").val() + ")" + jQuery("#score").val() + "</p>";
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");

    $.ajax({url : '/score', type : 'post', data : $("#greeting-form").serialize()});

    event_details.preventDefault();
});
function preload() {
    game.load.image("playerImg", "../assets/flappy_superman.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe", "../assets/pipe_red.png");
    game.load.image("pipeEnd", "../assets/red-pipe-end.png");
    game.load.image("balloons", "../assets/balloons.png");
    game.load.image("weights", "../assets/weight.png");
    game.load.image("star", "../assets/star.png");
    game.load.image("easy", "../assets/easy.png");
    game.load.image("normal", "../assets/normal.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {

    player = game.add.sprite(100, 200, "playerImg");
    game.physics.arcade.enable(player);
    game.stage.setBackgroundColor("#2EB8E6");
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
    splashDisplay = game.add.text(100,200, "Press ENTER to start, SPACEBAR to jump");



}

function start() {
    splashDisplay.destroy();
    console.log(balloons.length);
    player.body.gravity.y = 200;
    player.body.velocity.x = 0;
    player.body.velocity.y = -200;
    player.body.gravity.y = 380;

    player.anchor.setTo(0.5, 0.5);

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(function (){
        player.body.velocity.y = - jumpPower;
        });


    // set the background colour of the scene
    // game.add.text(20, 20, "Welcome to our game!",
    // {font: "30px Georgia", fill: "#000066"});





    labelScore = game.add.text (20, 20, "0");


    // game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    //.onDown.add(moveRight);
    // game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    //.onDown.add(moveLeft);
    // game.input.keyboard.addKey(Phaser.Keyboard.UP)
    //.onDown.add(moveUp);
    // game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    //.onDown.add(moveDown);
    generate();

        pipeInterval = 2;
        game.time.events
            .loop(pipeInterval * Phaser.Timer.SECOND,
            generate);




    game.physics.startSystem(Phaser.Physics.ARCADE);
if(isEmpty(fullName)) {
    response.send("Please make sure you enter your name.");

}
}




/*
 * This function updates the scene. It is called for every new frame.
 */


function update() {


    game.physics.arcade.overlap(player, pipes, gameOver);
    console.log(player);
    if (player.y < 0 || player.y > 400) {
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / 400);

    //Check if the player gets a bonus
    checkBonus(balloons, -15);
    checkBonus(weights, 50);
for(var i=stars.length - 1; i>=0; i--){
    game.physics.arcade.overlap(player,stars[i], function(){
        stars[i].destroy();
        stars.splice(i,1);
        changeScore();
        game.sound.play("score");
    });
}

}

function checkBonus(bonusArray, bonusEffect){
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,bonusArray[i], function(){
            changeGravity(bonusEffect);
            bonusArray[i].destroy();
            bonusArray.splice(i,1);
            changeGravity(bonusEffect);
        });
    }
}
function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}

function addPipeEnd(x, y) {
    var pipeEnd = game.add.sprite(x, y, "pipeEnd");
    pipes.push(pipeEnd);
    game.physics.arcade.enable(pipeEnd);
    pipeEnd.body.velocity.x = -200;
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1,10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeights();
    } else {
        generatePipe();
    }
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(50, height - 50 - gapSize);

    addPipeEnd(width + 20 - (pipeEndExtraWidth / 2), gapStart - pipeEndHeight);
    for (var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
        addPipeBlock(width, y - blockHeight);
    }
    addStar(width, gapStart + (gapSize / 2) - (starHeight / 2));

    addPipeEnd(width + 20 - (pipeEndExtraWidth / 2), gapStart + gapSize);
    for (var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }

}


function generateBalloons() {
        var bonus = game.add.sprite(width, height, "balloons");
        balloons.push(bonus);
        game.physics.arcade.enable(bonus);
        bonus.body.velocity.x = - 200;
        bonus.body.velocity.y = - game.rnd.integerInRange(60,100);

    }

function generateWeights() {
        var bonus = game.add.sprite( width,0, "weights");
        weights.push(bonus);
        game.physics.arcade.enable(bonus);
        bonus.body.velocity.x = - 250;
        bonus.body.velocity.y = game.rnd.integerInRange(60,100);
    }

function changeGravity(g) {
    gameGravity +=g;
    player.body.gravity.y = gameGravity;
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());

}

function gameOver() {
    game.destroy();
    $("#score").val(score.toString());

    $("#greeting").show();
    gameGravity = 200;
}
















    //game.physics.arcade
        //.overlap(player,
      //  weights,
       // changeGravity(+50));

       // game.physics.arcade
         //   .overlap(player,
           // balloons,
          //  changeGravity(-50));

$.get("/score", function(scores) {
     scores.sort(function (scoreA, scoreB){
         var difference = scoreB.score - scoreA.score;
         return difference;
     });

         //for (var i = 0; i < scores.length; i++) {
     for (var i = 0; i < 5; i++) {
            $("#scoreBoard").append(
                 "<li>" +
                 scores[i].name + ": " + scores[i].score +
                 "</li>");
        // if(score < 0){
          //   labelScore = "0"}
         }

 });

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function addStar(x,y) {
    var star = game.add.sprite(x, y, "star");
    stars.push(star);
    game.physics.arcade.enable(star);
    star.body.velocity.x = - gameSpeed;
}

function setMode(mode) {
    pipeInterval = mode.pipeInterval;
    gameSpeed = mode.gameSpeed;
    gameGravity = mode.gameGravity;
    gapSize = mode.gapSize;
}
