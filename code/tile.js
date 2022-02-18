export class Tile {

    constructor(game, r, c, layer, surface) {
        this.image = new Image();

        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;
        this.scale = game.scale;

        this.verticalOffset = 0;

        switch (layer) {
            case 'borders':
                this.height = this.tileSize;
                this.width = this.tileSize;
                this.offset = 15;
                break;
            case 'grass':
            case 'objects':
                this.image = document.getElementById(layer + surface);
                this.height = this.image.height * this.scale;
                this.width = this.image.width * this.scale;
                if (layer === 'objects') {
                    this.verticalOffset = this.tileSize;
                }
                this.offset = 15;
                break;
        }

        this.position = {x: c * this.tileSize, y: r * this.tileSize - this.verticalOffset};
    }

    draw(ctx, player) {
        let posX = this.position.x + this.gameWidth / 2 - player.position.x - player.width / 2;
        let posY = this.position.y + this.gameHeight / 2 - player.position.y - player.height / 2;
        ctx.drawImage(
            this.image,
            posX,
            posY,
            this.width,
            this.height
        );
    }
}