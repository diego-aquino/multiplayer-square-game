export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
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
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
    });
}
