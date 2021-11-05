import Sprite from './Sprite.js';

class Brick extends Sprite {
  constructor(x, y, width = 60, height = 20, color = '#000') {
    super(x, y, width, height, color);
    this.status = true;
  }
}

export default Brick;
