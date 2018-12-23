const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/role2user', function () {

    it('debug', async function () {

        await POST('/role2user', { role_id: 999998, user_id: 'system' });
        let records = await GET('/role2user', ['system']);
        expect(records[0].role_id).to.be.eq(999998);

        await PUT('/role2user', ['system'], { role_id: 999990 });
        records = await GET('/role2user', ['system']);
        expect(records[0].role_id).to.be.eq(999990);

        await DELETE('/role2user', ['system']);
        records = await GET('/role2user', ['system']);
        expect(records[0]).to.be.eq(undefined);
    });

});