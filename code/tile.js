export class Tile {

    constructor(game, r, c, layer, surface) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;

        this.name = layer;
        this.verticalOffset = 0;
        switch (layer) {
            case 'borders':
                this.height = this.tileSize;
                this.width = this.tileSize;
                this.offset = 10;
                break;
            case 'grass':
            case 'objects':
                this.image = document.getElementById(layer + surface);
                this.height = this.image.height;
                this.width = this.image.width;
                if (layer === 'objects') {
                    this.verticalOffset = this.tileSize;
                }
                this.offset = 10;
                break;
        }
        this.position = {x: c * this.tileSize, y: r * this.tileSize - this.verticalOffset};

        this.killed = false;
    }

    draw(ctx, posX, posY) {
        ctx.drawImage(this.image, this.position.x + posX, this.position.y + posY, this.width, this.height);
    }
}