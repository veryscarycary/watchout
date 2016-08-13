var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 40,
  padding: 20
};

var gameStats = {
  score: 0,
  bestScore: 0,
  collisions: 0
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
  var enemies = gameBoard.selectAll('image.enemy')//circle.enemy')
    .data(enemyData, d => d.id)
  ;
  enemies.enter()
    .append('svg:image')
    .attr('class', 'enemy')
    .attr('x', enemy => axes.x(enemy.x))
    .attr('y', enemy => axes.y(enemy.y))
    .attr('r', 0) 
    .attr('colliding', 'false')
    .attr('width', 20)
    .attr('height', 20)
    .attr('xlink:href', 'shuriken.png');
  // USE THIS FOR CIRCLE ENEMIES 
  // enemies.enter()
    // .append('svg:circle')
    // .attr('class', 'enemy')
    // .attr('cx', enemy => axes.x(enemy.x))
    // .attr('cy', enemy => axes.y(enemy.y))
    // .attr('r', 0)
    // .attr('colliding', 'false');

  enemies.exit()
    .remove();

  var checkCollision = function (enemy, collidedCallback) {
    _(players).each(player => {
      radiusSum = parseFloat(enemy.attr('r')) + player.r;
      xDiff = parseFloat(enemy.attr('x')) - player.x;
      yDiff = parseFloat(enemy.attr('y')) - player.y;
    //USE THIS FOR CIRCLE ENEMIES
    // _(players).each(player => {
    //   radiusSum = parseFloat(enemy.attr('r')) + player.r;
    //   xDiff = parseFloat(enemy.attr('cx')) - player.x;
    //   yDiff = parseFloat(enemy.attr('cy')) - player.y;
      separation = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );
      var colliding = JSON.parse(enemy.attr('colliding')); 
      if (separation < radiusSum && !colliding) {
        enemy.attr('colliding', 'true');
        collidedCallback(player, enemy);
        // d3.select('svg')
        //   .transition()
        //   .duration(30)
        //   .style('background', 'white');
        d3.select('svg')
          .transition()
          .duration(40)
          .style('background', 'hsla(0, 100%, 43%, 0.8)');
      } else if (separation >= radiusSum) {
        enemy.attr('colliding', 'false');
        d3.select('svg')
          .style('background', 'linear-gradient(teal, yellow)');
      }
    });
  };

  var onCollision = (player, enemy) => {
    gameStats.score = 0;
    gameStats.collisions++;
    updateScore();
    d3.select('#collisions').select('span').text(() => gameStats.collisions.toString());
  };

  var tweenWithCollisionDetection = function(endData) {
    var enemy = d3.select(this);
    var startPos = {
      x: parseFloat(enemy.attr('x')),
      y: parseFloat(enemy.attr('y'))
    };
    //USE THIS FOR CIRCLE ENEMIES
    // var startPos = {
    //   x: parseFloat(enemy.attr('cx')),
    //   y: parseFloat(enemy.attr('cy'))
    // };
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

      enemy.attr('x', enemyNextPos.x)
        .attr('y', enemyNextPos.y);
      //USE THIS FOR CIRCLE ENEMIES
      // enemy.attr('cx', enemyNextPos.x)
      //   .attr('cy', enemyNextPos.y);
    };
  };
  enemies
    .transition()
    .duration(turnLength / 2)
    .attr('r', 10)
    .transition()
    .duration(1500)
    .tween('custom', tweenWithCollisionDetection);
};