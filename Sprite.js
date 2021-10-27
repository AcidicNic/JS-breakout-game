class Sprite {
  constructor(x = 0, y = 0, width = 10, height = 10, color = '#3B3B3B') {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

export { Sprite };
