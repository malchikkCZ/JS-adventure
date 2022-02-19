import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Tile } from './tile.js';

// import world layout
import { borders, grass, objects } from './level.js';

export class Game {

    constructor(gameWidth, gameHeight) {
        this.uptime = 0;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.scale = 0.75;
        this.tileSize = 64 * this.scale;

        this.groups = {
            obstacleSprites: [],
            visibleSprites: [],
            attackableSprites: [],
            attackSprites: []
        };

        this.bgImage = document.getElementById('background');
        this.bgImage.width *= this.scale;
        this.bgImage.height *= this.scale;

        this.world = [
            {name: 'borders', map: borders},
            {name: 'grass', map: grass},
            {name: 'objects', map: objects}
        ]
        
        for (let layer of this.world) {
            this.createMap(layer);
        }

        this.player = new Player(this, 21, 32);
        this.groups.visibleSprites.push(this.player);

        new InputHandler(this.player, this);
    }

    createMap(layer) {
        for (let r = 0; r < layer.map.length; r++) {
            for (let c = 0; c < layer.map[r].length; c++) {
                const surface = layer.map[r][c]
                switch (layer.name) {
                    case 'borders':
                        if (surface === '395') {
                            const sprite = new Tile(this, r, c, layer.name, surface);
                            this.groups.obstacleSprites.push(sprite);
                        }
                        break;
                    case 'grass':
                    case 'objects':
                        if (surface !== '-1') {
                            const sprite = new Tile(this, r, c, layer.name, surface);
                            this.groups.visibleSprites.push(sprite);
                            this.groups.obstacleSprites.push(sprite);
                            if (layer.name === 'grass') {
                                this.groups.attackableSprites.push(sprite);
                            }
                        }
                        break;
                    }
            }
        }
    }

    update(deltaTime) {
        this.uptime += deltaTime;
        this.groups.attackSprites.forEach((sprite) => sprite.update());

        Object.entries(this.groups).forEach((group) => {
            this.groups[group[0]] = this.groups[group[0]].filter((sprite) => !sprite.killed);
        });
        this.player.update();
    }

    draw(ctx) {
        let posX = this.gameWidth / 2 - this.player.position.x - this.player.width / 2;
        let posY = this.gameHeight / 2 - this.player.position.y - this.player.height / 2;
        ctx.drawImage(this.bgImage, posX, posY, this.bgImage.width, this.bgImage.height);

        const spritesToDraw = this.groups.visibleSprites.filter((sprite) => {
        
            return sprite.position.x > this.player.position.x - this.gameWidth / 2 - sprite.width &&
                sprite.position.x < this.player.position.x + this.gameWidth / 2 + sprite.width &&
                sprite.position.y > this.player.position.y - this.gameHeight / 2 - sprite.height &&
                sprite.position.y < this.player.position.y + this.gameHeight / 2 + sprite.height;
                
        });

        spritesToDraw
            .sort((a, b) => (a.position.y > b.position.y) ? 1 : -1)
            .forEach((sprite) => sprite.draw(ctx, this.player));
    }
}