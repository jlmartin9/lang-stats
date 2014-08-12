function p(d) {
    console.log(d);
}

// Modules

var express = require('express');
var http = require('http');
var https = require('https'); // For retrieving GitHub user list
var socketio = require('socket.io');
var mongojs = require('mongojs');
var github = require('octonode');
var Promise = require('promise');

// Create Mongo database and collections
var db = mongojs('statistics');
var collection = db.collection('collection');

var client = github.client();

function getRepoJSON(repository) {
    var ghrepo = client.repo(repository);
    //p(ghrepo);
    
    //Initialize JSON
    var json = {
        date: null,
        languages: {}
    };

    //Use a promise to asynchronously resolve JSON fields with GitHub API
    var jsonPromise = new Promise(
        function(resolve, reject) {
            var datePromise = new Promise(
                function(resolve, reject) {
                    ghrepo.info(function(err, data, headers) {
                        //Strip timestamp off date
                        var d = data.created_at.substring(0,10);
                        json.date = d;
                        resolve(json);
                    });
                }); //End of datePromise
            var langPromise = new Promise(
                function(resolve, reject) {
                    ghrepo.languages(function(err, data, headers) {
                        json.languages = data;
                        resolve(json);
                    });
                }); //End of langPromise

            //Hack-y resolving of promises
            datePromise.then(function(dateJSON) {
                //p("JSON from date promise: ");
                //p(dateJSON);
                json = dateJSON;
            }).then(function() {
                langPromise.then(function(langJSON) {
                    // p("JSON from lang promise: ");
                    // p(langJSON);
                    json = langJSON;
                    // p("About to resolve")
                    resolve(json);
                });
            });
        }); //End of jsonPromise
    jsonPromise.then(function(json) {
        // p("Done!");
        // p(json);
        collection.insert(json, function(err, inserted){
            if(err){
                p("Error inserting document.");
            }else{
                //p("Document inserted.")
            }
        });
    });
}; // End of getRepoJSON

getRepoJSON('jlmartin9/CIHSP');

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

//function Promise(fn) {
//     var state = 'pending';
//     var value;
//     var deferred = null;

//     function resolve(newValue) {
//         if (newValue && typeof newValue.then === 'function') {
//             newValue.then(resolve);
//             return;
//         }
//         state = 'resolved';
//         value = newValue;

//         if (deferred) {
//             handle(deferred);
//         }
//     }

//     function handle(handler) {
//         if (state === 'pending') {
//             deferred = handler;
//             return;
//         }

//         if (!handler.onResolved) {
//             handler.resolve(value);
//             return;
//         }

//         var ret = handler.onResolved(value);
//         handler.resolve(ret);
//     }

//     this.then = function(onResolved) {
//         return new Promise(function(resolve) {
//             handle({
//                 onResolved: onResolved,
//                 resolve: resolve
//             });
//         });
//     };

//     fn(resolve);
// }