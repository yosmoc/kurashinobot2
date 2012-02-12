"use strict";

var fs = require('fs'),
    DB = require('../lib/DB').DB,
    path = require('path'),
    undefined;

function Text2DB() {
    this.db = new DB(path.resolve('../db/') + '/kurashi_no_hint');
    this.text = fs.readFileSync("kurashi_no_hinto.txt").toString().split('\n');
}

Text2DB.prototype = {
    insert: function() {
        var self = this;
        this.text.forEach(function (hint) {
            self.db.insert(hint);
        });
    },

    disconnect: function() {
        this.db.disconnect();
    }
};

var text2db = new Text2DB();
text2db.insert();
process.on('SIGINT', function() { text2db.disconnect(); });