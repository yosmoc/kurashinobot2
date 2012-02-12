"use strict";

var path = require('path'),
    fs = require('fs'),
    DB = require('./lib/DB').DB,
    cronJob = require('cron').CronJob,
    confy = require('confy'),
    undefined;

function Bot() {
    this.db = new DB(path.resolve() + '/db/kurashi_no_hint');
    this.conf = confy.get('twitter.com', { require: {
        consumer_key: '',
        consumer_secret: '',
        access_token_key: '',
        access_token_secret: ''    
    }}, function(err, result) {
        console.log(result);
    });
    console.log(this.conf);
}

Bot.prototype = {
    say: function() {
        var hint = this.db.hint_queue.shift();
        this.db.insert_queue_random();
        console.log(hint);
    }
}


var kurashinobot = new Bot();
// cronJob('0 0 7,12,22 * * *', function(){
//     console.log('You will see this message every second');
// });

cronJob('* * * * * *', function(){
    kurashinobot.say();
});

process.on('SIGINT', function() { kurashinobot.db.disconnect(); });