import controller from '../../controllers/example.controller';

const expect = require('chai').expect;

let req = {
    headers: {},
    body: {},
};

let res = {
    sendCalledWith: '',
    send: function(arg) { 
        this.sendCalledWith = arg;
    }
};

describe('Greetings Route', function() {
    describe('Hello() function', function() {
        it('Should error out if no name provided ', function() {
            controller.hello(req, res);
            expect(res.sendCalledWith).to.contain('error');
        });

        it('Should respond in English as default', function() {
            let newReq = req;
            newReq.body.name = 'Jody';
            
            controller.hello(newReq, res);
            expect(res.sendCalledWith).to.equal('Hello, Jody');
        });

        it('Should error on invalid language', function() {
            let newReq = req;
            newReq.body.name = 'Jody';
            newReq.headers.language = 'bad-input';
            
            controller.hello(newReq, res);
            expect(res.sendCalledWith).to.equal('Error: Invalid Language');
        });

        it('Should return greeting for english, spanish, or german', function() {
            let newReq = req;
            newReq.body.name = 'Jody';

            newReq.headers.language = 'en';
            controller.hello(newReq, res);
            expect(res.sendCalledWith).to.equal('Hello, Jody');

            newReq.headers.language = 'es';
            controller.hello(newReq, res);
            expect(res.sendCalledWith).to.equal('Hola, Jody');

            newReq.headers.language = 'de';
            controller.hello(newReq, res);
            expect(res.sendCalledWith).to.equal('Hallo, Jody');
        });
    })
});