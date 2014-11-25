var fs = require('fs'),
    tokenizer = require('tokenizer');

// TODO: 
// handle arrays
// handle default values per type
//
var db = {};

var eventName = null;
var currentKey = null;
var currentValue = null;

var EVENT_WORD = 1,
    EVENT_START = 2,
    MODIFIER = 3,
    TYPE = 4,
    KEYNAME = 5,
    ARRAY_START = 6,
    ARRAY_SIZE = 7,
    ARRAY_END = 8,
    EQUALS = 9,
    DEFAULT_VALUE = 10,
    END_ATTRIBUTE = 11;

var state = EVENT_WORD;

function emptyValue() {
    return {
        required:false,
        nullable:false,
        arraySize: null,
        type: null,
        value: null
    };
}
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
    else {
        state = TYPE;
        currentValue = emptyValue();
    }
}

function onTypename(token,type) {
    if (type === 'event-end') {
        eventName = null;
        state = EVENT_WORD;
    }
    else if (type === 'typename') {
        currentValue.type = token;
        state = KEYNAME;
    }
    else if (type === 'modifier') {
        if (token === 'required') currentValue.required = true;
        else if (token === 'optional') currentValue.required = false;
        else if (token === 'nullable') currentValue.nullable = true;
    }
    else {
        throw new Error("ESF: expecting type token");
    }
}

function onKeyname(token,type) {
    if (type !== 'symbol') throw new Error("ESF: expecting attribute name");
    else {
        state = ARRAY_START;
        currentKey = token;
        db[eventName][currentKey] = JSON.parse(JSON.stringify(currentValue));
    }
}
function onArrayType(token,type) {
    if (state === ARRAY_START) {
        if (type === 'open-bracket') state = ARRAY_SIZE;
        else onEquals(token,type);
    }
    else if (state === ARRAY_END) {
        if (type === 'close-bracket') state = EQUALS;
        else throw new Error("ESF: expecting ']'");
    }
    else if (state === ARRAY_SIZE) {
        if (type === 'integer-type') {
            db[eventName][currentKey].arraySize = +token;
            state = ARRAY_END;
        }
        else throw new Error("ESF: expecting integer-type, got "+type);
    }
    else throw new Error("ESF: bad transition"); 
}

function onEquals(token,type) {
    if (type === 'attribute-end') state = TYPE;
    else if (type !== 'equals') throw new Error("ESF: expecting '='");
    else state = DEFAULT_VALUE;
}

function onDefaultValue(token,type) {
    if (type !== 'default') throw new Error("ESF: expecting default value");
    else {/* nothing for now */}
}

function onEndAttribute(token,type) {
    if (type !== 'attribute-end') throw new Error("ESF: expecting ';'");
    else {
        state = TYPE;
        currentKey = null;
        currentValue = emptyValue();
    }
}

function handleState(state,token,type) {
    // console.log("state:",state,",token:",token,",type:",type);
    switch(state) {        
        case EVENT_WORD:
            onEventWord(token,type);
            break;
        case EVENT_START:
            onEventStart(token,type);
            break;
        case TYPE: 
            onTypename(token,type);
            break;
        case KEYNAME:
            onKeyname(token,type);
            break;
        case ARRAY_START:
            onArrayType(token,type);
            break;
        case ARRAY_SIZE:
            onArrayType(token,type);
            break;
        case ARRAY_END:
            onArrayType(token,type);
            break;
        case EQUALS:
            onEquals(token,type);
            break;
        case DEFAULT_VALUE: 
            onDefaultValue(token,type);
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
    t.addRule(/^(required|optional|nullable)$/, "modifier");
    t.addRule(/^\d+$/, "integer-type");
    t.addRule(/^[a-zA-Z][a-zA-Z0-9_\:]*$/, "symbol");
    t.addRule(/^\{$/, "event-start");
    t.addRule(/^\}$/, "event-end");
    t.addRule(/^\;$/, "attribute-end");
    t.addRule(/^\=$/, "equals");
    t.addRule(/^\[$/, "open-bracket");
    t.addRule(/^\]$/, "close-bracket");
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
