"use strict";

var path = require('path'),
sys = require('sys'),
    fs = require('fs'),
    DB = require('./lib/DB').DB,
    cronJob = require('cron').CronJob,
    confy = require('confy'),
    twitter = require('twitter'),
    undefined;

function Bot() {
    this.db = new DB(path.resolve() + '/db/kurashi_no_hint');

    var self = this;
    this.conf = confy.get('twitter.com', { require: {
        consumer_key: '',
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: ''    
    }}, function(err, result) {
        self.bot = new twitter({
            consumer_key: result.consumer_key,
            consumer_secret: result.consumer_secret,
            access_token_key: result.access_token_key,
            access_token_secret: result.access_token_secret
        });
    });
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
cronJob('0 0 7,12,22 * * *', function(){
    kurashinobot.say();
});

// cronJob('* * * * * *', function(){
//     kurashinobot.say();
// });

process.on('SIGINT', function() { kurashinobot.db.disconnect(); });