var fs = require('fs'),
    tokenizer = require('tokenizer');

var db = {};
var eventName = null;
var attributeType = null;

var EVENT_WORD = 1,
    EVENT_START = 2,
    TYPE = 3,
    EQUALS = 4,
    VALUE = 5,
    END_ATTRIBUTE = 6;

var state = EVENT_WORD;

function onEventWord(token,type) {
    if (type !== 'symbol') throw new Error("ESF: expecting event_word");
    else {
        eventName = token;
        db[eventName] = {};
        state = EVENT_START;
    }
}

function onEventStart(token,type) {
    if (type !== 'event-start') throw new Error("ESF: expecting '{'");
    else state = TYPE;
}

function onType(token,type) {
    if (type === 'event-end') {
        eventName = null;
        state = EVENT_WORD;
    }
    else if (type !== 'typename') {
        throw new Error("ESF: expecting type token");
    }
    else {
        attributeType = token;
        state = EQUALS;
    }
}

function onEquals(token,type) {
    if (type !== 'equals') throw new Error("ESF: expecting '='");
    else state = VALUE;
}

function onValue(token,type) {
    if (type !== 'symbol') throw new Error("ESF: expecting attribute_name");
    else {
        state = END_ATTRIBUTE;
        db[eventName][token] = attributeType;
    }
}

function onEndAttribute(token,type) {
    if (type !== 'attribute-end') throw new Error("ESF: expecting ';'");
    else state = TYPE;
}

function handleState(state,token,type) {
    switch(state) {        
        case EVENT_WORD:
            onEventWord(token,type);
            break;
        case EVENT_START:
            onEventStart(token,type);
            break;
        case TYPE: 
            onType(token,type);
            break;
        case EQUALS:
            onEquals(token,type);
            break;
        case VALUE: 
            onValue(token,type);
            break;
        case END_ATTRIBUTE:
            onEndAttribute(token,type);
            break;
        default:
            throw new Error("ESF unknown state");
    }
}

module.exports = function(filename, callback) {
    var t = new tokenizer();
    t.addRule(/^\#.*$/, "comment");
    t.addRule(/^\s$/, "whitespace");
    t.addRule(/^(byte|uint16|int16|uint32|int32|uint64|int64|string|float|double|ip_addr|boolean)$/, "typename");
    t.addRule(/^[a-zA-Z0-9_\:]+$/, "symbol");
    t.addRule(/^\{$/, "event-start");
    t.addRule(/^\}$/, "event-end");
    t.addRule(/^\;$/, "attribute-end");
    t.addRule(/^\=$/, "equals");
    t.ignore('whitespace');
    t.ignore('comment');

    t.on("token", function(data) {
        handleState(state, data.content,data.type);
    });
    t.on('finish', function() {
        callback(null,db);
    });
    t.on('error', callback);
    fs.readFile(filename, function(err,data) {
        if (err) callback(err);
        else {
            t.write(data);
            t.end();
        }
    });
};
