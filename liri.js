var env = require('dotenv').config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var keys = require('./keys');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var choice;
if (process.argv[2]) {
    choice = process.argv[2].toLowerCase();
    switch (choice) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifyThisSong();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
    }
}

function myTweets() {
    var userName = { screen_name: 'JonathanMai4' }
    client.get('statuses/user_timeline', userName, function (error, tweets, response) {
        console.log('Last 20 tweets by ' + userName.screen_name + "\n----------------------------\n");
        for (var i = 0; i < tweets.length; i++) {
            console.log(i + 1 + ") " + tweets[i].text);
        }
    });
}

function spotifyThisSong() {
    if(process.argv[3]){
        var songName = "";
        for(var i = 3; i < process.argv.length; i++){
            songName += process.argv[i] + " ";
        }
        spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            else{
                var songInfo = data.tracks.items[0];
                console.log("Artist: " + songInfo.artists[0].name)
                console.log("Song: " + songInfo.name);
                console.log("Preview: " + songInfo.preview_url);
                console.log("Album: "+ songInfo.album.name);
            }
        });
    }
    else{
        spotify.search({ type: 'track', query: 'The Sign', limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            else{
                var songInfo = data.tracks.items[0];
                console.log("Artist: " + songInfo.artists[0].name)
                console.log("Song: " + songInfo.name);
                console.log("Preview: " + songInfo.preview_url);
                console.log("Album: "+ songInfo.album.name);
            }
        });
    }
}

function movieThis(){
    if(process.argv[3]){
        var movie = "";
        for(var i = 3; i < process.argv.length; i++){
            movie += process.argv[i] + " ";
        }
        request('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=' + movie, function(error, response, body){
            var obj = JSON.parse(body);
            console.log("Title: " + obj.Title);
            console.log("Release Date: " + obj.Year);
            console.log("IMDB Rating: " + obj.Ratings[0].Value);
            console.log("Rotten Tomato Rating: " + obj.Ratings[1].Value);
            console.log("Produced In: " + obj.Country);
            console.log("Language: " + obj.Language);
            console.log("Plot: " + obj.Plot);
            console.log("Actors: " + obj.Actors);
        });
    }
    else {
        request('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=Mr. Nobody', function(error, response, body){
            var obj = JSON.parse(body);
            console.log("Title: " + obj.Title);
            console.log("Release Date: " + obj.Year);
            console.log("IMDB Rating: " + obj.Ratings[0].Value);
            console.log("Rotten Tomato Rating: " + obj.Ratings[1].Value);
            console.log("Produced In: " + obj.Country);
            console.log("Language: " + obj.Language);
            console.log("Plot: " + obj.Plot);
            console.log("Actors: " + obj.Actors);
        });
    }
}