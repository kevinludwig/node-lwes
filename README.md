### Overview

This is a javascript port of LWES (www.lwes.org).

This is a work in progress, and is not a functional implementation. Do NOT use it (yet). 

### Open issues

* only supports utf-8
* needs bounds checking on some fields (max field size, max key size, etc.)
* missing ESF
* missing Startup/Shutdown/Stat events
* not cross platform tested.

### Examples

To create a unicast emitter and send an event:

```
var lwes = require('lwes');

var emitter = new lwes.UnicastEmitter('224.0.0.12', '9191');
var e = new lwes.Event('MyEvent');
e.set_uint16('id', 25);
e.set_string('name', 'test');

emitter.emit(e);
emitter.close();
```

To create a multicast emitter and send an event:

```
var lwes = require('lwes');

var ttl = 4;
var emitter = lwes.MulticastEmitter('224.1.1.1','9191',ttl);
var e = new lwes.Event('MyEvent');
e.set_uint16('id',1);
e.set_string('name','test');
emitter.emit(e);
emitter.close();
```

To create an event printing listener:
```
listener = new Listener ('224.1.1.1','9191');
listener.listen(function(e) {
    console.log(JSON.stringify(e));
});

process.on('SIGINT', function() {
    listener.close();
});

```
