var mongoose = require('mongoose');

function DB(path){
    var Schema = mongoose.Schema;

    var HintSchema = new Schema({
        hint: String,
        date: Date,
        random: Number
    });
    
    this.Hint = mongoose.model('Hint', HintSchema);
    var db_url = process.env.MONGOHQ_URL || 'mongodb://localhost/' + path;
    this.connect(db_url);
}

DB.prototype = {
    connect: function (db) {
        mongoose.connect(db);
        console.log('connected Database: ' + db);
    },

    disconnect: function () {
        mongoose.disconnect();
        console.log('disconencted Database');
    },

    insert: function (content) {
        var self = this;

        this.Hint.findOne({hint: content}, function(error, doc) {
            if (!error) {
                if (doc) {
                    console.log(doc);
                    console.log(content + 'is already existed!');
                } else {
                    var hint = new self.Hint({hint: content, date: new Date(), random: Math.random()});
                    hint.save(function(error) {
                        if (!error) {
                            console.log(content + 'saved!');
                        } else {
                            console.log('save error!');
                        }
                    });
                }
            } else {
                console.log('find error!');
            }
        });
    },

    fetch_hint_random: function (callback) {
        var self = this;

        this.Hint.find({}, function(err, docs) {
            var index = Math.floor(Math.random() * docs.length);
            var doc = docs[index];
            callback(doc);
            // return doc.hiht;
        });
    }
};

exports.DB = DB