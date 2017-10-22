function generateWinningNumber() {
    return Math.floor(Math.random()*100)+1;
}

function shuffle(arr) {
    var l = arr.length;

    while(l) {
        i = Math.floor(Math.random()*l);
        l--;

        s = arr[i];
        u = arr[l];
        arr[i] = u;
        arr[l] = s;

    }

    return arr;
}


function Game() {
    this.playersGuess = null,
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber-this.playersGuess);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || typeof num !== 'number') {
        throw "That is an invalid guess.";
    }
    this.playersGuess = num;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if (this.winningNumber === this.playersGuess) {
        $('#subtitle').text('Hit reset to play again!');
        $('#hint, #submit').prop("disabled",true);   
        return 'WooHoo! You Won!';
    }  else if (this.pastGuesses.indexOf(this.playersGuess) >= 0) {
        return 'You\'ve already tried that! Guess again!';
    } else {
        $('#guess-list').find('li').eq(this.pastGuesses.length).text(this.playersGuess);
        this.pastGuesses.push(this.playersGuess);
    }
    if (this.pastGuesses.length >= 5) {
        $('#subtitle').text('Hit reset to try again!');
        $('#hint, #submit').prop("disabled",true);     
        return 'Sorry, looks like you lost.';
    } 

        var diff = this.difference();
        if (this.isLower()) {
            $('#subtitle').text('Guess higher!');
        } else {
            $('#subtitle').text('Guess lower!');
        }
        if (diff < 10) {
            return 'You\'re burning up!';
        } else if (diff < 25) {
            return 'You\'re lukewarm.';
        } else if (diff < 50) {
            return 'You\'re a bit chilly.';
        } else {
            return 'You\'re ice cold!';
        }

}

function newGame () {
     return new Game();
}

Game.prototype.provideHint = function() {
    var hintArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    shuffle(hintArr);
    return hintArr[0] + ', ' + hintArr[1] + ', or ' + hintArr[2];
}



function makeAGuess(game) {
    var guess = +$('#player-input').val();
    $('#title').text(game.playersGuessSubmission(guess));
    $('#player-input').val('');
}


$(document).ready(function(){
    var title = $('#title').text();
    var subtitle = $('#subtitle').text();
    var guessHolder = $('.guess').first().text();

    var newGameInst = new Game();

    $('#submit').click(function() {
        makeAGuess(newGameInst);
    })

    $('#player-input').keypress(function(event) {
        if(event.which === 13) {
            makeAGuess(newGameInst);
        }
    })

    $('#hint').click(function() {
        $('#title').text('Which could it be: ' + newGameInst.provideHint() + '?');
    })

    $('#reset').click(function() {

        newGameInst = new Game();

        $('#title').text(title);
        $('#subtitle').text(subtitle);
        $('.guess').text(guessHolder);

        $('#hint, #submit').prop("disabled",false);

        $('#player-input').focus();

    })


  })

