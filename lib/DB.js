var mongoose = require('mongoose');

function DB(path){
    var Schema = mongoose.Schema;

    var HintSchema = new Schema({
        hint: String,
        date: Date,
        random: Number
    });
    
    this.Hint = mongoose.model('Hint', HintSchema);
    this.connect('mongodb://localhost/' + path)
    this.hint_queue = [];
    this.queue_initialize();
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

    queue_initialize: function() {
        for (var i=0; i < 3; i++) {
            this.insert_queue_random();
        }
    },
    
    insert_queue_random: function () {
        var self = this;

        // this.Hint.findOne({random: {$lte: 0.9}}, function(error, doc){
        //     if (!error) {
        //         console.log(doc);
        //         self.hint_queue.push({id: doc._id, hint: doc.hint, random: doc.random});
        //     } else {
        //         console.log('find error');
        //     }
        // });

        this.Hint.find({}, function(err, docs) {
            var index = Math.floor(Math.random() * docs.length);
            var doc = docs[index];
            self.hint_queue.push({id: doc._id, hint: doc.hint, random: doc.random});
        });

    }
};

exports.DB = DB