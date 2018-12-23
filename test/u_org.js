//select org_code, ot_code, org_name, is_use, sort, create_by, create_date, update_by, update_date, remarks, del_flag from orginfo;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/org', function () {
    it('debug', async function () {
        let results = await POST('/org', {
            org_code: 'org_101_10001',
            ot_code: 'org_101',
            org_name: '深圳四季花城',
            is_use: 1,
            sort: 101,
            create_by: 'C_USER',
            create_date: '2018-07-29',
            remarks: '深圳四季花城'
        });

        let records = await GET('/org', ['org_101_10001']);
        expect(records[0].org_name).to.be.eq('深圳四季花城');

        await PUT('/org', ['org_101_10001'], {
            org_code: 'org_101_10001',
            ot_code: 'PUT_org_101',
            org_name: 'PUT_深圳四季花城',
            is_use: 1,
            sort: 102,
            update_by: 'PUT_USER',
            update_date: '2018-07-30',
            remarks: 'PUT_深圳四季花城'
        });

        records = await GET('/org', ['org_101_10001']);
        expect(records[0].org_name).to.be.eq('PUT_深圳四季花城');

        await DELETE('/org', ['org_101_10001']);
        records = await GET('/org', ['org_101_10001']);
        expect(records[0]).to.be.eq(undefined);

    });
});
