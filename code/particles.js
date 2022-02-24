// import settings
import { settings } from './settings.js';


export class AnimationPlayer {

    constructor() {
        this.animations = {
            aura: {
                image: document.getElementById('aura'),
                frames: [[0, 0], [1, 0], [2, 0], [3, 0]],
                frameSize: [48, 48]
            },
            flame: {
                image: document.getElementById('flame'),
                frames: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0]],
                frameSize: [15, 24]
            },
            heal: {
                image: document.getElementById('heal'),
                frames: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
                frameSize: [32, 32]
            }
        };
    }

    createParticles(animationType, sprite, xOffset, yOffset, damage) {
        const animation = this.animations[animationType];
        return new ParticleEffect(sprite, animation, xOffset, yOffset, damage);
    }
}


export class ParticleEffect {

    constructor(sprite, animation, xOffset, yOffset, damage) {
        this.width = animation.frameSize[0];
        this.height = animation.frameSize[1];
        this.position = {
            x: sprite.position.x + sprite.width/2 - this.width/2 + xOffset,
            y: sprite.position.y + yOffset
        };

        this.frameIndex = 0;
        this.animationFrames = animation.frames;
        this.animationSpeed = settings.general.animationSpeed;
        this.animationFrame = this.getAnimationFrame();
        this.image = animation.image;

        this.killed = false;

        if (damage) {
            this.damage = damage;
            this.cooldown = 500;
        }
    }

    getAnimationFrame() {
        this.frameIndex = this.frameIndex + this.animationSpeed / 100;
        if (this.frameIndex >= this.animationFrames.length) {
            this.killed = true;
        }
        return this.animationFrames[Math.floor(this.frameIndex)];
    }

    update() {
        this.animationFrame = this.getAnimationFrame();
    }

    draw(ctx, posX, posY) {
        let animationFramePosX = this.animationFrame[0] * this.width;
        let animationFramePosY = this.animationFrame[1] * this.height;
        ctx.drawImage(this.image, animationFramePosX, animationFramePosY,
            this.width, this.height, this.position.x + posX, this.position.y + posY, this.width, this.height);
    }
}