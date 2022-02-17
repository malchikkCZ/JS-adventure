export class Player {

    constructor(game, r, c) {
        this.image = document.getElementById("imgPlayer");
        this.game = game;

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.size = 64;
        this.position = {x: c * this.size, y: r * this.size};

        this.speed = {x: 0, y: 0};
        this.maxSpeed = 3;
    }

    reposition(r, c) {
        this.position.x = c * this.size;
        this.position.y = r * this.size;
    }

    update(deltaTime) {
        let speed_vect = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
        if (speed_vect > 0) {
            speed_vect = 1 / speed_vect;
        }
        this.position.x += this.speed.x * this.maxSpeed * speed_vect;
        this.collision('horizontal');
        this.position.y += this.speed.y * this.maxSpeed * speed_vect;
        this.collision('vertical');
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.size,
            this.size
        );
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

    collision(direction) {
        for (let sprite of this.game.obstacle_sprites) {
            if (this.position.x + this.size > sprite.position.x &&
                this.position.x < sprite.position.x + sprite.size &&
                this.position.y + this.size > sprite.position.y + sprite.offset &&
                this.position.y < sprite.position.y + sprite.size - sprite.offset) {
                    console.log('collide');
                    switch (direction) {
                        case 'horizontal':
                            if (this.speed.x > 0) {
                                this.position.x = sprite.position.x - this.size;
                            }
                            if (this.speed.x < 0) {
                                this.position.x = sprite.position.x + sprite.size;
                            }
                            break;
                        case 'vertical':
                            if (this.speed.y > 0) {
                                this.position.y = sprite.position.y - this.size + sprite.offset;
                            }
                            if (this.speed.y < 0) {
                                this.position.y = sprite.position.y + sprite.size - sprite.offset;
                            }
                            break;
                    }
            }
        }
    }
}