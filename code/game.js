import { AnimationPlayer } from './particles.js';
import { InputHandler } from './input.js';
import { Monster } from './monster.js';
import { Player } from './player.js';
import { Tile } from './tile.js';
import { UI } from './ui.js';

// import world layout
import { borders, grass, objects, entities } from './level.js';

// import settings
import { settings } from './settings.js';


export class Game {

    constructor(gameWidth, gameHeight) {
        this.uptime = 0;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.tileSize = settings.general.tileSize;
        this.gameOver = false;
        this.animationPlayer = new AnimationPlayer();

        this.groups = {
            obstacleSprites: [],
            visibleSprites: [],
            attackableSprites: [],
            attackSprites: [],
            entitySprites: [],
            particleSprites: []
        };

        // graphic assets
        this.bgImage = document.getElementById('background');

        this.world = [
            {name: 'borders', map: borders},
            {name: 'grass', map: grass},
            {name: 'objects', map: objects},
            {name: 'entities', map: entities}
        ]
        
        for (let layer of this.world) {
            this.createMap(layer);
        }

        // user interface
        new InputHandler(this.player, this);
        this.ui = new UI(this, this.player);
        this.restartBtn = document.getElementById('restartBtn');
        this.restartBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }

    createMap(layer) {
        for (let r = 0; r < layer.map.length; r++) {
            for (let c = 0; c < layer.map[r].length; c++) {
                const mapCode = layer.map[r][c]
                if (mapCode !== '-1') {
                    switch (layer.name) {
                        case 'borders':
                            if (mapCode === '395') {
                                const sprite = new Tile(this, r, c, layer.name, mapCode);
                                this.groups.obstacleSprites.push(sprite);
                            }
                            break;
                        case 'grass':
                        case 'objects':
                            const sprite = new Tile(this, r, c, layer.name, mapCode);
                            this.groups.visibleSprites.push(sprite);
                            this.groups.obstacleSprites.push(sprite);
                            if (layer.name === 'grass') {
                                this.groups.attackableSprites.push(sprite);
                            }
                            break;
                        case 'entities':
                            if (mapCode === '394') {
                                this.player = new Player(this, r, c, mapCode);
                                this.groups.visibleSprites.push(this.player);
                                this.groups.entitySprites.push(this.player);
                            } else {
                                const sprite = new Monster(this, r, c, mapCode);
                                this.groups.visibleSprites.push(sprite);
                                this.groups.attackableSprites.push(sprite);
                                this.groups.entitySprites.push(sprite);
                            }
                    }
                }
            }
        }
    }

    update(deltaTime) {
        if (!this.gameOver) {
            this.uptime += deltaTime;
            this.groups.attackSprites.forEach((weapon) => {
                this.groups.attackableSprites.forEach((sprite) => {
                    if (weapon.position.x + weapon.width > sprite.position.x &&
                        weapon.position.x < sprite.position.x + sprite.width &&
                        weapon.position.y + weapon.height > sprite.position.y &&
                        weapon.position.y < sprite.position.y + sprite.height) {
                            if (sprite.name === 'grass') {
                                sprite.killed = true;
                            } else {
                                if (!sprite.invulnerable) {
                                    let damage = weapon.damage;
                                    sprite.getDamage(damage, weapon.cooldown);
                                    sprite.attackResistance();
                                }
                                if (sprite.health <= 0) {
                                    this.player.score += sprite.entity.stats.exp;
                                    sprite.killed = true;
                                }
                            }
                    }
                });
                weapon.update();
            });
            this.groups.particleSprites.forEach((sprite) => sprite.update());
    
            Object.entries(this.groups).forEach((group) => {
                this.groups[group[0]] = this.groups[group[0]].filter((sprite) => !sprite.killed);
            });
    
            this.groups.entitySprites.forEach((sprite) => sprite.update());
        }
    }

    draw(ctx) {
        const posX = this.gameWidth / 2 - this.player.position.x - this.player.width / 2;
        const posY = this.gameHeight / 2 - this.player.position.y - this.player.height / 2;
        ctx.drawImage(this.bgImage, posX, posY, this.bgImage.width, this.bgImage.height);

        const spritesToDraw = this.groups.visibleSprites.filter((sprite) => {
            return sprite.position.x > this.player.position.x - this.gameWidth / 2 - sprite.width &&
                sprite.position.x < this.player.position.x + this.gameWidth / 2 + sprite.width &&
                sprite.position.y > this.player.position.y - this.gameHeight / 2 - sprite.height &&
                sprite.position.y < this.player.position.y + this.gameHeight / 2 + sprite.height;
        });

        spritesToDraw
            .sort((a, b) => (a.position.y > b.position.y) ? 1 : -1)
            .forEach((sprite) => sprite.draw(ctx, posX, posY));

        this.ui.draw(ctx);
        if (this.gameOver) {
            ctx.fillStyle = '#00000050';
            ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
            this.ui.showGameOver(ctx, 'GAME OVER');
            document.getElementById('btnContainer').style.display = 'flex';
        }
    }
}