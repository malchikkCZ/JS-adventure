export const settings = {
    general: {
        tileSize: 32,
        backgroundColor: '#71ddee',
        animationSpeed: 20
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
    entities: {
        '390': {
            name: 'bamboo',
            size: 32,
            animationFrames: {
                'idle': [[0, 0], [1, 0], [2, 0], [3, 0]]
            },
            stats: {
                health: 70,
                speed: 1,
                attackRadius: 25,
                noticeRadius: 150,
                damage: 6,
                resistance: 3
            }
        },
        '391': {
            name: 'spirit',
            size: 32,
            animationFrames: {
                'idle': [[0, 0], [1, 0], [2, 0], [3, 0]]
            },
            stats: {
                health: 100,
                speed: 2,
                attackRadius: 30,
                noticeRadius: 175,
                damage: 8,
                resistance: 3
            }
        },
        '392': {
            name: 'raccoon',
            size: 120,
            animationFrames: {
                'idle': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]]
            },
            stats: {
                health: 300,
                speed: 1,
                attackRadius: 60,
                noticeRadius: 200,
                damage: 40,
                resistance: 3
            }
        },
        '393': {
            name: 'squid',
            size: 32,
            animationFrames: {
                'idle': [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]
            },
            stats: {
                health: 100,
                speed: 2,
                attackRadius: 40,
                noticeRadius: 180,
                damage: 20,
                resistance: 3
            }
        },
        '394': {
            name: 'player',
            size: 32,
            animationFrames: {
                'down-idle': [[0, 0]],
                'right-idle': [[0, 1]],
                'up-idle': [[0, 2]],
                'left-idle': [[0, 3]],
                'down': [[0, 0], [1, 0], [2, 0], [3, 0]],
                'right': [[0, 1], [1, 1], [2, 1], [3, 1]],
                'up': [[0, 2], [1, 2], [2, 2], [3, 2]],
                'left': [[0, 3], [1, 3], [2, 3], [3, 3]],
                'down-attack': [[4, 0]],
                'right-attack': [[4, 1]],
                'up-attack': [[4, 2]],
                'left-attack': [[4, 3]]
            },
            stats: {health: 100, speed: 3},
            maxStats: {health: 300, speed: 10}
        }
    },
    weapons: [
        {name: 'sword', cooldown: 300, damage: 15},
        {name: 'lance', cooldown: 800, damage: 30},
        {name: 'axe', cooldown: 600, damage: 20},
        {name: 'rapier', cooldown: 100, damage: 8},
        {name: 'sai', cooldown: 200, damage: 10}
    ],
}