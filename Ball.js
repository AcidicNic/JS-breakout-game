import { Sprite } from './Sprite.js';

class Ball extends Sprite {
  constructor(x = 0, y = 0, radius = 7, speed = 3.5, color = '#3B3B3B') {
    super(x, y, 0, 0, color);
    this.r = radius;
    this.speed = speed;
    this.dx = speed * (Math.floor(Math.random() * 2) || -1);
    this.dy = speed * (Math.floor(Math.random() * 2) || -1);
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  incrementSpeed() {
    if (this.speed < 7) {
      this.speed += .25;
    }
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  randomSlope() {
    this.dy = (this.speed + ((Math.random() - 0.5) / 2)) * Math.sign(this.dy);
    this.dx = (this.speed + ((Math.random() - 0.5) / 2)) * Math.sign(this.dx);
  }
}

export { Ball };
