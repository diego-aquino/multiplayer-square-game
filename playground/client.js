const screen = document.getElementById('screen');
const context = screen.getContext('2d');

const currentPlayerId = 'player1';
const PLAYER_SIZE = 1;

const game = createGame();
game.addPlayer({ playerId: 'player1', playerX: 2, playerY: 5});
game.addPlayer({ playerId: 'player2', playerX: 4, playerY: 1});
game.addFruit({ fruitId: 'fruit1', fruitX: 7, fruitY: 5});
game.addFruit({ fruitId: 'fruit2', fruitX: 3, fruitY: 8});

function createGame() {
    const state = {
        players: {},
        fruits: {}
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
                if (player.y + PLAYER_SIZE < screen.height) {
                    player.y++;
                }
            },
            ArrowLeft(player) {
                if (player.x > 0) {
                    player.x--;
                }
            },
            ArrowRight(player) {
                if (player.x + PLAYER_SIZE < screen.width) {
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

const keyboardListener = createKeyboardListener();
keyboardListener.subscribe(game.movePlayer);

function createKeyboardListener() {
    const state = {
        observers: []
    };

    function subscribe(observerFunction) {
        state.observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    document.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {
        const keyPressed = event.key;

        const command = {
            playerId: currentPlayerId,
            keyPressed
        };

        notifyAll(command);
    }

    return {
        subscribe
    };
}

(function renderScreen() {
    context.clearRect(0, 0, 10, 10);

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        context.fillStyle = 'black';
        context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = 'green';
        context.fillRect(fruit.x, fruit.y, PLAYER_SIZE, PLAYER_SIZE);
    }

    requestAnimationFrame(renderScreen);
})();
