var should = require('should'),
    lwes = require('../index');

describe("UnicastEmitter", function() {
    var ip = '224.1.1.1';
    var port = '9191';
    it("should emit name, string key", function(done) {
        var emitter = new lwes.UnicastEmitter(ip,port);
        var ev = new lwes.Event('MyEvent'); // 7 + 2 + 2
        ev.set_string('somekey', 'test string'); // 7 + 2 + 1 + 2 + 11

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.name.should.be.eql('MyEvent');
            console.log("attributes:"+JSON.stringify(ev.attributes));
            var k = ev.get('somekey');
            "test string".should.be.eql(k);
            done();
        });
        emitter.emit(ev);
    });
});
