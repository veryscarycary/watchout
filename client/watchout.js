// start slingin' some d3 here.

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

var gameBoard = d3.select('.container').append('svg:svg')
  .attr('width', gameOptions.width)
  .attr('height', gameOptions.height);

var updateScore = () => {
  d3.select('#current-score').text(gameStats.score.toString());
};

var updateBestScore = () => {
  gameStats.bestScore = _.max([gameStats.bestScore, gameStats.score]);
  d3.select('#best-score').text(gameStats.bestScore.toString());
};

var Player = class Player {
  constructor(gameOptions) {
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.fill = 'ff6600';
    this.x = 0;
    this.y = 0;
    this.angle = 0;
    this.r = 5;
    this.gameOptions = gameOptions;
    this.el = null;
  }
  render (to) {
    this.el = to.append('svg.path').attr('d', this.path).attr('fill', this.fill);
    this.transform (this.gameoptions.width * 0.5, this.gameOptions.height * 0.5); 
    this.setupDragging();
  }
  getX () {
    return this.x;
  }
  setX (x) {
    if (x === undefined) { return; }
    let minX = this.gameOptions.padding;
    let maxX = this.gameOptions.width - this.gameOptions.padding;
    this.x = x < minX ? minX : x > maxX ? maxX : x;
  }
  getY () {
    return this.y;
  }
  setY (y) {
    if (y === undefined) { return; }
    let minY = this.gameOptions.padding;
    let maxY = this.gameOptions.width - this.gameOptions.padding;
    this.y = y < minY ? minY : y > maxY ? maxY : y;
  }
  transform (opts) {
    this.angle = opts.angle || this.angle;
    this.setX(opts.x);
    this.setY(opts.y);
    this.attr('transform', 'rotate(#{@angle},#{@getX()},#{@getY()}) ' +
      'translate(#{@getX()},#{@getY()})');
  }

  moveAbsolute (x, y) {
    transform({x: x, y: y});
  }

  moveRelative (dx, dy) {
    transform({x: this.getX() + dx, y: this.getY() + dy, angle: 360 * (Math.atan2(dy, dx) / (Math.PI * 2))});  
  }

  setupDragging () {
    // var dragMove = () =>
    //   { this.moveRelative(d3.event.dx, d3.event.dy) };

    //   var drag = d3.behavior.drag().on('drag', dragMove);

      //COME BACK TO THIS
  }
};

players = [];
players.push(new Player(gameOptions).render(gameBoard));
//players.push(new Player(gameOptions).render(gameBoard));

var createEnemies = () =>
  _.range(0, gameOptions.nEnemies).map (i => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

var render = (enemy_data) => {
  var enemies = gameBoard.selectAll('circle.enemy')
    .data(enemy_data, (d) => d.id);

    enemies.enter()
      .append('svg:circle')
      .attr('class', 'enemy')
      .attr('cx', (enemy) -> axes.x(enemy.x))
      .attr('cy', (enemy) -> axes.y(enemy.y))
      .attr('r', 0)
};
