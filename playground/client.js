const screen = document.getElementById("screen");
const context = screen.getContext("2d");

const currentPlayerId = "player1";
const PLAYER_SIZE = 1;

const game = createGame();

function createGame() {    
    const state = {
        players: {
            "player1": { x: 1, y: 1 },
            "player2": { x: 9, y: 9 },
        },
        fruits: {
            "fruit1": { x: 3, y: 1 }
        }
    };

    function movePlayer(command) {
        console.log(`Moving ${command.playerId} with ${command.keyPressed}`);

        const keyPressed = command.keyPressed;
        const player = state.players[command.playerId];

        if (keyPressed == "ArrowUp" && player.y > 0) {
            player.y--;
        }
        else if (keyPressed == "ArrowDown" && player.y + PLAYER_SIZE < screen.height) {
            player.y++;
        }
        else if (keyPressed == "ArrowLeft" && player.x > 0) {
            player.x--;
        }
        else if (keyPressed == "ArrowRight" && player.x + PLAYER_SIZE < screen.width) {
            player.x++;
        }
    }

    return {
        state,
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
        console.log(`Notifying ${state.observers.length} observers`);

        for (const observerFunction of state.observers) {
            observerFunction(command);
        }
    }

    document.addEventListener("keydown", handleKeydown);

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
        context.fillStyle = "black";
        context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    }

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = "green";
        context.fillRect(fruit.x, fruit.y, PLAYER_SIZE, PLAYER_SIZE);
    }

    requestAnimationFrame(renderScreen);
})();
