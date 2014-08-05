// Modules
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var github = require('octonode');
var client = github.client();

// Getting tired of typing 'console.log'
var p = function(d){
    console.log(d);
}

var ghme = client.me();
var ghrepo = client.repo('jlmartin9/CIHSP');

ghrepo.contributors(function() {

});

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen('8888', function() {
    console.log('Express server listening on port 8888');
})

var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {

    /**
     * getLang(lang)
     * @param var lang - language to retrieve stastics for
     * @return 2D array - returns an array with first column year,
     * second column percentage
     */
    socket.on('getLang', function(lang) {
        //console.log('Test!');
        console.log(lang);
    });

    socket.on('getRepo', function(repo) {
    	console.log(repo);
    });
    /**
     * getRepoBreakdown(lang)
     * @param var lang - language to retrieve breakdown for
     * @return 2D array
     */

});