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
const textColor = '#3B3B3B';
let endMsg = 'Game Over!';
let helpMsg = 'Press space or enter to restart';

// ball
const ballRadius = 7;
const ballColor = '#3B3B3B';
let ballSpeed = 2;
// ball coords
let x = canvas.width / 2;
let y = canvas.height - 30;
// ball speed & direction
let dx = 2 * (Math.floor(Math.random() * 2) || -1);
let dy = 2 * (Math.floor(Math.random() * 2) || -1);

// paddle
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleColor = '#3B3B3B';

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
    paddleX = relativeX - paddleWidth / 2;
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
    bricks[c][r] = {
      x: (c * (brickOpt.w + brickOpt.padding)) + brickOpt.mx,
      y: (r * (brickOpt.h + brickOpt.padding)) + brickOpt.my,
      color: brickOpt.colors[c],
      status: 1,
    };
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickOpt.cols; c += 1) {
    for (let r = 0; r < brickOpt.rows; r += 1) {
      if (bricks[c][r].status === 1) {
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickOpt.w, brickOpt.h);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'right';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 8, 20);
}

// function randomBallColor() {
//   ballColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
// }

function controlPaddle() {
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

function brickCollisionCheck() {
  for (let c = 0; c < brickOpt.cols; c += 1) {
    for (let r = 0; r < brickOpt.rows; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x + ballRadius > b.x
            && x - ballRadius < b.x + brickOpt.w
            && y + ballRadius > b.y
            && y - ballRadius < b.y + brickOpt.h) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickOpt.rows * brickOpt.cols) {
            endMsg = 'You win!';
          }
        }
      }
    }
  }
}

function randomSlope() {
  dy = (ballSpeed + ((Math.random() - 0.5) / 2)) * Math.sign(dy);
  dx = (ballSpeed + ((Math.random() - 0.5) / 2)) * Math.sign(dx);
}

function wallCollisionCheck() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    randomSlope();
  } else if (y + dy < ballRadius) {
    dy = -dy;
    randomSlope();
  } else if (y + dy > canvas.height - ballRadius) {
    lives -= 1;
    x = canvas.width / 2;
    y = canvas.height - 30;
    ballSpeed = 2;
    randomSlope();
    dx *= (Math.floor(Math.random() * 2) || -1);
    dy *= (Math.floor(Math.random() * 2) || -1);
    paddleX = (canvas.width - paddleWidth) / 2;
  }
}

function paddleCollisionCheck() {
  if (y > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      ballSpeed += 0.1;
      dy = -dy;
      randomSlope();
    }
  }
}

function drawBackground() {
  ctx.fillStyle = rainbow;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function keyDownEndHandler(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    helpMsg = 'Restarting...';
  }
}

function keyUpEndHandler(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    document.location.reload();
  }
}

function drawEndScreen() {
  drawBricks();
  drawScore();
  drawLives();
  ctx.font = '24px Arial';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.fillText(endMsg, canvas.width / 2, canvas.height / 2);
  ctx.font = '16px Arial';
  ctx.fillText(helpMsg, canvas.width / 2, canvas.height / 2 + 20);

  document.addEventListener('keydown', keyDownEndHandler, false);
  document.addEventListener('keyup', keyUpEndHandler, false);
}

function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (!lives || score === brickOpt.rows * brickOpt.cols) {
    drawEndScreen();
  } else {
    brickCollisionCheck();
    paddleCollisionCheck();
    wallCollisionCheck();
    controlPaddle();

    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();

    // update coords
    x += dx;
    y += dy;
  }
  requestAnimationFrame(draw);
}

draw();
