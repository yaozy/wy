//ct_id, chart_name, chart_json, tbname, is_use, sort, create_by, create_date, update_by, update_date, remarks, del_flag

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');

describe('/chart', function () {
    it('debug', async function () {
        let results = await POST('/chart', {
            ct_id: '12345',
            chart_name: '房产管理面积分析柱状图',
            chart_json: '{"f1":1,"f2":2,"f3":3}',
            tbname: 'T_FCTJB',
            is_use: 1,
            sort: 101,
            create_by: 'C_USER',
            create_date: '2018-07-29',
            remarks: '房产管理面积分析柱状图'
        });

        let newid = results.insertId;
        let records = await GET('/chart', [newid]);
        expect(records[0].chart_name).to.be.eq('房产管理面积分析柱状图');

        await PUT('/chart', [newid], {
            ct_id: '6789',
            chart_name: 'PUT_房产管理面积分析柱状图',
            chart_json: '{"f1":1,"f2":2,"f3":3,"f4":"string"}',
            tbname: 'T_FCTJB',
            is_use: 0,
            sort: 102,
            update_by: 'PUT_USER',
            update_date: '2018-07-30',
            remarks: 'PUT_房产管理面积分析柱状图'
        });

        records = await GET('/chart', [newid]);
        expect(records[0].chart_name).to.be.eq('PUT_房产管理面积分析柱状图');

        await DELETE('/chart', [newid]);
        records = await GET('/chart', [newid]);
        expect(records[0]).to.be.eq(undefined);

    });
});

