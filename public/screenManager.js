export default function createScreenManager(command) {
    const { document, screen, game, requestAnimationFrame } = command;

    function renderGameScreen(currentPlayerId) {
        const PLAYER_SIZE = 1;

        const context = screen.getContext('2d');

        const screenWidth = game.state.screen.width;
        const screenHeight = game.state.screen.height;
        context.clearRect(0, 0, screenWidth, screenHeight);

        for (const fruitId in game.state.fruits) {
            const fruit = game.state.fruits[fruitId];
            context.fillStyle = 'green';
            context.fillRect(fruit.x, fruit.y, PLAYER_SIZE, PLAYER_SIZE);
        }

        for (const playerId in game.state.players) {
            const player = game.state.players[playerId];
            context.fillStyle = (playerId == currentPlayerId) ? '#F0DB4F' : 'black';
            context.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
        }

        requestAnimationFrame(() => {
            renderGameScreen(currentPlayerId);
        });
    }

    function renderRanking() {
        const rankingUl = document.querySelector('#ranking-ul');
        rankingUl.innerHTML = '';

        for (let i = 0; i < game.state.numberOfPlayers; i++) {
            let playerId = game.state.playerRanking[i];
            const player = game.state.players[playerId];

            const playerLi = document.createElement('li');

            if (playerId.length > 15) {
                playerId = `${playerId.slice(0, 16)}...`;
            }

            playerLi.innerText = `${i+1}: ${playerId} (${player.points})`;

            rankingUl.appendChild(playerLi);
        }
    }

    return {
        renderGameScreen,
        renderRanking
    };
}
