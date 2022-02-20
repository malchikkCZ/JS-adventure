import { Entity } from "./entity.js";
import { Weapon } from "./weapon.js";

// import settings
import { settings } from './settings.js';


export class Player extends Entity {

    constructor(game, r, c, mapCode) {
        super(game, r, c, mapCode);

        this.status = 'down-idle';

        this.maxHealth = this.entity.stats.health;
        this.score = 0;

        this.weapons = settings.weapons;
        this.weaponIndex = 0;

        this.cooldown = settings.weapons[this.weaponIndex].cooldown;

        this.moving = false;
        this.attacking = false;
        this.canSwitchWeapon = true;

        this.targetPosition = {x: this.position.x, y: this.position.y};
    }

    update() {
        if (this.health <= 0) {
            this.health = 0;
            this.game.gameOver = true;
        } else {
            if (this.attacking && this.game.uptime >= this.attackTime + this.cooldown) {
                this.attacking = false;
                this.status = this.status.split('-')[0];
            }
            if (this.invulnerable && this.game.uptime >= this.hitTime + this.invulnerableTime) {
                this.invulnerable = false;
            }
            this.animationFrame = this.getAnimationFrame();
            if (!this.attacking) {
                this.updatePosition();
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
    }

    updateStatus() {
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
}