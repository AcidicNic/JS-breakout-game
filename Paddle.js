import Sprite from './Sprite.js';

class Paddle extends Sprite {
  constructor(x, y, width = 75, height = 10, color = '#3B3B3B') {
    super(x, y, width, height, color);
  }
}

export default Paddle;
