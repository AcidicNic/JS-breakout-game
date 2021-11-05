import Paddle from './Paddle.js';
import Bricks from './Bricks.js';
import Ball from './Ball.js';
import Text from './Text.js';
import Score from './Score.js';
import Lives from './Lives.js';

class BrickGame {
  constructor(
    canvasId = 'brickGame',
    lives = 2,
    backgroundColors = ['#FFCCCC', '#FEFFBF', '#C0FFBF', '#BFFDFF', '#E4BFFF'],

  ) {
    this.canvas = document.getElementById(canvasId);
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this.ctx = this.canvas.getContext('2d');
    this._updateBgGradiant(backgroundColors);

    // TODO: move this math out of here and into the classes
    this.ball = new Ball(this.width / 2, this.height * .8);
    this.paddle = new Paddle((this.width - 75) / 2, this.height - 10);
    this.bricks = new Bricks();

    // Text
    this.score = new Score(8, 20, 0);
    this.lives = new Lives(this.width - 8, 20, lives);
    this.endText = new Text(
      'Game Over!', this.width / 2, this.height / 2, 'center', '24px Arial',
    );
    this.helpText = new Text(
      'Press space or enter to restart', this.width / 2, this.height / 2 + 20,
    );
    this.gameOver = false;

    // Controls
    this.rightPressed = false;
    this.leftPressed = false;

    document.addEventListener('keydown', (e) => { this._keyDownHandler(e) }, false);
    document.addEventListener('keyup', (e) => { this._keyUpHandler(e) }, false);
    document.addEventListener('mousemove', (e) => { this._mouseMoveHandler(e) }, false);
  }

  _keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  _keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  _mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.width) {
      this.paddle.x = relativeX - this.paddle.w / 2;
    }
  }

  movePaddle() {
    if (this.rightPressed) {
      this.paddle.x += 7;
      if (this.paddle.x + this.paddle.w > this.width) {
        this.paddle.x = this.width - this.paddle.w;
      }
    } else if (this.leftPressed) {
      this.paddle.x -= 7;
      if (this.paddle.x < 0) {
        this.paddle.x = 0;
      }
    }
  }

  _brickCollisionCheck() {
    this.bricks.bricks.forEach( row =>
      row.forEach( b => {
        if (b.status === true) {
          if (this.ball.x + this.ball.r > b.x
            && this.ball.x - this.ball.r < b.x + this.bricks.w
            && this.ball.y + this.ball.r > b.y
            && this.ball.y - this.ball.r < b.y + this.bricks.h
          ) {
            this.ball.dy = -this.ball.dy;
            b.status = false;
            this.score.increment(1);
            if (this.score.val === this.bricks.r * this.bricks.c) {
              this.endText.text = 'You win!';
            }
          }
        }
      })
    );
  }

  _wallCollisionCheck() {
    if (
      this.ball.x + this.ball.dx > this.width - this.ball.r ||
      this.ball.x + this.ball.dx < this.ball.r
    ) {
      this.ball.dx = -this.ball.dx;
      this.ball.randomSlope();
    } else if (this.ball.y + this.ball.dy < this.ball.r) {
      this.ball.dy = -this.ball.dy;
      this.ball.randomSlope();
    } else if (this.ball.y + this.ball.dy > this.height - this.ball.r) {
      this.lives.increment(-1);
      this.ball.x = this.width / 2;
      this.ball.y = this.height - 30;
      this.ball.speed = 3;
      this.ball.randomSlope();
      this.ball.dx = 3 * (Math.floor(Math.random() * 2) || -1);
      this.ball.dy = -3;
      this.paddle.x = (this.width - this.paddle.w) / 2;
    }
  }

  _paddleCollisionCheck() {
    if (this.ball.y > this.height - this.ball.r - this.paddle.h) {
      if (
        this.ball.x > this.paddle.x &&
        this.ball.x < this.paddle.x + this.paddle.w
      ) {
        this.ball.incrementSpeed();
        this.ball.dy = -this.ball.dy;
        this.ball.randomSlope();
      }
    }
  }

  _updateBgGradiant(colors) {
    this.bgGradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    for (let i = 0; i < colors.length; i += 1) {
      this.bgGradient.addColorStop((i + 1) / colors.length, colors[i]);
    }
  }

  renderBackground() {
    this.ctx.fillStyle = this.bgGradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  _keyDownEndHandler(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      this.helpText.text = 'Restarting...';
      this.helpText.render(this.ctx);
    }
  }

  _keyUpEndHandler(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      document.location.reload();
    }
  }

  _addEndEventListeners() {
    document.addEventListener('keydown', (e) => { this._keyDownEndHandler(e) }, false);
    document.addEventListener('keyup', (e) => { this._keyUpEndHandler(e) }, false);
  }

  renderEndScreen() {
    this.bricks.render(this.ctx);
    this.score.render(this.ctx);
    this.lives.render(this.ctx);
    this.endText.render(this.ctx);
    this.helpText.render(this.ctx);
  }

  isWin() {
    return this.score.val === this.bricks.r * this.bricks.c;
  }

  isLose() {
    return this.lives.val <= 0;
  }

  start() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.renderBackground();

    if (this.isLose() || this.isWin()) {
      this.renderEndScreen();
      if (!this.gameOver) {
        this._addEndEventListeners();
        this.gameOver = true;
      }
    } else {
      this._brickCollisionCheck();
      this._paddleCollisionCheck();
      this._wallCollisionCheck();
      this.movePaddle();

      this.ball.render(this.ctx);
      this.paddle.render(this.ctx);
      this.bricks.render(this.ctx);
      this.score.render(this.ctx);
      this.lives.render(this.ctx);

      this.ball.move();
    }
    requestAnimationFrame(() => { this.start() });
  }
}

export default BrickGame;

// *~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~* //

// function randomBallColor() {
//   ballColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }
