import createKeyboardListener from './keyboardListener.js';
import createGame from './game.js';
import renderScreen from './renderScreen.js';

const game = createGame();
game.addPlayer({ playerId: 'player1', playerX: 2, playerY: 5});
game.addPlayer({ playerId: 'player2', playerX: 4, playerY: 1});
game.addFruit({ fruitId: 'fruit1', fruitX: 7, fruitY: 5});
game.addFruit({ fruitId: 'fruit2', fruitX: 3, fruitY: 8});

const screen = document.getElementById('screen');
renderScreen(screen, game, requestAnimationFrame);

const keyboardListener = createKeyboardListener(document);
keyboardListener.subscribe(game.movePlayer);
