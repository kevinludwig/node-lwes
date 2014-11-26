var peg = require('pegjs'), 
    path = require('path'),
    fs = require('fs');

module.exports = function(filename, callback) {
    fs.readFile(path.join(__dirname, "esf.pegjs"),"utf8", function(err,grammar) { 
        if (err) return callback(err);

        var parser = peg.buildParser(grammar);
        fs.readFile(filename, "utf8", function(err,data) {
            var db;
            if (err) return callback(err);
            try {
                db = parser.parse(data);
            }
            catch (ex) {
                callback(ex);
            }   
            callback(null,db);
        });
    });
};
