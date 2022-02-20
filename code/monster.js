import { Entity } from './entity.js';


export class Monster extends Entity {

    constructor(game, r, c, mapCode) {
        super(game, r, c, mapCode);

        this.cooldown = 300;
    }

    update() {
        if (this.invulnerable && this.game.uptime >= this.hitTime + this.invulnerableTime) {
            this.invulnerable = false;
        }
        if (this.attackTime && this.game.uptime >= this.attackTime + this.cooldown) {
            this.attackTime = 0;
        }
        const dx = this.game.player.position.x - this.width / 2 - this.position.x + this.game.player.width / 2;
        const dy = this.game.player.position.y - this.height / 2 - this.position.y + this.game.player.height / 2;
        const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

        if (distanceToPlayer < this.entity.stats.attackRadius) {
            if (!this.game.player.invulnerable) {
                this.attackTime = this.game.uptime;
                this.game.player.getDamage(this.entity.stats.damage, 1000);
            }
        } 
        if (distanceToPlayer < this.entity.stats.noticeRadius && distanceToPlayer > this.game.player.height) {
            if (!this.attackTime && !this.invulnerable) {
                this.speed = {x: dx, y: dy};
            }
        }
        this.updatePosition();
    }

    updateStatus() {
        return this.status;
    }

    attackResistance() {
        this.speed.x *= 0 - this.entity.stats.resistance;
        this.speed.y *= 0 - this.entity.stats.resistance;
    }
}