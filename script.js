const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const restartButton = document.querySelector('.btn-restart');
const model = document.querySelector('.model');
const startGameModel = document.querySelector('.start-game');
const gameOverModel = document.querySelector('.game-over');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

let highScore = localStorage.getItem('highScore') || 0;
let score = 0;
let time = `00:00`;

let intervalId = null;
let timerIntervalId = null;
let direction = 'down';

const blocks = [];
let snake = [{ x: 1, y: 3 }];
let food = { 
    x: Math.floor(Math.random() * rows), 
    y: Math.floor(Math.random() * cols) 
};

highScoreElement.innerText = highScore;

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("blocks");
        board.appendChild(block);
        blocks[`${row}-${col}`] = block;
    }
}

function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    if (direction === 'left') head = { x: snake[0].x, y: snake[0].y - 1 };
    else if (direction === 'right') head = { x: snake[0].x, y: snake[0].y + 1 };
    else if (direction === 'down') head = { x: snake[0].x + 1, y: snake[0].y };
    else if (direction === 'up') head = { x: snake[0].x - 1, y: snake[0].y };

    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        clearInterval(intervalId);
        model.style.display = 'flex';
        startGameModel.style.display = 'none';
        gameOverModel.style.display = 'flex';
        return;
    }

    if (head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = { 
            x: Math.floor(Math.random() * rows), 
            y: Math.floor(Math.random() * cols) 
        };
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        snake.unshift(head);
        score += 10;
        scoreElement.innerText = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore.toString());
        }
    }

    snake.forEach(dets => blocks[`${dets.x}-${dets.y}`].classList.remove('fill'));

    snake.unshift(head);
    snake.pop();

    snake.forEach(dets => blocks[`${dets.x}-${dets.y}`].classList.add('fill'));
}

startButton.addEventListener("click", () => {
    model.style.display = 'none';
    intervalId = setInterval(render, 200);
    timerIntervalId = setInterval(updateTimer, 1000);
});

function updateTimer() {
    let [min, sec] = time.split(':').map(Number);
    if (sec === 59) {
        min += 1;
        sec = 0;
    } else {
        sec += 1;
    }
    time = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    timeElement.innerText = time;
}

function restartGame() {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(dets => blocks[`${dets.x}-${dets.y}`].classList.remove("fill"));
    score = 0;
    time = `00:00`;
    direction = 'down';
    snake = [{ x: 1, y: 3 }];
    food = { 
        x: Math.floor(Math.random() * rows), 
        y: Math.floor(Math.random() * cols) 
    };
    scoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;
    model.style.display = 'none';
    intervalId = setInterval(render, 200);
}

restartButton.addEventListener("click", restartGame);

addEventListener("keydown", (event) => {
    if (event.key === 'ArrowUp') direction = 'up';
    else if (event.key === 'ArrowRight') direction = 'right';
    else if (event.key === 'ArrowDown') direction = 'down';
    else if (event.key === 'ArrowLeft') direction = 'left';
});
