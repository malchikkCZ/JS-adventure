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
        ctx.drawImage(
            weaponImage, 50 - weaponImage.width / 2, this.gameHeight - 50 - weaponImage.height / 2, weaponImage.width, weaponImage.height
        )
    }
}