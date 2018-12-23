//select id, role_code, role_name, sort, create_by, create_date, update_by, update_date, remarks, del_flag from roleinfo;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/role', function () {
    it('debug', async function () {
        let results = await POST('/role', {
            role_code: 'gscwjl',
            role_name: '公司财务经理',
            sort: 101,
            create_by: 'C_USER',
            create_date: '2018-07-29',
            remarks: '公司财务经理'
        });

        let newid = results.insertId;
        let records = await GET('/role', [newid]);
        expect(records[0].role_name).to.be.eq('公司财务经理');

        await PUT('/role', [newid], {
            role_code: 'PUT_gscwjl',
            role_name: 'PUT_公司财务经理',
            sort: 101,
            update_by: 'PUT_USER',
            update_date: '2018-07-30',
            remarks: 'PUT_公司财务经理'
        });
        records = await GET('/role', [newid]);

        expect(records[0].role_name).to.be.eq('PUT_公司财务经理');

        await DELETE('/role', [newid]);
        records = await GET('/role', [newid]);

        expect(records[0]).to.be.eq(undefined);

    });
});