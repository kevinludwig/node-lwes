var should = require('should'),
    lwes = require('../index');

describe("UnicastEmitter", function() {
    var ip = '224.1.1.1';
    var port = '9191';
    var emitter = null;
    before(function() {
        emitter = new lwes.UnicastEmitter(ip,port);
    });
    after(function() {
        emitter.close();
    });
    it("should emit name, string key", function(done) {
        var ev = new lwes.Event('MyEvent'); // 7 + 2 + 2
        ev.set_string('somekey', 'test string'); // 7 + 2 + 1 + 2 + 11

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.name.should.be.eql('MyEvent');
            Object.keys(ev.attributes).length.should.be.eql(1);
            ev.get('somekey').should.be.eql("test string");
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
    it("should emit int16 types", function(done) {
        var ev = new lwes.Event('MyEvent');
        ev.set_int16('int16_key', 1234);
        ev.set_uint16('uint16_key', 2000);

        var listener = new lwes.Listener(ip,port);
        listener.listen(function(err,ev) {
            should.not.exist(err);
            ev.should.have.property('name');
            ev.should.have.property('attributes');
            Object.keys(ev.attributes).length.should.be.eql(2);
            ev.get('int16_key').should.be.eql(1234);
            ev.get('uint16_key').should.be.eql(2000);
            listener.close();
            done();
        });
        emitter.emit(ev);
    });
});
