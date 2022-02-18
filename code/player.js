export class Player {

    constructor(game, r, c) {
        this.image = document.getElementById('player');
        this.game = game;

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;
        this.scale = game.scale

        this.width = this.tileSize;
        this.height = this.tileSize;
        this.verticalOffset = 5;

        this.position = {x: c * this.tileSize, y: r * this.tileSize};

        this.speed = {x: 0, y: 0};
        this.maxSpeed = 3;
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

    draw(ctx, player) {
        let posX = this.position.x + this.gameWidth / 2 - player.position.x - player.width / 2;
        let posY = this.position.y + this.gameHeight / 2 - player.position.y - player.height / 2;
        ctx.drawImage(
            this.image,
            posX,
            posY,
            this.width,
            this.height
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
        for (let sprite of this.game.obstacleSprites) {
            if (this.position.x + this.width - this.verticalOffset > sprite.position.x &&
                this.position.x + this.verticalOffset < sprite.position.x + sprite.width &&
                this.position.y + this.height > sprite.position.y + sprite.offset &&
                this.position.y < sprite.position.y + sprite.height - sprite.offset) {
                    console.log('collide');
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