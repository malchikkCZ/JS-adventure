import { Game } from './game.js';

// import settings
import { settings } from './settings.js';

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const gameWidth = canvas.getAttribute('width');
const gameHeight = canvas.getAttribute('height');
const backgroundColor = settings.general.backgroundColor;

let game = new Game(gameWidth, gameHeight);
let lastTime = 0;

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    game.update(deltaTime);
    game.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
