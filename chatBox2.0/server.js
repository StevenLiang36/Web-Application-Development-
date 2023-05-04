// const app = require('express')();
// const bodyParser = require('body-parser');
//
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
//
// // const app = express();
// const port = 3000;
//
// app.use(bodyParser.urlencoded({ extended: true }));
//
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });
//
// app.post('/chatBox', (req, res) => {
//     let userName = req.body.userName;
//     res.send('Hello! ' + userName);
// });
//
// io.on('connection', (socket) => {
//     console.log('A user connected');
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });
//
// app.listen(port, () => {
// console.log(`Example app listening on port ${port}`)
// });

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// const http = require('http').createServer(app);
const http = require('http').Server(app);
const io = require('socket.io')(http);

const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 如何实现：跳转到chatBox后，hello后可以接收到用户在index页输入的名字？
// 按道理来说是要用EJS的，因为html需要接受传过来的用户名
// 没错！就是用EJS!!!

app.post('/chatBox', (req, res) => {
    let userName = req.body.userName;
    // res.send('Hello! ' + userName);
    // res.sendFile(__dirname + '/chatBox.ejs');
    res.render('chatBox', { userName: userName });
});


let onlineUsers = new Set();

io.on('connection', (socket) => {
    // console.log('A user connected');
    io.emit('userConnected', 'A user connected');

    socket.on('addUser', (username) => {
        onlineUsers.add(username);
        io.emit('updateUserList', Array.from(onlineUsers));
    });

    socket.on('disconnect', () => {
        // console.log('A user disconnected');
        io.emit('userDisconnected', 'A user disconnected');
        // io.emit('userQuit')

        // const disconnectedUser = getUsernameFromSocket(socket);
        // 用户退出问题应该出在这：get不到username！！
        const disconnectedUser = socket.username;

        onlineUsers.delete(disconnectedUser);
        io.emit('updateUserList', Array.from(onlineUsers));
    });

    socket.on('clicked', (msg) => {
        io.emit('msgReceived',msg);
    })

    socket.on('typing', (msg) => {
        io.emit('userIsTyping', msg)
    } )
    socket.on('stopTyping', (msg) => {
        io.emit('userStopsTyping', msg)
    } )

    // socket.on('username', (msg) => {
    //     io.emit('userEnter', msg)
    // })

});

// function getUsernameFromSocket(socket) {
//   return socket.handshake.query.username;
// }



// chatGPT的socket版本：
// io.on('connection', (socket) => {
//     console.log('A user connected');
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//         io.emit('chat message', msg);
//     });
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

http.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});