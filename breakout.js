import { Sprite } from './Sprite.js';
import { Brick } from './Brick.js';
import { Ball } from './Ball.js';
import { Text } from './Text.js';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const rainbow = ctx.createLinearGradient(0, 0, canvas.width, 0);
rainbow.addColorStop(0, '#FFCCCC');
rainbow.addColorStop(0.2, '#FEFFBF');
rainbow.addColorStop(0.5, '#C0FFBF');
rainbow.addColorStop(0.8, '#BFFDFF');
rainbow.addColorStop(1, '#E4BFFF');

let score = 0;
let lives = 2;

const endText = new Text(
  'Game Over!',
  canvas.width / 2,
  canvas.height / 2,
  '24px Arial',
  'center',
  '#3B3B3B',
);

const helpText = new Text(
  'Press space or enter to restart',
  canvas.width / 2,
  canvas.height / 2 + 20,
  '16px Arial',
  'center',
  '#3B3B3B',
);

const scoreText = new Text(
  `Score: ${score}`,
  8,
  20,
  '16px Arial',
  'left',
  '#3B3B3B',
);

const livesText = new Text(
  `Lives: ${lives}`,
  canvas.width - 8,
  20,
  '16px Arial',
  'right',
  '#3B3B3B',
);

const ball = new Ball(canvas.width / 2, canvas.height - 35);

const paddle = new Sprite((canvas.width - 75) / 2, canvas.height - 10, 75, 10, '#3B3B3B');

// controls
let rightPressed = false;
let leftPressed = false;

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.w / 2;
    // paddle.x = (relativeX - paddle.w) / 2;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// bricks
const brickOpt = {
  rows: 3,
  cols: 6,
  h: 20, // height
  w: 60, // width
  padding: 10,
  mx: 35, // margin x
  my: 30, // margin y
  colors: ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#3498DB', '#9B59B6'],
};
const bricks = [];

for (let c = 0; c < brickOpt.cols; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickOpt.rows; r += 1) {
    bricks[c][r] = new Brick(
      (c * (brickOpt.w + brickOpt.padding)) + brickOpt.mx,
      (r * (brickOpt.h + brickOpt.padding)) + brickOpt.my,
      brickOpt.w,
      brickOpt.h,
      brickOpt.colors[c],
    );
  }
}

function renderBricks() {
  for (let c = 0; c < brickOpt.cols; c += 1) {
    for (let r = 0; r < brickOpt.rows; r += 1) {
      if (bricks[c][r].status === true) {
        bricks[c][r].render(ctx);
      }
    }
  }
}

function renderScore() {
  scoreText.text = `Score: ${score}`;
  scoreText.render(ctx);
}

function renderLives() {
  livesText.text = `Lives: ${lives}`;
  livesText.render(ctx);
}

// function randomBallColor() {
//   ballColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }

function controlPaddle() {
  if (rightPressed) {
    paddle.x += 7;
    if (paddle.x + paddle.w > canvas.width) {
      paddle.x = canvas.width - paddle.w;
    }
  } else if (leftPressed) {
    paddle.x -= 7;
    if (paddle.x < 0) {
      paddle.x = 0;
    }
  }
}

function brickCollisionCheck() {
  for (let c = 0; c < brickOpt.cols; c += 1) {
    for (let r = 0; r < brickOpt.rows; r += 1) {
      const b = bricks[c][r];
      if (b.status === true) {
        if (ball.x + ball.r > b.x
            && ball.x - ball.r < b.x + brickOpt.w
            && ball.y + ball.r > b.y
            && ball.y - ball.r < b.y + brickOpt.h) {
          ball.dy = -ball.dy;
          b.status = false;
          score += 1;
          if (score === brickOpt.rows * brickOpt.cols) {
            endText.text = 'You win!';
          }
        }
      }
    }
  }
}

function wallCollisionCheck() {
  if (ball.x + ball.dx > canvas.width - ball.r || ball.x + ball.dx < ball.r) {
    ball.dx = -ball.dx;
    ball.randomSlope();
  } else if (ball.y + ball.dy < ball.r) {
    ball.dy = -ball.dy;
    ball.randomSlope();
  } else if (ball.y + ball.dy > canvas.height - ball.r) {
    lives -= 1;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 30;
    ball.speed = 2;
    ball.randomSlope();
    ball.dx *= (Math.floor(Math.random() * 2) || -1);
    ball.dy *= (Math.floor(Math.random() * 2) || -1);
    paddle.x = (canvas.width - paddle.w) / 2;
  }
}

function paddleCollisionCheck() {
  if (ball.y > canvas.height - ball.r - paddle.h) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
      ball.incrementSpeed();
      ball.dy = -ball.dy;
      ball.randomSlope();
    }
  }
}

function renderBackground() {
  ctx.fillStyle = rainbow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function keyDownEndHandler(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    helpText.text = 'Restarting...';
    helpText.render(ctx);
  }
}

function keyUpEndHandler(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    document.location.reload();
  }
}

function renderEndScreen() {
  renderBricks();
  renderScore();
  renderLives();

  endText.render(ctx);
  helpText.render(ctx);

  document.addEventListener('keydown', keyDownEndHandler, false);
  document.addEventListener('keyup', keyUpEndHandler, false);
}

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderBackground();

  if (!lives || score === brickOpt.rows * brickOpt.cols) {
    renderEndScreen();
  } else {
    brickCollisionCheck();
    paddleCollisionCheck();
    wallCollisionCheck();
    controlPaddle();

    ball.render(ctx);
    paddle.render(ctx);
    renderBricks();
    renderScore();
    renderLives();

    ball.move();
  }
  requestAnimationFrame(draw);
}

draw();
