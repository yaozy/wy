const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/test', function () {


    it('GET', async function () {

        let records = await GET('/test', [1]);

        expect(records[0].f1).to.be.eq('1');
    });


    it('POST', async function () {

        await POST('/test', { f1: 30, f2: 30 });

        let records = await GET('/test', [30]);

        expect(records[0].f1).to.be.eq('30');
    });

});
