function p(d) {
    console.log(d);
}

function Promise(fn) {
    var state = 'pending';
    var value;
    var deferred = null;

    function resolve(newValue) {
        if (newValue && typeof newValue.then === 'function') {
            newValue.then(resolve);
            return;
        }
        state = 'resolved';
        value = newValue;

        if (deferred) {
            handle(deferred);
        }
    }

    function handle(handler) {
        if (state === 'pending') {
            deferred = handler;
            return;
        }

        if (!handler.onResolved) {
            handler.resolve(value);
            return;
        }

        var ret = handler.onResolved(value);
        handler.resolve(ret);
    }

    this.then = function(onResolved) {
        return new Promise(function(resolve) {
            handle({
                onResolved: onResolved,
                resolve: resolve
            });
        });
    };

    fn(resolve);
}

// Modules

var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var mongo = require('mongojs');
var github = require('octonode');

//Testing repo API

var client = github.client();

function getRepoJSON(repository) {
    var ghrepo = client.repo(repository);
    var json = {
        date: null,
        languages: {}
    };
    json.date = getRepoDate(ghrepo);
    json.languages = getRepoLang(ghrepo);
    return json;
}

function getRepoDate(ghrepo) {
    return new Promise(function(resolve) {
        var date = null;
        ghrepo.info(function(err, data, headers) {
            date = data.created_at;
            //resolve(date);
        });
        resolve(date);
    });
}

function getRepoLang(ghrepo) {
    return new Promise(function(resolve) {
        var lang = {};
        ghrepo.languages(function(err, data, headers) {
            lang = data;
            //resolve(lang);    
        });
        resolve(lang);
    });
}

var test = getRepoJSON('jlmartin9/CIHSP');
p(test);

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