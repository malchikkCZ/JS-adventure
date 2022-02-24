export class InputHandler {

    constructor(player, game) {

        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.player = player;

        // keyboard controls
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            if (!this.player.attacking) {
                switch (event.key) {
                    case 'ArrowLeft':
                        this.player.move('left');
                        break;
                    case 'ArrowRight':
                        this.player.move('right');
                        break;
                    case 'ArrowUp':
                        this.player.move('up');
                        break;
                    case 'ArrowDown':
                        this.player.move('down');
                        break;
                    case ' ' || 'Spacebar':
                        this.player.attack();
                        break;
                    case 'q':
                        if (this.player.canSwitchWeapon) {
                            this.player.canSwitchWeapon = false;
                            this.player.weaponIndex++;
                            if (this.player.weaponIndex > this.player.weapons.length - 1) {
                                this.player.weaponIndex = 0;
                            }
                        }
                        break;
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            event.preventDefault();
            switch (event.key) {
                case 'ArrowLeft':
                    if (this.player.speed.x < 0) {
                        this.player.speed.x = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (this.player.speed.x > 0) {
                        this.player.speed.x = 0;
                    }
                    break;
                case 'ArrowUp':
                    if (this.player.speed.y < 0) {
                        this.player.speed.y = 0;
                    }
                    break;
                case 'ArrowDown':
                    if (this.player.speed.y > 0) {
                        this.player.speed.y = 0;
                    }
                    break;
                case 'q':
                    this.player.canSwitchWeapon = true;
                    break;
            }
        });

        // mouse controls
        document.addEventListener('mousemove', (event) => {
            this.followMouse(event);
        });

        document.addEventListener('mousedown', (event) => {
            this.followMouse(event);
        });

        document.addEventListener('mouseup', () => {
            this.player.speed = {x: 0, y: 0};
        });
    }

    getMouseClickPos(event) {
        let offsetX = this.gameWidth / 2 - this.player.position.x - this.player.width / 2;
        let offsetY = this.gameHeight / 2 - this.player.position.y - this.player.height / 2;
        let mousePos = {
            x: event.clientX - event.target.offsetLeft - offsetX,
            y: event.clientY - event.target.offsetTop - offsetY
        }
        return mousePos;
    }

    followMouse(event) {
        event.preventDefault();
        if (!this.player.attacking && event.target.id === 'gameScreen') {
            let mousePos = this.getMouseClickPos(event);
            let dx = mousePos.x - this.player.position.x;
            let dy = mousePos.y - this.player.position.y;
            switch (event.buttons) {
                case 1:
                    this.player.updateDirection(dx, dy);
                    this.player.speed = {x: dx, y: dy};
                    break;
                case 2:
                case 3:
                    this.player.updateDirection(dx, dy);
                    this.player.attack();
                    break;
            }
        } else {
            this.player.speed = {x: 0, y: 0};
        }
    }
}