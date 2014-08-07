// Modules
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var github = require('octonode');
var client = github.client();

var p = function(d) {
    console.log(d);
}

//Testing repo API
var ghrepo = client.repo('jlmartin9/CIHSP');

var lang;

ghrepo.languages(function(err, data, headers) {
    // console.log("error: " + err);
    // console.log("headers:" + headers);
    lang = data;
    p("Set!");
    p(lang);
});

var info;

ghrepo.info(function(err, data, headers) {
    info = data.created_at;
    p(info);
});

//Start Express and Socket.io

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
     * @return 2D array - returns an array with first column date,
     *                                          second column percentage
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