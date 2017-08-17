const express = require('express');
const reload = require('reload');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.get('/', (req, res) => res.render('home'));
server.listen(3000, () => console.log('Server started!'));
reload(app);

//arrUsername
const arrUsername = [];
const arrSignedSocket = [];

io.on('connection', socket => {
    socket.on('CLIENT_SIGN_UP', username => {
        const isEsixt = arrUsername.indexOf(username) > -1;
        if (isEsixt) return socket.emit('PICK_ANOTHER_USERNAME');
        socket.username = username; //1
        socket.emit('SIGN_UP_SUCCESSFULLY', arrUsername);
        arrUsername.push(username);
        arrSignedSocket.push(socket);
        io.emit('NEW_USER_SIGN_UP', username);
    });

    socket.on('CLIENT_SEND_MESSAGE', message => {
        io.emit('NEW_MESSAGE', `${socket.username}: ${message}`);
    });

    socket.on('CLIENT_SEND_PRIVATE_MESSAGE', messageObj => {
        const { message, receiver } = messageObj;
        const receiverSocket = arrSignedSocket.find(s => s.username === receiver);
        socket.to(receiverSocket.id)
            .emit('NEW_PRIVATE_MESSAGE', `${socket.username}: ${message}`);
        socket.emit('NEW_PRIVATE_MESSAGE', `${socket.username}: ${message}`);
    });

    socket.on('CLIENT_JOIN_ROOM', roomName => {
        if (socket.roomName) socket.leave(socket.roomName);
        socket.roomName = roomName;
        socket.join(roomName);
    });

    socket.on('CLIENT_SEND_ROOM_MESSAGE', (messageObj) => {
        const { roomName, message } = messageObj;
        io.in(roomName).emit('NEW_ROOM_MESSAGE', `${socket.username}: ${message}`);
    });

    socket.on('disconnect', () => {
        const index = arrUsername.indexOf(socket.username);
        if (index > -1) arrUsername.splice(index, 1);
        io.emit('USER_DISCONNECT', socket.username);
    });
});
