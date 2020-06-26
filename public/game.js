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
            y: playerY
        };

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
        const fruitId = (command) ? command.fruitId : Math.floor(Math.random() * 1000000);
        const fruitX = (command) ? command.fruitX : Math.floor(Math.random() * state.screen.width);
        const fruitY = (command) ? command.fruitY : Math.floor(Math.random() * state.screen.height);

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };

        notifyAll({
            type: 'add-fruit',
            fruitId,
            fruitX,
            fruitY
        });
    }

    function removeFruit(command) {
        const { fruitId } = command;

        if (state.fruits[fruitId]) {
            delete state.fruits[fruitId];
    
            console.log(`Fruit ${fruitId} removed`);
    
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
            }
        }
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
