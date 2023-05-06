const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/introductionPage.html');
});

app.get('/introductionPage', (req, res) => {
    res.sendFile(__dirname + '/html/introductionPage.html');   
})

app.get('/aboutPage', (req, res) => {
    res.sendFile(__dirname + '/html/aboutPage.html');   
})

app.get('/chattingPage', (req, res) => {
    res.sendFile(__dirname + '/html/chattingPage.html');   
})

app.post('/chatBox', (req, res) => {
    let userName = req.body.userName;
    res.render('chatBox', { userName: userName });
});


let onlineUsers = new Set();

io.on('connection', (socket) => {
    socket.on('User', (username) => {
        socket.username = username;
        io.emit('userConnected', username);

        onlineUsers.add(username);
        io.emit('updateUserList', Array.from(onlineUsers));
    });

    socket.on('disconnect', () => {
        const username = socket.username
        io.emit('userDisconnected', username);

        const disconnectedUser = socket.username;
        onlineUsers.delete(disconnectedUser);
        io.emit('updateUserList', Array.from(onlineUsers));
    });

    socket.on('clicked', (msg) => {
        io.emit('msgReceived',msg);
    });

    socket.on('typing', (msg) => {
        io.emit('userIsTyping', msg)
    });

    socket.on('stopTyping', (msg) => {
        io.emit('userStopsTyping', msg)
    });
});

http.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});