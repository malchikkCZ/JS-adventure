export class Weapon {
    constructor(game, player) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;
        this.scale = game.scale;
        this.groups = game.groups;

        this.player = player;
        this.direction = player.status.split('-')[0];
        this.type = player.weapon;

        this.image = document.getElementById(this.type + '-' + this.direction);

        this.width = this.image.width * this.scale;
        this.height = this.image.height * this.scale;
        this.position = {x: 0, y: 0};

        switch (this.direction) {
            case 'down':
                this.position.x = this.player.position.x + 6;
                this.position.y = this.player.position.y + this.player.height;
                break;
            case 'right':
                this.position.x = this.player.position.x + this.player.width;
                this.position.y = this.player.position.y + this.height + 8;
                break;
            case 'up':
                this.position.x = this.player.position.x + 6;
                this.position.y = this.player.position.y - this.height;
                break;
            case 'left':
                this.position.x = this.player.position.x - this.width;
                this.position.y = this.player.position.y + this.height + 8;
        }

        this.cooldown = 400;
        this.creationTime = game.uptime;
        this.killed = false;
    }

    update() {
        if (this.game.uptime >= this.creationTime + this.cooldown) {
            this.killed = true;
        } else {
            this.groups.attackableSprites.forEach((sprite) => {
                if (this.position.x + this.width > sprite.position.x &&
                    this.position.x < sprite.position.x + sprite.width &&
                    this.position.y + this.height > sprite.position.y &&
                    this.position.y < sprite.position.y + sprite.height) {
                        sprite.killed = true;
                }
            });
        }
    }

    draw(ctx, player) {
        let posX = this.position.x + this.gameWidth / 2 - player.position.x - player.width / 2;
        let posY = this.position.y + this.gameHeight / 2 - player.position.y - player.height / 2;
        ctx.drawImage(this.image, posX, posY, this.width, this.height);
    }
}