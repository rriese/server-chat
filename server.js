/* 
	Módulos necessários para o servidor
 */
const express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    server = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
// Base de dados das mensagens
var messages = [];

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

// Para cada conexão, retorna as mensagens salvas para a tela e ouve a thread
io.on('connection', socket => {
    console.log(`User connected on socket ${socket.id}`);

    socket.emit('getAllMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('returnMessage', data);
    });
});

server.listen(port, server);
