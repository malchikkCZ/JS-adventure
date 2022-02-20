// import settings
import { settings } from './settings.js';


export class Weapon {

    constructor(game, player) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;
        this.groups = game.groups;

        this.player = player;
        this.direction = player.status.split('-')[0];
        this.type = settings.weapons[player.weaponIndex];
        this.damage = this.type.damage;

        this.image = document.getElementById(this.type.name + '-' + this.direction);

        this.width = this.image.width;
        this.height = this.image.height;
        this.position = {x: 0, y: 0};

        this.weaponOffset = {
            x: this.player.width / 2 - this.width / 2 - 5,
            y: this.player.height / 2 - this.height / 2 + 8
        }

        switch (this.direction) {
            case 'down':
                this.position.x = this.player.position.x + this.weaponOffset.x;
                this.position.y = this.player.position.y + this.player.height;
                break;
            case 'right':
                this.position.x = this.player.position.x + this.player.width;
                this.position.y = this.player.position.y + this.weaponOffset.y;
                break;
            case 'up':
                this.position.x = this.player.position.x + this.weaponOffset.x;
                this.position.y = this.player.position.y - this.height;
                break;
            case 'left':
                this.position.x = this.player.position.x - this.width;
                this.position.y = this.player.position.y + this.weaponOffset.y;
        }

        this.cooldown = this.type.cooldown;
        this.creationTime = game.uptime;
        this.killed = false;
    }

    update() {
        if (this.game.uptime >= this.creationTime + this.cooldown) {
            this.killed = true;
        } else {
            this.groups.attackableSprites.forEach((sprite) => {
                if (this.position.x + this.width > sprite.position.x &&
                    this.position.x < sprite.position.x + sprite.width &&
                    this.position.y + this.height > sprite.position.y &&
                    this.position.y < sprite.position.y + sprite.height) {
                        if (sprite.name === 'grass') {
                            sprite.killed = true;
                        } else {
                            if (!sprite.invulnerable) {
                                sprite.getDamage(this.damage, this.cooldown);
                                sprite.attackResistance();
                            }
                            if (sprite.health <= 0) {
                                this.player.score += sprite.entity.stats.exp;
                                sprite.killed = true;
                            }
                        }
                }
            });
        }
    }

    draw(ctx, posX, posY) {
        ctx.drawImage(this.image, this.position.x + posX, this.position.y + posY, this.width, this.height);
    }
}