// import settings
import { settings } from './settings.js';


export class Entity {

    constructor(game, r, c, mapCode) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;
        this.groups = game.groups;

        // entity setup
        this.entity = settings.entities[mapCode];
        this.name = this.entity.name;
        this.health = this.entity.stats.health;
        this.maxSpeed = this.entity.stats.speed;
        this.speed = {x: 0, y: 0};

        this.image = document.getElementById(this.name);

        // size and position
        this.width = this.entity.size;
        this.height = this.entity.size;
        this.position = {x: c * this.tileSize, y: r * this.tileSize};
        this.verticalOffset = 3;

        // animation
        this.animationFrames = this.entity.animationFrames;
        this.animationSpeed = settings.general.animationSpeed;
        this.frameIndex = 0;
        this.status = 'idle';
    
        // ingame stats
        this.killed = false;
        this.invulnerable = false;
        this.invulnerableTime = 0;
        this.attackTime = 0;
        this.hitTime = 0;
    }

    updatePosition() {
        let speed_vect = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
        if (speed_vect > 0) {
            speed_vect = 1 / speed_vect;
        }
        this.position.x += Math.round(this.speed.x * this.maxSpeed * speed_vect);
        this.collision('horizontal');
        this.position.y += Math.round(this.speed.y * this.maxSpeed * speed_vect);
        this.collision('vertical');
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

        let playerAura = 0;
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

    getAnimationFrame() {
        this.status = this.updateStatus();
        this.frameIndex = this.frameIndex + this.animationSpeed / 100;
        if (this.frameIndex >= this.animationFrames[this.status].length) {
            this.frameIndex = 0;
        }
        return this.animationFrames[this.status][Math.floor(this.frameIndex)];
    }

    getDamage(damage, cooldown) {
        this.health -= damage;
        this.invulnerable = true;
        this.hitTime = this.game.uptime;
        this.invulnerableTime = cooldown;
    }

    draw(ctx, posX, posY) {
        let animationFrame = this.getAnimationFrame();
        let animationFramePosX = animationFrame[0] * this.width;
        let animationFramePosY = animationFrame[1] * this.height;
        if (!this.invulnerable || Math.floor(this.game.uptime / 75) % 2) {
            ctx.drawImage(this.image, animationFramePosX, animationFramePosY,
                this.width, this.height, this.position.x + posX, this.position.y + posY, this.width, this.height);
        }
    }
}