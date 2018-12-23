//select ot_code, org_code from orglist;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/orglist', function () {
    it('debug', async function () {

        await POST('/orglist', { ot_code: 'org_101', org_code: 'org_101_10001' });
        let records = await GET('/orglist', ['org_101']);
        expect(records[0].org_code).to.be.eq('org_101_10001');

        await PUT('/orglist', ['org_101'], { org_code: 'put_org_101_10001' });
        records = await GET('/orglist', ['org_101']);
        expect(records[0].org_code).to.be.eq('put_org_101_10001');

        await DELETE('/orglist', ['org_101']);
        records = await GET('/orglist', ['org_101']);
        expect(records[0]).to.be.eq(undefined);
    });


});