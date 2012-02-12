"use strict";

var path = require('path'),
    fs = require('fs'),
    DB = require('./lib/DB').DB,
    cronJob = require('cron').CronJob,
    undefined;

function Bot() {
    this.db = new DB(path.resolve() + '/db/kurashi_no_hint');
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