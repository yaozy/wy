//select role_id,chart_id from role2chart;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/role2chart', function () {

    it('debug', async function () {

        await POST('/role2chart', { role_id: 999998, chart_id: 999999 });
        let records = await GET('/role2chart', [999998]);
        expect(records[0].chart_id).to.be.eq(999999);

        await PUT('/role2chart', [999998], { chart_id: 999990 });
        records = await GET('/role2chart', [999998]);
        expect(records[0].chart_id).to.be.eq(999990);

        await DELETE('/role2chart', [999998]);
        records = await GET('/role2chart', [999998]);
        expect(records[0]).to.be.eq(undefined);
    });

});