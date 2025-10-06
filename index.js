// **** initialisations ****
var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPatthern = [];
var level = 0;
var result;
var move;
// **** end of initialisations ****

// **** button events ****
// initial Play! button
$(".play").on("click", function () {
    $(".instructions").slideUp(); // hide the instructions
    $(".container").css("display", "grid"); // deploy the grid of 4 coloured squares
    $(".buttons").removeClass("hidden"); // present the side buttons that contain instructions and start again
    gameStarting(); // events that prepare the beginning of the game
}); 

// for each square clicked during the game
$(".square").on("click", function () {
    var userChosenColour = this.id;
    userClickedPatthern.push(userChosenColour);
    pressed(this.id); // get the square that got clicked, insert it in the player's moves and add the effects
    result = checkAnswer(move); // check each move from the player
    if (!result) {
        gameOver(); // for any wrong move
    } else if (move !== (level - 1)) {
        move++; // for any right move, but has not completed the sequence
    } else {
        setTimeout(function () {
            nextSequence();
        },1000); // after each whole correct sequence, 1 sec after player's last move
    }
});

// bring up the instructions again
$(".instr").on("click", function () {
    $(".instructions").slideDown();
    $(".container").slideUp();
    $(".buttons").addClass("hidden");
    setTimeout(function() {
        $(".container").css("display", "none");
    }, 400);
    $("h1").text("The Simon Game");
});

// start the game from the beginning, regardless whether a game is already under way, or if the player has lost
$(".replay").on("click", function () {
    $("h1").text("The Simon Game");
    gameStarting();
})
// **** end of button events ****

// **** functions ****
function gameStarting() {
    $("#clickblocker").show(); // an overlay to prevent the player of clicking any buttons or squares
    gamePattern = [];
    userClickedPatthern = [];
    level = 0; //resetting the sequences of the game and player, resetting the current level
    var audio = new Audio('./sounds/countdown.mp3'); // sound effect fot the countdown
    setTimeout(function () {
        audio.play();
    }, 900); //this delay is because of the gap of the sound file at the beginning
    setTimeout(function () {
        countdownTimer(0);
    }, 1000);
    setTimeout(function () {
        countdownTimer(1);
    }, 2000);
    setTimeout(function () {
        countdownTimer(2);
    }, 3000); // the countdown for 3, 2, 1 in corresponding seconds
    setTimeout(function () {
        nextSequence();
    },4000); // 1 second delay after the countdown, so the first selected square is clearly indicated
    setTimeout(function () {
        $("#clickblocker").hide();
    }, 4000); // removal of the overlay
}

// each p element inside the countdown appears and fadeouts. Afterwards, reverting to original state
// so they can reappear on the start of the next game
function countdownTimer (i) {
    $("#countdown p:nth(" + i + ")").removeClass("hidden");
    $("#countdown p:nth(" + i + ")").fadeOut(800);
    setTimeout(function () {
        $("#countdown p:nth(" + i + ")").removeAttr("style");
        $("#countdown p:nth(" + i + ")").addClass("hidden");
    },900);
}

// each sqaure that is either clicked by the player or selected by the game, has an animation effect
// via css for .15 seconds (a flash) plus a corresponding sound
function pressed(sq) {
    $("#"+sq).addClass("pressed");
    setTimeout(function () {
        $("#"+sq).removeClass("pressed");
    }, 150);
    var audio = new Audio('./sounds/'+sq+'.mp3');
    audio.play();
}

function nextSequence() {
    level++;
    $("h1").text("Level " + level); // increase the level and update the h1
    userClickedPatthern.length = 0;
    move = 0; // reset the players clicks and number of moves
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    pressed(randomChosenColour); // random square selected, inserted in the game sequence and having the effects applied
}

function checkAnswer(move) {
    var isEqual = true;
    if (gamePattern[move] !== userClickedPatthern[move]) {
        isEqual = false;
    }
    return isEqual; // checking current player's move
}

// when the player loses, a red flash on the body element, a corresponding sound and updating the h1
function gameOver() {
    $("body").addClass("game-over");
    $("h1").text("Wrong Move! Game Over after " + (level - 1) + " levels");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 150);
    var audio = new Audio('./sounds/wrong.mp3');
    audio.play();
}
// **** end of functions ****