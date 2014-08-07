var p = function(d) {
    console.log(d);
}

// Modules

var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var mongo = require('mongojs');
var github = require('octonode');

//Testing repo API

var client = github.client();

function getRepoJSON(repository){
    var ghrepo = client.repo(repository);
    var json = {date: null,
                languages: {}};
    ghrepo.info(function(err, data, headers){
        json.date = data.created_at;
    });
    ghrepo.languages(function(err, data, headers){
        json.languages = data;
    });
}

var test = getRepoJSON('jlmartin9/CIHSP');

//Start Mongo and populate database with GitHub's data

var db = mongo('statistics');
var collection = db.collection('collection');

//Start Express, Socket.io

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var server = app.listen('8888', function() {
    p('Express server listening on port 8888');
})

var io = socketio.listen(server);

io.sockets.on('connection', function(socket) {

    /**
     * getLang(lang)
     * @param var lang - language to retrieve stastics for
     * @return 2D array - returns an array with first column date,
     *                                          second column percentage
     */
    socket.on('getLang', function(lang) {
        //console.log('Test!');
        p(lang);
    });

    socket.on('getRepo', function(repo) {
        p(repo);
    });

    /**
     * getRepoBreakdown(lang)
     * @param var lang - language to retrieve breakdown for
     * @return 2D array
     */

});