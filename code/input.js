export class InputHandler {

    constructor(player, game) {
        document.addEventListener('keydown', (event) => {
            if (!player.attacking) {
                switch(event.key) {
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
            event.preventDefault();
        });

        document.addEventListener('keyup', (event) => {
            switch(event.key) {
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
            event.preventDefault();
        });
    }

}