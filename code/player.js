import { Weapon } from "./weapon.js";

// import settings
import { settings } from './settings.js';


export class Player {

    constructor(game, r, c) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;
        this.groups = game.groups;

        this.image = document.getElementById('player');

        this.width = this.tileSize;
        this.height = this.tileSize;
        this.position = {x: c * this.tileSize, y: r * this.tileSize};
        this.verticalOffset = 3;

        this.animationFrames = {
            'down-idle': [[0, 0]],
            'right-idle': [[0, 1]],
            'up-idle': [[0, 2]],
            'left-idle': [[0, 3]],
            'down': [[0, 0], [1, 0], [2, 0], [3, 0]],
            'right': [[0, 1], [1, 1], [2, 1], [3, 1]],
            'up': [[0, 2], [1, 2], [2, 2], [3, 2]],
            'left': [[0, 3], [1, 3], [2, 3], [3, 3]],
            'down-attack': [[4, 0]],
            'right-attack': [[4, 1]],
            'up-attack': [[4, 2]],
            'left-attack': [[4, 3]]
        }
        this.animationSpeed = settings.player.animationSpeed;
        this.frameIndex = 0;

        this.maxHealth = settings.player.stats.health;
        this.health = this.maxHealth * 0.8;

        this.maxSpeed = settings.player.stats.speed;
        this.speed = {x: 0, y: 0};
        this.status = 'down-idle';
        this.killed = false;

        this.weapons = settings.weapons;
        this.weaponIndex = 0;
        this.canSwitchWeapon = true;
        this.attacking = false;

        this.cooldown = settings.weapons[this.weaponIndex].cooldown;
        this.attackTime = 0;

        this.targetPosition = {x: this.position.x, y: this.position.y};
        this.moving = false;
    }

    update() {
        if (this.attacking && this.game.uptime >= this.attackTime + this.cooldown) {
            this.attacking = false;
            this.status = this.status.split('-')[0];
        }
        if (!this.attacking) {
            let speed_vect = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
            if (speed_vect > 0) {
                speed_vect = 1 / speed_vect;
            }
            this.position.x += Math.round(this.speed.x * this.maxSpeed * speed_vect);
            this.collision('horizontal');
            this.position.y += Math.round(this.speed.y * this.maxSpeed * speed_vect);
            this.collision('vertical');
            if (this.moving) {
                if (Math.abs(this.position.x - this.targetPosition.x) < this.tileSize / 2 && 
                    Math.abs(this.position.y - this.targetPosition.y) < this.tileSize / 2) {
                        this.stopMovingTowards();
                } else {
                    this.moveTowards(this.targetPosition);
                }
            }
        }
    }

    draw(ctx, posX, posY) {
        let animationFrame = this.getAnimationFrame();
        let animationFramePosX = animationFrame[0] * this.width;
        let animationFramePosY = animationFrame[1] * this.height;
        ctx.drawImage(this.image, animationFramePosX, animationFramePosY,
            this.width, this.height, this.position.x + posX, this.position.y + posY, this.width, this.height);
    }

    updateDirection() {
        if (!this.attacking) {
            if (this.speed.x === 0 && this.speed.y === 0) {
                return this.status.split('-')[0] + '-idle';
            } else if (this.speed.x === 0 && this.speed.y > 0) {
                return 'down';
            } else if (this.speed.x === 0 && this.speed.y < 0) {
                return 'up';
            } else if (this.speed.x > 0 && this.speed.y === 0) {
                return 'right';
            } else if (this.speed.x < 0 && this.speed.y === 0) {
                return 'left';
            } else if (this.speed.x > 0 && !['up', 'down'].includes(this.status)) {
                return 'right';
            } else if (this.speed.x < 0 && !['up', 'down'].includes(this.status)) {
                return 'left';
            } else if (this.speed.y > 0 && !['left', 'right'].includes(this.status)) {
                return 'down';
            } else if (this.speed.y < 0 && !['left', 'right'].includes(this.status)) {
                return 'up';
            } else {
                return this.status;
            }
        } else {
            return this.status;
        }
    }

    getAnimationFrame() {
        this.status = this.updateDirection();
        this.frameIndex = this.frameIndex + this.animationSpeed / 100;
        if (this.frameIndex >= this.animationFrames[this.status].length) {
            this.frameIndex = 0;
        }
        return this.animationFrames[this.status][Math.floor(this.frameIndex)];
    }

    move(direction) {
        switch (direction) {
            case 'left':
                this.speed.x = -1;
                break;
            case 'right':
                this.speed.x = 1;
                break;
            case 'up':
                this.speed.y = -1;
                break;
            case 'down':
                this.speed.y = 1;
                break;
        }
    }

    moveTowards(target) {
        this.moving = true;
        this.speed.x = target.x - this.position.x;
        this.speed.y = target.y - this.position.y;
        if (Math.abs(this.speed.x) - Math.abs(this.speed.y) > 0) {
            if (this.speed.x > 0) {
                this.status = 'right';
            } else {
                this.status = 'left';
            }
        } else {
            if (this.speed.y > 0) {
                this.status = 'down';
            } else {
                this.status = 'up';
            }
        }
    }

    stopMovingTowards() {
        this.targetPosition.x = this.position.x;
        this.targetPosition.y = this.position.y;
        this.speed = {x: 0, y: 0};
        this.moving = false;
    }

    attack() {
        const sprite = new Weapon(this.game, this);
        this.cooldown = settings.weapons[this.weaponIndex].cooldown;
        this.groups.visibleSprites.push(sprite);
        this.groups.attackSprites.push(sprite);
        this.attacking = true;
        this.attackTime = this.game.uptime;
        this.status = this.status.split('-')[0] + '-attack';
    }

    collision(direction) {
        let obstaclesToCheck;
        switch (direction) {
            case 'horizontal':
                obstaclesToCheck = this.groups.obstacleSprites.filter((sprite) => {
                    return sprite.position.x > this.position.x - 100 && sprite.position.x < this.position.x + this.width + 100;
                });
                break;
            case 'vertical':
                obstaclesToCheck = this.groups.obstacleSprites.filter((sprite) => {
                    return sprite.position.y > this.position.y - 100 && sprite.position.y < this.position.y + this.height + 100;
                })
                break;
        }
        for (let sprite of obstaclesToCheck) {
            if (this.position.x + this.width - this.verticalOffset > sprite.position.x &&
                this.position.x + this.verticalOffset < sprite.position.x + sprite.width &&
                this.position.y + this.height > sprite.position.y + sprite.offset &&
                this.position.y < sprite.position.y + sprite.height - sprite.offset) {
                    switch (direction) {
                        case 'horizontal':
                            if (this.speed.x > 0) {
                                this.position.x = sprite.position.x - this.width + this.verticalOffset;
                            }
                            if (this.speed.x < 0) {
                                this.position.x = sprite.position.x + sprite.width - this.verticalOffset;
                            }
                            break;
                        case 'vertical':
                            if (this.speed.y > 0) {
                                this.position.y = sprite.position.y - this.height + sprite.offset;
                            }
                            if (this.speed.y < 0) {
                                this.position.y = sprite.position.y + sprite.height - sprite.offset;
                            }
                            break;
                    }
            }
        }
    }
}