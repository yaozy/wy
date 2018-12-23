//select id, pid, func_name, type, sort, remarks, del_flag from funcinfo;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/function', function () {
    it('debug', async function () {
        let results = await POST('/function', {
            pid: 999, func_name: 'f_org_func', func_url: '/system', type: 'page', sort: 101, remarks: 'f_org_func'
        });

        let newid = results.insertId;
        let records = await GET('/function', [newid]);
        expect(records[0].func_name).to.be.eq('f_org_func');

        await PUT('/function', [newid], {
            pid: 998, func_name: 'PUT_f_org_func', func_url: '/put_system', type: 'PUT_page', sort: 102, remarks: 'PUT_f_org_func'
        });
        records = await GET('/function', [newid]);

        expect(records[0].func_name).to.be.eq('PUT_f_org_func');

        await DELETE('/function', [newid]);
        records = await GET('/function', [newid]);

        expect(records[0]).to.be.eq(undefined);

    });
});