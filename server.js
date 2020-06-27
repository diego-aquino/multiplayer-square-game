import express from 'express';
import http from 'http';
import createGame from './public/game.js';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);

app.use(express.static('public'));

const game = createGame();

game.subscribe(command => {
    console.log(`> Emitting ${command.type}`);
    sockets.emit(command.type, command);
});

game.start();

sockets.on('connection', (socket) => {
    const playerId = socket.id;
    console.log(`> Player connected: ${playerId}`);

    game.addPlayer({ playerId });

    socket.emit('setup', {
        state: game.state,
        screenWidth: game.state.screen.width,
        screenHeight: game.state.screen.height
    });

    socket.on('disconnect', () => {
        game.removePlayer({ playerId });
        console.log(`> Player disconnected: ${playerId}`);
    });

    socket.on('move-player', command => {
        command.playerId = playerId;
        command.type = 'move-player';

        game.movePlayer(command);
    });
});

server.listen(3000, () => {
    console.log('> Server listening on port 3000');
});
