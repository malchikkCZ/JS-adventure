// import settings
import { settings } from './settings.js';


export class UI {

    constructor(game, player) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.tileSize = game.tileSize;

        this.player = player;
        this.weaponImages = [];
        this.weaponIndex = player.weaponIndex;

        player.weapons.forEach((weapon) => {
            const weaponImage = document.getElementById(weapon.name + '-full')
            this.weaponImages.push(weaponImage);
        })

        // dimensions
        this.stroke = settings.ui.stroke;
        this.healthBarWidth = settings.ui.healthBarWidth;
        this.barHeight = settings.ui.barHeight;

        // colors
        this.strokeColor = settings.ui.colors.stroke;
        this.activeColor = settings.ui.colors.active;
        this.bgColor = settings.ui.colors.background;
        this.healthColor = settings.ui.colors.healthBar;

        // info text
        this.scoreFont = settings.ui.normalFont;
        this.gameOverFont = settings.ui.bigFont;
        this.textColor = settings.ui.colors.text;
    }

    draw(ctx) {
        // health bar
        ctx.fillStyle = this.strokeColor;
        ctx.fillRect(10, 10, this.healthBarWidth, this.barHeight);
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(10 + this.stroke, 10 + this.stroke,
            this.healthBarWidth - this.stroke * 2, this.barHeight - this.stroke * 2);
        if (this.player.health > 0) {
            const ratio = this.player.health / this.player.maxHealth;
            ctx.fillStyle = this.healthColor;
            ctx.fillRect(10 + this.stroke, 10 + this.stroke,
                this.healthBarWidth * ratio - this.stroke * 2, this.barHeight  - this.stroke * 2);    
        }
        
        // weapon select box
        ctx.fillStyle = this.strokeColor;
        if (!this.player.canSwitchWeapon) {
            ctx.fillStyle = this.activeColor;
        }
        ctx.fillRect(10, this.gameHeight - 90, 80, 80);
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(10 + this.stroke, this.gameHeight - 90 + this.stroke, 80 - this.stroke * 2, 80 - this.stroke * 2);
        const weaponImage = this.weaponImages[this.player.weaponIndex];
        ctx.drawImage(weaponImage, 50 - weaponImage.width / 2, this.gameHeight - 50 - weaponImage.height / 2, 
            weaponImage.width, weaponImage.height)

        // experience counter
        ctx.font = this.scoreFont;
        ctx.textAlign = 'right';
        const scoreText = 'Score: ' + this.player.score;
        const textWidth = ctx.measureText(scoreText).width + 30;
        const textHeight = 26;
        this.writeOnScreen(ctx, this.gameWidth - 10 - textWidth, this.gameHeight - 10 - textHeight, 
            textWidth, textHeight, this.gameWidth - 24, this.gameHeight - 16, scoreText)
    }

    writeOnScreen(ctx, posX, posY, width, height, topOffset, leftOffset, message) {
        ctx.fillStyle = this.strokeColor;
        ctx.fillRect(posX, posY, width, height);
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(posX + this.stroke, posY + this.stroke, width - this.stroke * 2, height - this.stroke * 2);
        ctx.fillStyle = this.textColor;
        ctx.fillText(message, topOffset, leftOffset);
    }

    showGameOver(ctx, message) {
        ctx.font = this.gameOverFont;
        ctx.textAlign = 'center';
        const textWidth = ctx.measureText(message).width + 60;
        const textHeight = 40;
        this.writeOnScreen(ctx, this.gameWidth / 2 - textWidth / 2, this.gameHeight / 2 - textHeight / 2,
            textWidth, textHeight, this.gameWidth / 2 + 1, this.gameHeight / 2 + 11, message);
    }
}