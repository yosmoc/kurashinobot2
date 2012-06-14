"use strict";

var http = require('http'),
    url = require('url'),
    request = require('request'),
    jsdom = require('jsdom'),
    fs = require('fs'),
    DB = require('./lib/DB').DB,
    jquery = fs.readFileSync("./lib/jquery-1.7.1.min.js").toString(),
    path = require('path'),
    undefined;

function Crawler() {
    this.url = "http://www.kurashi-no-techo.co.jp/inc_hint";
    var db_url = process.env.MONGOHQ_URL || path.resolve() + '/db/kurashi_no_hint';
    this.db = new DB(db_url);
}

Crawler.prototype = {
    run: function() {
        var self = this;

        request(this.url, function(error, response, body) {
            if (error) {
                console.log(this.url + ':' + error);
                return;
            } else if (response.statusCode !== 200) {
                console.log(this.url + ':' + response.statusCode);
                self.run();
                return;
            } else {
                self.parseBody(body);
            }
        })
    },

    parseBody: function (body) {
        var self = this;
        jsdom.env({
            html: body,
            src: [jquery],
            done: function (errors, window) {
                if (!errors) {
                    var $ = window.$;
                    var hint = $("p").text().trim();

                    self.db.insert(hint);
                } else {
                    console.log('errors jsdom');
                }
             }
        });
    }
}

var crawler = new Crawler();
crawler.run();
process.on('SIGINT', function() { crawler.db.disconnect(); });