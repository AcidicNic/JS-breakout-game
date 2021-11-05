import Text from './Text.js';

class Lives extends Text {
  constructor(x, y, lives) {
    super(`Lives: ${lives}`, x, y, 'right', '16px Arial');
    this.val = lives;
  }

  increment(inc) {
    this.val += inc;
    this.updateText();
  }

  updateText() {
    this.text = `Lives: ${this.val}`;
  }
}

export default Lives;
