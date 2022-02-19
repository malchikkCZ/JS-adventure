import { Game } from './game.js';

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = canvas.getAttribute('width');
const GAME_HEIGHT = canvas.getAttribute('height');

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
let lastTime = 0;

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.fillStyle = '#71ddee';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
