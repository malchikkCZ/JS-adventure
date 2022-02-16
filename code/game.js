import Player from './player.js';
import InputHandler from './input.js';

export default class Game {

    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.player = new Player(this);
        new InputHandler(this.player, this);
    }

    update(deltaTime) {
        this.player.update(deltaTime);
    }

    draw(ctx) {
        this.player.draw(ctx);
    }
}