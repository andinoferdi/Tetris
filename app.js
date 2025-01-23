const COLS = 12;
const ROWS = 20;
const SIZE = 40;
const COLORS = ["blue", "red", "green", "purple", "pink"];
const BLOCK_SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};
let state = "STOPPED";
let gameInterval = null;
let currentBlock = createBlock();
let grid = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => null)
);
let level = 1;
let linesCleared = 0;
let speed = 100;

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.width = COLS * SIZE;
canvas.height = ROWS * SIZE;

function randomInArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]).reverse());
}

function isCollision(block, dx, dy) {
  return block.shape.some((row, y) =>
    row.some((value, x) => {
      if (!value) return false;
      const newX = block.x + x + dx;
      const newY = block.y + y + dy;
      return (
        newX < 0 ||
        newX >= COLS ||
        newY >= ROWS ||
        (newY >= 0 && grid[newY][newX] !== null)
      );
    })
  );
}

function createBlock() {
  const shape = randomInArray(Object.values(BLOCK_SHAPES));
  return {
    shape,
    color: randomInArray(COLORS),
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
  };
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        ctx.fillStyle = cell;
        ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
      }
    });
  });
}

function drawBlock(block) {
  block.shape.forEach((row, dy) => {
    row.forEach((value, dx) => {
      if (value) {
        ctx.fillStyle = block.color;
        ctx.fillRect((block.x + dx) * SIZE, (block.y + dy) * SIZE, SIZE, SIZE);
      }
    });
  });
}

function mergeBlockToGrid(block) {
  block.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        grid[block.y + y][block.x + x] = block.color;
      }
    });
  });
}

function clearFullRows() {
  const rowsBefore = grid.length;
  grid = grid.filter((row) => row.some((cell) => cell === null));
  const clearedRows = rowsBefore - grid.length;
  linesCleared += clearedRows;
  while (grid.length < ROWS) {
    grid.unshift(Array(COLS).fill(null));
  }
  if (clearedRows > 0) updateLevel();
}

function updateLevel() {
  const previousLevel = level;
  level = Math.floor(linesCleared / 10) + 1;
  speed = Math.max(100, 500 - (level - 1) * 50);
  updateLevelDisplay(level);

  if (level !== previousLevel) {
    console.log(`Level updated to ${level}, Speed: ${speed}`);
    if (gameInterval) {
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }
  }
}

function updateLevelDisplay(newLevel) {
  const levelElement = document.getElementById("level");
  if (levelElement) {
    levelElement.textContent = newLevel;
  } else {
    console.warn("Level display element not found!");
  }
}

function dropBlock() {
  if (!isCollision(currentBlock, 0, 1)) {
    currentBlock.y++;
  } else {
    mergeBlockToGrid(currentBlock);
    clearFullRows();
    currentBlock = createBlock();
    if (isCollision(currentBlock, 0, 0)) {
      console.log("Game over!");
      state = "GAME_OVER";
      stopGame();
    }
  }
}

function gameLoop() {
  if (state === "PLAYING") {
    dropBlock();
    drawGrid();
    drawBlock(currentBlock);
  }
}

function startGame() {
  if (state === "GAME_OVER") resetGame();
  state = "PLAYING";
  if (!gameInterval) {
    gameInterval = setInterval(gameLoop, speed);
  }
}

function stopGame() {
  state = "STOPPED";
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  }
}

function resetGame() {
  stopGame();
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  currentBlock = createBlock();
  state = "STOPPED";
  linesCleared = 0;
  level = 1;
  speed = 100;
  drawGrid();
  updateLevelDisplay(level);
}

document.getElementById("playButton").addEventListener("click", () => {
  if (state !== "PLAYING") startGame();
});
document.getElementById("stopButton").addEventListener("click", stopGame);
document.getElementById("resetButton").addEventListener("click", resetGame);

drawGrid();

function updateGameInfo() {
  document.getElementById("linesCleared").textContent = linesCleared;
  document.getElementById("score").textContent = linesCleared * 100;
}

function clearFullRows() {
  const rowsBefore = grid.length;
  grid = grid.filter((row) => row.some((cell) => cell === null));
  const clearedRows = rowsBefore - grid.length;
  linesCleared += clearedRows;
  while (grid.length < ROWS) {
    grid.unshift(Array(COLS).fill(null));
  }
  if (clearedRows > 0) {
    updateLevel();
    updateGameInfo();
  }
}
