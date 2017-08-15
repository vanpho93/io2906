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

io.on('connection', socket => {
    socket.on('CLIENT_SIGN_UP', username => {
        const isEsixt = arrUsername.indexOf(username) > -1;
        if (isEsixt) return socket.emit('PICK_ANOTHER_USERNAME');
        socket.emit('SIGN_UP_SUCCESSFULLY', arrUsername);
        arrUsername.push(username);
        io.emit('NEW_USER_SIGN_UP', username);
    });
});
