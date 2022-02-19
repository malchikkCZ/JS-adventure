export class InputHandler {

    constructor(player, game) {

        // keyboard controls
        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            if (!player.attacking) {
                switch (event.key) {
                    case 'ArrowLeft':
                        player.move('left');
                        break;
                    case 'ArrowRight':
                        player.move('right');
                        break;
                    case 'ArrowUp':
                        player.move('up');
                        break;
                    case 'ArrowDown':
                        player.move('down');
                        break;
                    case ' ' || 'Spacebar':
                        player.attack();
                        break;
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            event.preventDefault();
            switch (event.key) {
                case 'ArrowLeft':
                    if (player.speed.x < 0) {
                        player.speed.x = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (player.speed.x > 0) {
                        player.speed.x = 0;
                    }
                    break;
                case 'ArrowUp':
                    if (player.speed.y < 0) {
                        player.speed.y = 0;
                    }
                    break;
                case 'ArrowDown':
                    if (player.speed.y > 0) {
                        player.speed.y = 0;
                    }
                    break;
            }
        });

        // mouse controls
        document.addEventListener('mousemove', followMouse);
        document.addEventListener('mousedown', followMouse);

        function followMouse(event) {
            event.preventDefault();
            if (!player.attacking && event.target.id === 'gameScreen' && event.buttons === 1) {
                let offsetX = game.gameWidth / 2 - player.position.x - player.width / 2;
                let offsetY = game.gameHeight / 2 - player.position.y - player.height / 2;
                let mouseX = event.clientX - event.target.offsetLeft - offsetX;
                let mouseY = event.clientY - event.target.offsetTop - offsetY;
                player.targetPosition = {x: mouseX, y: mouseY};
                player.moveTowards(player.targetPosition);
            } else {
                player.stopMovingTowards();
            }
        }

        document.addEventListener('mouseup', (event) => {
            player.stopMovingTowards();
        });

        document.addEventListener('mousedown', (event) => {
            event.preventDefault();
            if (!player.attacking && event.target.id === 'gameScreen' &&
                (event.buttons === 2 || event.buttons === 3)) {
                player.attack();
            }
        });
    }
}