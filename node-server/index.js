/**
 * Created by Tomas on 6/14/17.
 */

var Particle = require('particle-api-js');
var particle = new Particle();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Firebase
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyBtcmKDFZ9cteBQuBiX6OkHxSOe0p92IOo",
    authDomain: "lycd-b6124.firebaseapp.com",
    databaseURL: "https://lycd-b6124.firebaseio.com",
    projectId: "lycd-b6124",
    storageBucket: "lycd-b6124.appspot.com",
    messagingSenderId: "168801202627"
};
firebase.initializeApp(config);

// Google Speech to Text
// Imports the Google Cloud client library
const Speech = require('@google-cloud/speech');

// Your Google Cloud Platform project ID
const projectId = 'lycd-b6124';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

const options = {
  encoding: 'LINEAR16',
  sampleRateHertz: 44100,
  languageCode: 'es-AR'
};

// App Starts Here
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/recorder.js', function(req, res){
    console.log('requesting recorder');
    res.sendFile(__dirname + '/recorder.js');
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
    // socket.on('on', function (msg) {
    //     // Request Starts Here
    //     var fnPr = particle.callFunction({ deviceId: '3f0027000247343337373738', name: 'led', argument: msg + 'on', auth: '3a16ddd522b93b1dfb4e6644e291410ccbaeefe0' });
    //     fnPr.then(
    //         function(data) {
    //             console.log('Function called succesfully:', data);
    //         }, function(err) {
    //             console.log('An error occurred:', err);
    //     });
    // });
    // socket.on('off', function (msg) {
    //     // Request Starts Here
    //     var fnPr = particle.callFunction({ deviceId: '3f0027000247343337373738', name: 'led', argument: msg + 'off', auth: '3a16ddd522b93b1dfb4e6644e291410ccbaeefe0' });
    //     fnPr.then(
    //         function(data) {
    //             console.log('Function called succesfully:', data.statusCode);
    //         }, function(err) {
    //             console.log('An error occurred:', err);
    //     });
    // });
    socket.on('audio', function(blob){
        console.log('Sending file');
        speechClient.recognize(blob, options)
            .then((results) => {
            const transcription = results[0];
            console.log(`Transcription: ${transcription}`);
            decodeTranscription(transcription);
        })
            .catch((err) => {
            console.error('ERROR:', err);
        });
    });
    socket.on('disconnect', function () {
        console.log("User disconnected");
    });
});

http.listen(3000, function () {
    console.log("Listening on port: 3000")
});

// Doing something with the text

function decodeTranscription(transcription){
    var operations = [];
    var index = 0;
    for(var i = 0; i < transcription.length - 1; i++)
        if(transcription.substring(i, i + 1) == " "){
            operations.push(transcription.substring(index, i));
            index = i + 1;
        }
    operations.push(transcription.substring(index, transcription.length));
    decodeOperations(normalize(operations));
}

function normalize(operations){
    var current;
    var results = []
    for(var i = 0; i < operations.length; i++){
        current = operations[i].toLowerCase();
        if(current == 'apagar'){
            results.push('off');
        } else if(current == 'prender'){
            results.push('on');
        } else if(!isNaN(current)){
            results.push(current);
        }
    }
    return results;
}

function decodeOperations(operations){
    var current;
    for(var i = 0; i < operations.length; i++){
        if(operations[i] == 'on'){
            current = 'on';
        } else if(operations[i] == 'off'){
            current = 'off';
        } else if(current != null){
            performActions(current, operations[i]);
        }
    }
}

function performActions(method, pin){
    var fnPr = particle.callFunction({ deviceId: '3f0027000247343337373738', name: 'led', argument: pin + method, auth: '3a16ddd522b93b1dfb4e6644e291410ccbaeefe0' });
    fnPr.then(
        function(data) {
            console.log('Function called succesfully:', data.statusCode);
        }, function(err) {
            console.log('An error occurred:', err);
    });
}












