const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // Maintain constant speed
let dy = -2; // Maintain constant speed

const paddleHeight = 10;
const paddleWidth = 175;
let playerPaddleX = (canvas.width - paddleWidth) / 2;
let computerPaddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;
let gameStarted = false;
let gamePaused = true;
let interval;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.getElementById("playPauseButton").addEventListener("click", toggleGame);

function resizeCanvas() {
  const canvas = document.getElementById('gameCanvas');
  const canvasWidth = window.innerWidth * 0.8; // Adjust the proportion as needed
  const canvasHeight = canvasWidth * 0.5; // Adjust the proportion as needed
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Call the function initially

function toggleGame() {
  if (!gameStarted) {
    startGame();
    return;
  }
  if (gamePaused) {
    document.getElementById("playPauseButton").innerText = "Pause";
    gamePaused = false;
    interval = setInterval(draw, 10);
  } else {
    document.getElementById("playPauseButton").innerText = "Play";
    gamePaused = true;
    clearInterval(interval);
  }
}

function startGame() {
  document.getElementById("playPauseButton").innerText = "Pause";
  document.getElementById("playPauseButton").style.display = "block";
  canvas.style.display = "block";
  gameStarted = true;
  gamePaused = false;
  interval = setInterval(draw, 10);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawPlayerPaddle() {
  ctx.beginPath();
  ctx.rect(playerPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function drawComputerPaddle() {
  ctx.beginPath();
  ctx.rect(computerPaddleX, 0, paddleWidth, paddleHeight);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPlayerPaddle();
  drawComputerPaddle();

  // Ball collision detection with walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > playerPaddleX && x < playerPaddleX + paddleWidth) {
      dy = -dy;
      // Adjust ball direction based on where it hits the player's paddle
      let collidePoint = x - (playerPaddleX + paddleWidth / 2);
      dx = collidePoint * 0.2;
    } else {
      // If the ball misses the player's paddle
      clearInterval(interval); // Stop the game
      alert("Game Over"); // Display game over message
      document.location.reload(); // Reload the page to restart the game
    }
  }

  // Player paddle movement
  if (rightPressed && playerPaddleX < canvas.width - paddleWidth) {
    playerPaddleX += 5;
  } else if (leftPressed && playerPaddleX > 0) {
    playerPaddleX -= 5;
  }

  // Computer paddle movement
  let paddleCenter = computerPaddleX + paddleWidth / 2;
  let ballCenter = x;
  let speed = 4;
  let distance = Math.abs(paddleCenter - ballCenter);

  // Adjust speed based on distance
  if (distance > 30) {
    speed = 6;
  } else if (distance > 10) {
    speed = 4;
  } else {
    speed = 2;
  }

  if (paddleCenter - ballCenter > 0) {
    computerPaddleX -= speed;
  } else if (paddleCenter - ballCenter < 0) {
    computerPaddleX += speed;
  }

  x += dx;
  y += dy;
}