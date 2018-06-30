var env = require('dotenv').config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require('fs');
var keys = require('./keys');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var argument = "";

function main(choice, argument){
    if (choice) {
        choice = choice.toLowerCase();
        switch (choice) {
            case 'my-tweets':
                myTweets();
                break;
            case 'spotify-this-song':
                spotifyThisSong(argument);
                break;
            case 'movie-this':
                movieThis(argument);
                break;
            case 'do-what-it-says':
                doThis();
                break;
        }
    }
    else {
        console.log("No choice selected!");
    }
}

function myTweets() {
    var userName = { screen_name: 'JonathanMai4' }
    var stringToWrite = "";
    client.get('statuses/user_timeline', userName, function (error, tweets, response) {
        stringToWrite += '\nLast 20 tweets by ' + userName.screen_name;
        for (var i = 0; i < tweets.length; i++) {
            stringToWrite += "\n" + (i+1) + ") " + tweets[i].text;
        }
        stringToWrite += "\n----------------------------\n";
        console.log(stringToWrite);
        writeToFile(stringToWrite);
    });
}

function spotifyThisSong(songName) {
    var stringToWrite = "";
    if(songName !== ""){
        spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            else{
                var songInfo = data.tracks.items[0];
                stringToWrite = "\nArtist: " + songInfo.artists[0].name +
                                "\nSong: " + songInfo.name +
                                "\nPreview: " + songInfo.preview_url +
                                "\nAlbum: "+ songInfo.album.name +
                                "\n----------------------------\n";
                console.log(stringToWrite);
                writeToFile(stringToWrite);
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
                stringToWrite = "\nArtist: " + songInfo.artists[0].name +
                                "\nSong: " + songInfo.name +
                                "\nPreview: " + songInfo.preview_url +
                                "\nAlbum: "+ songInfo.album.name + 
                                "\n----------------------------\n";
                console.log(stringToWrite);
                writeToFile(stringToWrite);
            }
        });
    }
}

function movieThis(movie){
    var stringToWrite = "";
    if(movie !== ""){
        request('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=' + movie, function(error, response, body){
            var obj = JSON.parse(body);
            stringToWrite = "\nTitle: " + obj.Title + 
                            "\nRelease Date: " + obj.Year + 
                            "\nIMDB Rating: " + obj.Ratings[0].Value +
                            "\nRotten Tomato Rating: " + obj.Ratings[1].Value +
                            "\nProduced In: " + obj.Country +
                            "\nLanguage: " + obj.Language +
                            "\nPlot: " + obj.Plot +
                            "\nActors: " + obj.Actors +
                            "\n----------------------------\n";
            console.log(stringToWrite);
            writeToFile(stringToWrite);
        });
    }
    else {
        request('http://www.omdbapi.com/?apikey=' + keys.omdb.key + '&t=Mr. Nobody', function(error, response, body){
            var obj = JSON.parse(body);
            stringToWrite = "\nTitle: " + obj.Title +
                            "\nRelease Date: " + obj.Year +
                            "\nIMDB Rating: " + obj.Ratings[0].Value +
                            "\nRotten Tomato Rating: " + obj.Ratings[1].Value +
                            "\nProduced In: " + obj.Country +
                            "\nLanguage: " + obj.Language +
                            "\nPlot: " + obj.Plot +
                            "\nActors: " + obj.Actors +
                            "\n----------------------------\n";
            console.log(stringToWrite);
            writeToFile(stringToWrite);
        });
    }
}
function doThis(){
    fs.readFile('./random.txt', 'UTF8', function(err, data) {
        if(err){
            console.log(err);
        }
        else {
            var args = data.split(",");
            main(args[0], args[1]);
        }
    })
}
function writeToFile(string){
    fs.appendFile('log.txt', string, () =>{
        console.log("Information logged!");
    });
}
if(!process.argv[3]){
    argument = "";
}
else{
    for(var i = 3; i < process.argv.length; i++){
        argument += process.argv[i] + " ";
    }
}

main(process.argv[2], argument);