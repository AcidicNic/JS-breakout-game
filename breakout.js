var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var score = 0;
var lives = 2;
var textColor = "#3B3B3B";
var endMsg = "Game Over!";
var helpMsg = "Press space or enter to restart";

// ball
var ballRadius = 10;
var ballColor = "#3B3B3B"
var ballSpeed = 2;
// ball coords
var x = canvas.width/2;
var y = canvas.height-30;
// ball speed & direction
var dx = 2 * (Math.floor(Math.random()*2) || -1);
var dy = 2 * (Math.floor(Math.random()*2) || -1);

// paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;
var paddleColor = "#3B3B3B";

// controls
var rightPressed = false;
var leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

// bricks
brickOpt = {
    rows: 3,
    cols: 6,
    h: 20, // height
    w: 60, // width
    padding: 10,
    mx: 35, // margin x
    my: 30, // margin y
    colors: ["#E74C3C", "#F39C12", "#F1C40F", "#2ECC71", "#3498DB", "#9B59B6"]
}
var bricks = [];

for(var c=0; c<brickOpt.cols; c++) {
    bricks[c] = [];
    for(var r=0; r<brickOpt.rows; r++) {
        bricks[c][r] = {
            x: (c*(brickOpt.w+brickOpt.padding))+brickOpt.mx,
            y: (r*(brickOpt.h+brickOpt.padding))+brickOpt.my,
            color: brickOpt.colors[c],
            status: 1
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
    for(var c=0; c<brickOpt.cols; c++) {
        for(var r=0; r<brickOpt.rows; r++) {
            if(bricks[c][r].status == 1) {
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
    ctx.font = "16px Arial";
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score} [dx: ${dx}, dy: ${dy}]`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.fillText("Lives: " + lives, canvas.width - 8, 20);
}

function randomBallColor() {
    ballColor = "#" + Math.floor(Math.random()*16777215).toString(16);
}

function controlPaddle() {
    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }
}

function brickCollisionCheck() {
    for (var c = 0; c < brickOpt.cols; c++) {
        for (var r = 0; r < brickOpt.rows; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x + ballRadius > b.x &&
                    x - ballRadius < b.x + brickOpt.w &&
                    y + ballRadius > b.y &&
                    y - ballRadius < b.y + brickOpt.h)
                {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickOpt.rows * brickOpt.cols) {
                        endMsg = "You win!"
                    }
                }
            }
        }
    }
}

function wallCollisionCheck() {
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        randomSlope();
    }
    else if (y + dy < ballRadius) {
        dy = -dy;
        randomSlope();
    }
    else if (y + dy > canvas.height - ballRadius) {
        lives--;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2 * (Math.floor(Math.random()*2) || -1);
        dy = 2 * (Math.floor(Math.random()*2) || -1);
        paddleX = (canvas.width - paddleWidth) / 2;
    }
}

function paddleCollisionCheck() {
    if (y > canvas.height - ballRadius - paddleHeight) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            ballSpeed += .1;
            dy = -dy;
            randomSlope();
        }
    }
}

function randomSlope() {
    dy = (ballSpeed + ((Math.random() - .5) / 2)) * Math.sign(dy);
    dx = (ballSpeed + ((Math.random() - .5) / 2)) * Math.sign(dx);
}

function drawBackground() {
    var rainbow = ctx.createLinearGradient(0, 0, canvas.width, 0);
    rainbow.addColorStop(0, "#FFCCCC");
    rainbow.addColorStop(.2, "#FEFFBF");
    rainbow.addColorStop(.5, "#C0FFBF");
    rainbow.addColorStop(.8, "#BFFDFF");
    rainbow.addColorStop(1, "#E4BFFF");
    ctx.fillStyle = rainbow;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawEndScreen() {
    drawBricks();
    drawScore();
    drawLives();
    ctx.font = "24px Arial";
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.fillText(endMsg, canvas.width / 2, canvas.height / 2);
    ctx.font = "16px Arial";
    ctx.fillText(helpMsg, canvas.width / 2, canvas.height / 2 + 30);

    document.addEventListener("keydown", keyDownEndHandler, false);
    document.addEventListener("keyup", keyUpEndHandler, false);
}

function keyDownEndHandler(e) {
    if(e.key == " " || e.key == "Enter") {
        helpMsg = "Restarting...";
    }
}

function keyUpEndHandler(e) {
    if(e.key == " " || e.key == "Enter") {
        document.location.reload();
    }
}

function draw() {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (!lives || score == brickOpt.rows * brickOpt.cols) {
        drawEndScreen();
    }
    else {
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
