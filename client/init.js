//start slingin' some d3 here.
var players = [];
players.push(new Player(gameOptions));
players[players.length - 1].render(gameBoard);
//players.push(new Player(gameOptions).render(gameBoard));

var play = () => {
  var gameTurn = () => {
    render(createEnemies());
  };
  
  gameTurn();

  setInterval(gameTurn, 2000);

  setInterval(increaseScore, 50);

};

play();