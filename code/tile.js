export class Tile {

    constructor(game, r, c) {
        this.image = document.getElementById("imgRock");
        this.game = game;

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.size = 64;
        this.offset = 20;
        this.position = {x: c * this.size, y: r * this.size};
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size,
            this.size
        );
    }
}