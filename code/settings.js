export const settings = {
    general: {
        tileSize: 32,
        backgroundColor: '#71ddee'
    },
    ui: {
        stroke: 3,
        barHeight: 20,
        healthBarWidth: 200,
        itemBoxSize: 80,
        colors: {
            stroke: '#000000',
            activeStroke: '#FFD700',
            background: '#222222',
            healthBar: '#FF0000'
        }
    },
    player: {
        animationSpeed: 20,
        stats: {
            health: 100,
            speed: 2
        },
        maxStats: {
            health: 300,
            speed: 10
        }
    },
    weapons: [
        { 
            name: 'sword',
            cooldown: 300,
            damage: 15
        },
        {
            name: 'lance',
            cooldown: 800,
            damage: 30
        },
        {
            name: 'axe',
            cooldown: 600,
            damage: 20
        },
        {
            name: 'rapier',
            cooldown: 100,
            damage: 8
        },
        {
            name: 'sai',
            cooldown: 200,
            damage: 10
        }
    ]
}