export default function createGame() {
    const PLAYER_SIZE = 1;

    const state = {
        players: {},
        fruits: {},
        screen: {
            width: 10,
            height: 10
        }
    };

    function addPlayer(command) {
        const { playerId, playerX, playerY } = command;

        state.players[playerId] = {
            x: playerX,
            y: playerY
        };
    }

    function removePlayer(command) {
        const { playerId } = command;

        delete state.players[playerId];
    }
    
    function addFruit(command) {
        const { fruitId, fruitX, fruitY } = command;

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };
    }

    function removeFruit(command) {
        const { fruitId } = command;

        delete state.fruits[fruitId];
    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y > 0) {
                    player.y--;
                }
            },
            ArrowDown(player) {
                if (player.y + PLAYER_SIZE < state.screen.height) {
                    player.y++;
                }
            },
            ArrowLeft(player) {
                if (player.x > 0) {
                    player.x--;
                }
            },
            ArrowRight(player) {
                if (player.x + PLAYER_SIZE < state.screen.width) {
                    player.x++;
                }
            }
        };

        const { keyPressed, playerId } = command;

        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(playerId);
        }
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId];

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];

            console.log(`Checking for collision between player '${playerId}' and fruit '${fruitId}'`);

            if (player.x == fruit.x && player.y == fruit.y) {
                console.log(`COLLISION: player '${playerId}' - fruit '${fruitId}'`);
                removeFruit({ fruitId });
            }
        }
    }

    return {
        state,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer
    };
}
