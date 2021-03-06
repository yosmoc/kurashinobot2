"use strict";

var path = require('path'),
    sys = require('sys'),
    fs = require('fs'),
    DB = require('./lib/DB').DB,
    cronJob = require('cron').CronJob,
    twitter = require('twitter'),
    undefined;

function Bot() {
    this.db = new DB(path.resolve() + '/db/kurashi_no_hint');

    this.bot = new twitter({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    });
}

Bot.prototype = {
    say: function() {
        var self = this;

        self.db.fetch_hint_random(function(hint){
            var hint = "「" + hint.hint + "」";
            self.bot.verifyCredentials(function (data) {
                sys.puts(sys.inspect(data));
            }).updateStatus(hint, function(data) {
                sys.puts(sys.inspect(data));
            });
        });
    }
}


var kurashinobot = new Bot();
// kurashinobot.say();

new cronJob('00 00 3,7,12,22 * * *', function(){
    kurashinobot.say();
}, true, "America/Los_Angeles");

// for debug
// new cronJob('01 * * * * *', function(){
//    kurashinobot.say();
// }, true, "America/Los_Angeles");

process.on('SIGINT', function() { kurashinobot.db.disconnect()});
