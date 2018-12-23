//id, pid, ct_name, sort, create_by, create_date, update_by, update_date, remarks, del_flag

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/charttype', function () {
    it('debug', async function () {
        let results = await POST('/charttype', {
            pid: '12345',
            ct_name: '房产管理',
            sort: 101,
            create_by: 'C_USER',
            create_date: '2018-07-29',
            remarks: '房产管理'
        });

        let newid = results.insertId;
        let records = await GET('/charttype', [newid]);
        expect(records[0].ct_name).to.be.eq('房产管理');

        await PUT('/charttype', [newid], {
            pid: '6789',
            ct_name: 'PUT_房产管理',
            sort: 102,
            update_by: 'PUT_USER',
            update_date: '2018-07-30',
            remarks: 'PUT_房产管理'
        });

        records = await GET('/charttype', [newid]);
        expect(records[0].ct_name).to.be.eq('PUT_房产管理');

        await DELETE('/charttype', [newid]);
        records = await GET('/charttype', [newid]);
        expect(records[0]).to.be.eq(undefined);

    });
});
