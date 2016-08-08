//start slingin' some d3 here.
var players = [];
players.push(new Player(gameOptions));
players[players.length - 1].render(gameBoard);
//players.push(new Player(gameOptions).render(gameBoard));

var turnLength = 2500;

var play = () => {
  var gameTurn = () => {
    render(createEnemies());
  };
  
  gameTurn();

  setInterval(gameTurn, turnLength);

  setInterval(increaseScore, 50);

};

play();