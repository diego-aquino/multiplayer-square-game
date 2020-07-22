export default function createGame() {
    const PLAYER_SIZE = 1;

    const state = {
        players: {},
        numberOfPlayers: 0,

        fruits: {},
        numberOfFruits: 0,

        screen: {
            width: 10,
            height: 10
        }
    };

    const FRUIT_LIMIT = state.screen.width + state.screen.height;

    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function setState(newState) {
        Object.assign(state, newState);
    }

    function addPlayer(command) {
        const { playerId } = command;
        const playerX = ('playerX' in command) ? command.playerX : Math.floor(Math.random() * state.screen.width);
        const playerY = ('playerY' in command) ? command.playerY : Math.floor(Math.random() * state.screen.height);

        state.players[playerId] = {
            x: playerX,
            y: playerY,
            points: 0
        };
        state.numberOfPlayers++;

        notifyAll({
            type: 'add-player',
            playerId,
            playerX,
            playerY
        });
    }

    function removePlayer(command) {
        const { playerId } = command;

        if (state.players[playerId]) {
            delete state.players[playerId];
            state.numberOfPlayers--;

            notifyAll({
                type: 'remove-player',
                playerId
            });
        }
    }

    function start() {
        const frequency = 2000;

        setInterval(addFruit, frequency);
    }

    function addFruit(command) {
        if (state.numberOfFruits < FRUIT_LIMIT) {
            const fruitId = (command) ? command.fruitId : Math.floor(Math.random() * 1000000);
            const fruitX = (command) ? command.fruitX : Math.floor(Math.random() * state.screen.width);
            const fruitY = (command) ? command.fruitY : Math.floor(Math.random() * state.screen.height);

            state.fruits[fruitId] = {
                x: fruitX,
                y: fruitY
            };
            state.numberOfFruits++;

            notifyAll({
                type: 'add-fruit',
                fruitId,
                fruitX,
                fruitY
            });
        }
    }

    function removeFruit(command) {
        const { fruitId } = command;

        if (state.fruits[fruitId]) {
            delete state.fruits[fruitId];
            state.numberOfFruits--;

            notifyAll({
                type: 'remove-fruit',
                fruitId
            });
        }
    }

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowUp(player) {
                if (player.y > 0) {
                    player.y--;
                }
                else if (player.y == 0) {
                    player.y = state.screen.height - 1;
                }
            },
            ArrowDown(player) {
                if (player.y + PLAYER_SIZE < state.screen.height) {
                    player.y++;
                }
                else if (player.y + PLAYER_SIZE == state.screen.height) {
                    player.y = 0;
                }
            },
            ArrowLeft(player) {
                if (player.x > 0) {
                    player.x--;
                }
                else if (player.x == 0) {
                    player.x = state.screen.width - 1;
                }
            },
            ArrowRight(player) {
                if (player.x + PLAYER_SIZE < state.screen.width) {
                    player.x++;
                }
                else if (player.x + PLAYER_SIZE == state.screen.width) {
                    player.x = 0;
                }
            }
        };

        const { playerId, keyPressed } = command;

        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction) {
            moveFunction(player);

            notifyAll({
                type: 'move-player',
                playerId,
                keyPressed
            });

            checkForFruitCollision(playerId);
        }
    }

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId];

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];

            if (player.x == fruit.x && player.y == fruit.y) {
                removeFruit({ fruitId });
                rewardPlayer({ playerId, rewardPoints: 1 });
            }
        }
    }

    function rewardPlayer(command) {
        const { playerId, rewardPoints } = command;
        const player = state.players[playerId];

        player.points += rewardPoints;
    }

    return {
        state,
        subscribe,
        setState,
        addPlayer,
        removePlayer,
        start,
        addFruit,
        removeFruit,
        movePlayer
    };
}
