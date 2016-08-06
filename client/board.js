var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0, 100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0, 100]).range([0, gameOptions.height]),
};

var gameBoard = d3.select('.container')
  .append('svg:svg')
  .attr('width', gameOptions.width + 'px')
  .attr('height', gameOptions.height + 'px')
;

var increaseScore = () => {
  gameStats.score++;
  updateScore();
  gameStats.score > gameStats.bestScore && updateBestScore();
};
var updateScore = () => {
  d3.select('#currentScore').select('span').text(() => gameStats.score.toString());
};

var updateBestScore = () => {
  gameStats.bestScore = gameStats.score;
  d3.select('#highScore').select('span').text(() => gameStats.bestScore.toString());
};

var createEnemies = () =>
  _.range(0, gameOptions.nEnemies).map (i => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

var render = enemyData => {
  var enemies = gameBoard.selectAll('circle.enemy')
    .data(enemyData, d => d.id)
  ;
  enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', enemy => axes.x(enemy.x))
    .attr('cy', enemy => axes.y(enemy.y))
    .attr('r', 0);

  enemies.exit()
    .remove();

  var checkCollision = function (enemy, collidedCallback) {
    _(players).each(player => {
      radiusSum = parseFloat(enemy.attr('r')) + player.r;
      xDiff = parseFloat(enemy.attr('cx')) - player.x;
      yDiff = parseFloat(enemy.attr('cy')) - player.y;

      separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );
      separation < radiusSum && collidedCallback(player, enemy);
    });
  };

  var onCollision = () => {
    gameStats.score = 0;
    updateScore();
  };

  var tweenWithCollisionDetection = function(endData) {
    var enemy = d3.select(this);
    var startPos = {
      x: parseFloat(enemy.attr('cx')),
      y: parseFloat(enemy.attr('cy'))
    };

    var endPos = {
      x: axes.x(endData.x),
      y: axes.y(endData.y)
    };

    return t => {
      checkCollision(enemy, onCollision);
      enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t
      };

      enemy.attr('cx', enemyNextPos.x)
        .attr('cy', enemyNextPos.y);
    };
  };
  enemies
    .transition()
    .duration(500)
    .attr('r', 10)
    .transition()
    .duration(2000)
    .tween('custom', tweenWithCollisionDetection);
};