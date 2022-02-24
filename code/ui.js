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
        this.spellImages = [];
        this.weaponIndex = player.weaponIndex;
        this.spellIndex = player.spellIndex;

        player.weapons.forEach((weapon) => {
            const weaponImage = document.getElementById(weapon.name + '-full')
            this.weaponImages.push(weaponImage);
        })

        player.spells.forEach((spell) => {
            const spellImage = document.getElementById(spell.name + '-full')
            this.spellImages.push(spellImage);
        })

        // dimensions
        this.stroke = settings.ui.stroke;
        this.healthBarWidth = settings.ui.healthBarWidth;
        this.magicBarWidth = settings.ui.magicBarWidth;
        this.barHeight = settings.ui.barHeight;

        // colors
        this.strokeColor = settings.ui.colors.stroke;
        this.activeColor = settings.ui.colors.activeStroke;
        this.bgColor = settings.ui.colors.background;
        this.healthColor = settings.ui.colors.healthBar;
        this.magicColor = settings.ui.colors.magicBar;

        // info text
        this.scoreFont = settings.ui.normalFont;
        this.gameOverFont = settings.ui.bigFont;
        this.textColor = settings.ui.colors.text;
    }

    draw(ctx) {
        // health and magic bar
        this.drawBar(ctx, 10, 10, this.healthBarWidth, this.barHeight, 
            this.player.health / this.player.maxHealth, this.healthColor);
        this.drawBar(ctx, 10, 35, this.magicBarWidth, this.barHeight, 
            this.player.energy / this.player.maxEnergy, this.magicColor)
        
        // weapon and spell select box
        this.drawSelectBox(ctx, !this.player.canSwitchWeapon, 10, this.gameHeight - 100, 80, 80, 
            this.weaponImages[this.player.weaponIndex]);
        this.drawSelectBox(ctx, !this.player.canSwitchSpell, 80, this.gameHeight - 90, 80, 80, 
            this.spellImages[this.player.spellIndex]);

        // experience counter
        ctx.font = this.scoreFont;
        ctx.textAlign = 'right';
        const scoreText = 'Score: ' + this.player.score;
        const textWidth = ctx.measureText(scoreText).width + 30;
        const textHeight = 26;
        this.writeOnScreen(ctx, this.gameWidth - 10 - textWidth, this.gameHeight - 10 - textHeight, 
            textWidth, textHeight, this.gameWidth - 24, this.gameHeight - 16, scoreText)
    }

    drawBar(ctx, leftOffset, topOffset, width, height, ratio, fillColor) {
        ctx.fillStyle = this.strokeColor;
        ctx.fillRect(leftOffset, topOffset, width, height);
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(leftOffset + this.stroke, topOffset + this.stroke,
            width - this.stroke * 2, height - this.stroke * 2);
        if (ratio > 0) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(leftOffset + this.stroke, topOffset + this.stroke,
                width * ratio - this.stroke * 2, height  - this.stroke * 2);    
        }
    }

    drawSelectBox(ctx, isActive, leftOffset, topOffset, posX, posY, weaponImage) {
        ctx.fillStyle = this.strokeColor;
        if (isActive) {
            ctx.fillStyle = this.activeColor;
        }
        ctx.fillRect(leftOffset, topOffset, posX, posY);
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(leftOffset + this.stroke, topOffset + this.stroke, posX - this.stroke * 2, posY - this.stroke * 2);
        ctx.drawImage(weaponImage, leftOffset + posX / 2 - weaponImage.width / 2, 
            topOffset + posY / 2 - weaponImage.height / 2, weaponImage.width, weaponImage.height)
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