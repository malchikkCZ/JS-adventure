export class Player {

    constructor(game) {
        this.image = document.getElementById("imgPlayer");
        this.game = game;

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.position = {x: this.gameWidth / 2, y: this.gameHeight / 2};
        this.size = 64;

        this.speed = {x: 0, y: 0};
        this.maxSpeed = 3;
    }

    update(deltaTime) {
        let speed_vect = Math.sqrt(this.speed.x * this.speed.x + this.speed.y * this.speed.y);
        if (speed_vect > 0) {
            speed_vect = 1 / speed_vect;
        }
        this.position.x += this.speed.x * this.maxSpeed * speed_vect;
        this.position.y += this.speed.y * this.maxSpeed * speed_vect;
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
}
