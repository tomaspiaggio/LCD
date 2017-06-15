/**
 * Created by Tomas on 6/14/17.
 */

var Particle = require('particle-api-js');
var particle = new Particle();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

// For Particle Login and Auth
particle.login({username: 'tomas.piaggio12@gmail.com', password: 'POUCHpouch12'}).then(
    function(data) {
        token = data.body.access_token;
    },
    function (err) {
        console.log('Could not log in.', err);
    }
);

// Socket.io

io.on('connection', function(socket){
    console.log("User connected");
    socket.on('on', function (msg) {
        // Request Starts Here
        var fnPr = particle.callFunction({ deviceId: '3f0027000247343337373738', name: 'led', argument: msg + 'on', auth: '3a16ddd522b93b1dfb4e6644e291410ccbaeefe0' });
        fnPr.then(
            function(data) {
                console.log('Function called succesfully:', data);
            }, function(err) {
                console.log('An error occurred:', err);
        });
    });
    socket.on('off', function (msg) {
        // Request Starts Here
        var fnPr = particle.callFunction({ deviceId: '3f0027000247343337373738', name: 'led', argument: msg + 'off', auth: '3a16ddd522b93b1dfb4e6644e291410ccbaeefe0' });
        fnPr.then(
            function(data) {
                console.log('Function called succesfully:', data);
            }, function(err) {
                console.log('An error occurred:', err);
        });
    });
    socket.on('disconnect', function () {
        console.log("User disconnected");
    });
});

http.listen(3000, function () {
    console.log("Listening on port: 3000")
});