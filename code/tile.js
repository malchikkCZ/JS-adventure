export class Tile {

    constructor(game, r, c) {
        this.image = document.getElementById("imgRock");
        this.game = game;

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.size =48;
        this.offset = 15;
        this.position = {x: c * this.size, y: r * this.size};
    }

    draw(ctx, player) {
        let posX = this.position.x + this.game.gameWidth / 2 - player.position.x - player.size / 2;
        let posY = this.position.y + this.game.gameHeight / 2 - player.position.y - player.size / 2;
        ctx.drawImage(
            this.image,
            posX,
            posY,
            this.size,
            this.size
        );
    }
}