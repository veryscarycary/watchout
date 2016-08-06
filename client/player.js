var Player = class Player {
  constructor(gameOptions) {
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
    this.fill = '#0000ff';
    this.x = 200;
    this.y = 200;
    this.angle = 0;
    this.r = 20;
    this.gameOptions = gameOptions;
    this.el = null;
  }
  render (to) {
    this.el = to.append('svg:path').attr('d', this.path).attr('fill', this.fill).attr('r', this.r);
    this.transform (this.gameOptions.width * 0.5, this.gameOptions.height * 0.5); 
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
    this.el.attr('cx', '100');
    this.el.attr('cy', '100');
    this.el.attr('transform', d => 'translate(' + this.x + ',' + this.y + ')rotate(' + this.angle + ')');

      // rotate(' + this.angle + ,#{@getX()},#{@getY()}) ' +
      // 'translate(#{@getX()},#{@getY()})');
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