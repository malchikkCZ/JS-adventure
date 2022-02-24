import { Entity } from "./entity.js";
import { Weapon } from "./weapon.js";

// import settings
import { settings } from './settings.js';


export class Player extends Entity {

    constructor(game, r, c, mapCode) {
        super(game, r, c, mapCode);

        this.status = 'down-idle';

        this.maxHealth = this.entity.stats.health;
        this.maxEnergy = this.entity.stats.energy;
        this.energy = this.maxEnergy;
        this.score = 0;

        this.weapons = settings.weapons;
        this.spells = settings.spells;
        this.weaponIndex = 0;
        this.spellIndex = 0;

        this.cooldown = settings.weapons[this.weaponIndex].cooldown;

        this.attacking = false;
        this.canSwitchWeapon = true;
        this.canSwitchSpell = true;

        this.targetPosition = {x: this.position.x, y: this.position.y};
    }

    update() {
        if (this.health <= 0) {
            this.health = 0;
            this.game.gameOver = true;
        } else {
            this.energy += 0.02;
            if (this.energy > this.maxEnergy) {
                this.energy = this.maxEnergy;
            }
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
            }
        }
    }

    updateDirection(dx, dy) {
        if (!this.attacking && Math.abs(dx) - Math.abs(dy) > 0) {
            if (dx > 0) {
                this.status = 'right';
            } else {
                this.status = 'left';
            }
        } else {
            if (dy > 0) {
                this.status = 'down';
            } else {
                this.status = 'up';
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
            }
        }
        return this.status;
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

    attack() {
        const sprite = new Weapon(this.game, this);
        this.cooldown = this.weapons[this.weaponIndex].cooldown;
        this.groups.visibleSprites.push(sprite);
        this.groups.attackSprites.push(sprite);
        this.attacking = true;
        this.attackTime = this.game.uptime;
        this.status = this.status.split('-')[0] + '-attack';
    }

    castMagic() {
        const spell = this.spells[this.spellIndex];
        if (this.energy >= spell.cost) {
            this.cooldown = spell.cooldown;
            this.attacking = true;
            this.attackTime = this.game.uptime;
            this.status = this.status.split('-')[0] + '-attack';
            this.energy -= spell.cost;
            let particles = this.animationPlayer.createParticles('aura', this, 0, 0);
            this.groups.visibleSprites.push(particles);
            this.groups.particleSprites.push(particles);
            switch (spell.name) {
                case 'fire':
                    let offsets = {x: 0, y: 0};
                    switch (this.status.split('-')[0]) {
                        case 'left':
                            offsets.x = this.width * -1;
                            break;
                        case 'right':
                            offsets.x = this.width;
                            break;
                        case 'up':
                            offsets.y = this.height * -1;
                            break;
                        case 'down':
                            offsets.y = this.height;
                            break;
                    }
                    for (let i = 1; i < 6; i++) {
                        let xOffset = (offsets.x + Math.random() * 4 - 2) * i;
                        let yOffset = (offsets.y + Math.random() * 4 - 2) * i;
                        let flame = this.animationPlayer.createParticles('flame', this, xOffset , yOffset, spell.strength);
                        this.groups.visibleSprites.push(flame);
                        this.groups.attackSprites.push(flame);
                    }
                    break;
                case 'heal':
                    this.health += spell.strength;
                    let particles = this.animationPlayer.createParticles('heal', this, 0, -15);
                    this.groups.visibleSprites.push(particles);
                    this.groups.particleSprites.push(particles);
                    if (this.health > this.maxHealth) {
                        this.health = this.maxHealth;
                    }
                    break;
            }
        }
    }
}