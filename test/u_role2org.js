//select role_id,org_code from role2org;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/role2org', function () {

    it('debug', async function () {

        await POST('/role2org', { role_id: 999998, org_code: 'org_101_10001' });
        let records = await GET('/role2org', [999998]);
        expect(records[0].org_code).to.be.eq('org_101_10001');

        await PUT('/role2org', [999998], { org_code: 'org_101_10001' });
        records = await GET('/role2org', [999998]);
        expect(records[0].org_code).to.be.eq('org_101_10001');

        await DELETE('/role2org', [999998]);
        records = await GET('/role2org', [999998]);
        expect(records[0]).to.be.eq(undefined);
    });

});