var directions = { upLeft: 0, upRight: 1, downLeft: 2, downRight: 3};
var playerOne, playerAI, table, ball, scorePlayerOne, scorePlayerAI, playerOneScore, playerAIScore,
    separator, interval, intervalId;

const keys = {
  up: false,
  down: false,
  w: false,
  s: false
}

$( document ).ready(function() {
  getElements();
  setInitialPositionsAndData();
});

function getElements() {
  playerOne = $('#playerOne');
  playerAI = $('#playerAI');
  table = $('#pongTable');
  ball = $('#ball');
  scorePlayerOne = $('#scorePlayerOne');
  scorePlayerAI = $('#scorePlayerAI');
  separator = $('#separator');
}

function setInitialPositionsAndData() {
  playerOne.css('top', ((table.height() - playerOne.height()) / 2));
  playerAI.css('top', ((table.height() - playerOne.height()) / 2));
  separator.css('left', ((table.width() - separator.width()) / 2));
  playerOneScore = 0;
  playerAIScore = 0;
  setInitialBall();
  startInterval(interval);
}

function setInitialBall() {
  ballDirection  = Math.floor((Math.random() * 4));
  ball.css('top', ((table.height() - ball.height()) / 2));
  ball.css('left', ((table.width() - ball.width()) / 2));
  interval = 8;
}

$(document).keydown(function(e) {
  switch(e.which) {
    case 38:
      keys.up = true;
      break;
          
    case 40:
      keys.down = true;
      break;
    case 87:
      keys.w = true;
      break;
    case 83:
      keys.s = true;
      break;
    }
});

$(document).keyup(function(e) {
  switch(e.which) {
    case 38:
      keys.up = false;
      break;
    case 40:
      keys.down = false;
      break;
    case 87:
      keys.w = false;
      break;
    case 83:
      keys.s = false;
      break;
    }
});

function keysController() {
  var topPlayerOne = playerOne.position().top;
  var topPlayerAI = playerAI.position().top;

  if (keys.up) {
    if ((topPlayerAI - 20) >= 0) {
      topPlayerAI = (topPlayerAI - 20);
      playerAI.css('top', topPlayerAI);
    }
    else {
      playerAI.css('top', 0);
    }
  }

  if (keys.down) {
    if ((topPlayerAI + 20) <= (table.height() - playerAI.height())) {
      topPlayerAI = (topPlayerAI + 20);
      playerAI.css('top', topPlayerAI);
    }
    else {
      playerAI.css('top', table.height() - playerAI.height());
    }
  }

  if (keys.w) {
    if ((topPlayerOne - 20) >= 0) {
      topPlayerOne = (topPlayerOne - 20);
      playerOne.css('top', topPlayerOne);
    }
    else {
      playerOne.css('top', 0);
    }
  }

  if (keys.s) {
    if ((topPlayerOne + 20) <= (table.height() - playerOne.height())) {
      topPlayerOne = (topPlayerOne + 20);
      playerOne.css('top', topPlayerOne);
    }
    else {
      playerOne.css('top', table.height() - playerOne.height());
    }
  }
}

setInterval(keysController, 50)

function startInterval(_interval) {
  intervalId = setInterval(function() {
    switch(ballDirection) {
      case directions.upLeft:
        if (!hitBorder())
          toUpLeft();
        break;
      case directions.upRight:
        if (!hitBorder())
          toUpRight();
        break;
      case directions.downLeft:
        if (!hitBorder())
          toDownLeft();
        break;
      case directions.downRight:
        if (!hitBorder())
          toDownRight();
        break;
    }
  }, _interval);
}

function toUpLeft() {
  ball.css('top', ball.position().top - 2);
  ball.css('left', ball.position().left - 2);
}

function toUpRight() {
  ball.css('top', ball.position().top - 2);
  ball.css('left', ball.position().left + 2);
}

function toDownLeft() {
  ball.css('top', ball.position().top + 2);
  ball.css('left', ball.position().left - 2);
}

function toDownRight() {
  ball.css('top', ball.position().top + 2);
  ball.css('left', ball.position().left + 2);
}

function hitBorder()  {

  switch(ballDirection) {
    case directions.upLeft:
      if (ball.position().top == 0) {
        toDownLeft();
        ballDirection = directions.downLeft;
        return true;
      }
      else if (ball.position().left == 0) {
        if (!defendedLeft()) {
          scorePlayerAI.text(++playerAIScore);
          speedDown();
          setInitialBall();
        }
        else {
          toUpRight();
          ballDirection = directions.upRight;
          speedUp();
        }
        return true;
      }
      else
        return false;

    case directions.upRight:
      if (ball.position().top == 0) {
        toDownRight();
        ballDirection = directions.downRight;
        return true;
      }
      else if (ball.position().left == Math.floor(table.width() - ball.width())) {
        if (!defendedRight()) {
          scorePlayerOne.text(++playerOneScore);
          speedDown();
          setInitialBall();
        }
        else {
          toUpLeft();
          ballDirection = directions.upLeft;
          speedUp();
        }
        return true;
      }
      else
        return false;

    case directions.downLeft:
      if (Math.floor(ball.position().top) == table.height() - ball.height()) {
        toUpLeft();
        ballDirection = directions.upLeft;
        return true;
      }
      else if (ball.position().left == 0) {
        if (!defendedLeft()) {
          scorePlayerAI.text(++playerAIScore)
          speedDown();
          setInitialBall();
        }
        else {
          toDownRight();
          ballDirection = directions.downRight;
          speedUp();
        }
        return true;
      }
      else
        return false;

    case directions.downRight:
      if (Math.floor(ball.position().top) == table.height() - ball.height()) {
        toUpRight();
        ballDirection = directions.upRight;
        return true;
      }
      else if (ball.position().left == table.width() - ball.width()) {
        if (!defendedRight()) {
          scorePlayerOne.text(++playerOneScore);
          speedDown();
          setInitialBall();
        }
        else {
          toDownLeft();
          ballDirection = directions.downLeft;
          speedUp();
        }
        return true;
      }
      else
        return false;
  }
}

function defendedLeft() {
    return ((Math.floor(ball.position().top) >= Math.floor(playerOne.position().top)) &&
        (Math.floor(ball.position().top) <= Math.floor(playerOne.position().top + playerOne.height())));
}

function defendedRight() {
    return ((Math.floor(ball.position().top) >= Math.floor(playerAI.position().top)) &&
        (Math.floor(ball.position().top) <= Math.floor(playerAI.position().top + playerAI.height())));
}

function speedUp() {
  clearInterval(intervalId);
  startInterval(--interval);
}

function speedDown() {
  clearInterval(intervalId);
  interval = 8;
  setTimeout(function(){ startInterval(interval); }, 150);
}
