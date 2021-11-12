import Text from './Text.js';

class Score extends Text {
  constructor(x, y, score = 0) {
    super(`Score: ${score}`, x, y, 'left', '16px Arial');
    this.val = score;
  }

  increment(inc) {
    this.val += inc;
    this.updateText();
  }

  updateText() {
    this.text = `Score: ${this.val}`;
  }
}

export default Score;
