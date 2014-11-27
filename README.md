### Overview

This is a pure javascript implementation of LWES (www.lwes.org).

### Open issues

* only supports utf-8
* missing ESF

### Examples

To create a unicast emitter and send an event:

```
var lwes = require('lwes');

var emitter = new lwes.UnicastEmitter('224.0.0.12', '9191');
var e = emitter.createEvent('MyEvent');
e.set_uint16('id', 25);
e.set_string('name', 'test');

emitter.emit(e);
emitter.destroy();
```

To create a multicast emitter and send an event:

```
var lwes = require('lwes');

var ttl = 4;
var emitter = new lwes.MulticastEmitter('224.1.1.1','9191',ttl);
var e = emitter.createEvent('MyEvent');
e.set_uint16('id',1);
e.set_string('name','test');
emitter.emit(e);
emitter.destroy();
```

To create an event printing listener:
```
listener = new Listener ('224.1.1.1','9191');
listener.listen(function(e) {
    console.log(JSON.stringify(e));
});

process.on('SIGINT', function() {
    listener.destroy();
});

```

To validate an event:
```
var lwes = require('lwes');

var db = new lwes.EventTemplateDB('path/to/template.esf');
db.initialize(function(err) {
    var emitter = new lwes.MulticastEmitter('224.1.1.1','9191',4);

    var e = emitter.createEvent('MyEvent');
    e.set_string('k','test');
    
    var validationErrors = db.validate(e);
    if (validationErrors.length > 0) {
        validationErrors.forEach(function(error) {
            console.log(error);
        });
    }
});

```
