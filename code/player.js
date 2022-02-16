export default class Player {

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
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
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
                this.speed.x = -this.maxSpeed;
                break;
            case 'right':
                this.speed.x = this.maxSpeed;
                break;
            case 'up':
                this.speed.y = -this.maxSpeed;
                break;
            case 'down':
                this.speed.y = this.maxSpeed;
                break;
        }
    }
}
