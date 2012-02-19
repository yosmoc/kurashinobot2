"use strict";

var path = require('path'),
    sys = require('sys'),
    fs = require('fs'),
    DB = require('./lib/DB').DB,
    cronJob = require('cron').CronJob,
    twitter = require('twitter'),
    express = require('express'),
    undefined;

function Bot() {
    this.db = new DB(path.resolve() + '/db/kurashi_no_hint');

    this.bot = new twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });

    this.db.queue_initialize();
}

Bot.prototype = {
    say: function() {
        var hint = "「" + this.db.hint_queue.shift().hint +"」" ;

        this.bot.verifyCredentials(function (data) {
            sys.puts(sys.inspect(data));
        }).updateStatus(hint, function(data) {
            sys.puts(sys.inspect(data));
        });

        this.db.insert_queue_random();
    }
}


var kurashinobot = new Bot();
// cronJob('0 0 7,12,22 * * *', function(){
//    kurashinobot.say();
// });

cronJob('01 * * * * *', function(){
   kurashinobot.say();
});

// cronJob('* * * * * *', function(){
//     kurashinobot.say();
// });

process.on('SIGINT', function() { kurashinobot.db.disconnect(); });

// dummy application
var app = express.createServer();

app.get('/', function(req, res) {
    res.send('Hello world');
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Listening on " + port);
});