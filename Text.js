import { Sprite } from './Sprite.js';

class Text extends Sprite {
  constructor(text, x, y, font = '16px Arial', align = 'left', color = '#3B3B3B') {
    super(x, y, 0, 0, color);
    this.font = font;
    this.align = align;
    this.text = text;
  }

  render(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.fillText(this.text, this.x, this.y);
  }
}

export { Text };
