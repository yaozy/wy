//select ot_code, ot_pcode, ot_name, sort, create_by, create_date, update_by, update_date, remarks, del_flag from orgtree;


const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/orgtree', function () {
    it('debug', async function () {
        let results = await POST('/orgtree', {
            ot_code: 'org_101',
            ot_pcode:'org_100',
            ot_name: '深圳万科',
            sort: 101,
            create_by: 'C_USER',
            create_date: '2018-07-29',
            remarks: '深圳万科'
        });

        let records = await GET('/orgtree', ['org_101']);
        expect(records[0].ot_name).to.be.eq('深圳万科');

        await PUT('/orgtree', ['org_101'], {
            ot_code: 'org_101',
            ot_pcode:'put_org_100',
            ot_name: 'put_深圳万科',
            sort: 102,
            update_by: 'PUT_USER',
            update_date: '2018-07-30',
            remarks: 'put_深圳万科'
        });

        records = await GET('/orgtree', ['org_101']);
        expect(records[0].ot_name).to.be.eq('put_深圳万科');

        await DELETE('/orgtree', ['org_101']);
        records = await GET('/orgtree', ['org_101']);
        expect(records[0]).to.be.eq(undefined);

    });
});
