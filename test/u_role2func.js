//select role_id,func_id from role2func;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/role2func', function () {

    it('debug', async function () {

        await POST('/role2func', { role_id: 999998, func_id: 999999 });
        let records = await GET('/role2func', [999998]);
        expect(records[0].func_id).to.be.eq(999999);

        await PUT('/role2func', [999998], { func_id: 999990 });
        records = await GET('/role2func', [999998]);
        expect(records[0].func_id).to.be.eq(999990);

        await DELETE('/role2func', [999998]);
        records = await GET('/role2func', [999998]);
        expect(records[0]).to.be.eq(undefined);
    });

});