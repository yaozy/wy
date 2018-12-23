const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/company', function () {

    it('debug', async function () {

        let result = await POST('/company', {
            comp_code: 'sckj',
            comp_name: '顺彩科技',
            logo: 'sckjsckjsckj',
            tel: '18922229999',
            email: 'sckj@sckj.com',
            website: 'wwww.sckj.com',
            create_by: 'C_user',
            create_date: '2018-07-01',
            remarks: 'sckj'
        });

        //console.log(result);
        let newid = result.insertId;

        //Console.log('1');
        //Console.log(newid);

        let records = await GET('/company', [newid]);
        expect(records[0].comp_name).to.be.eq('顺彩科技');

        await PUT('/company', [newid], {
            comp_code: 'PUT_sckj',
            comp_name: 'PUT_顺彩科技',
            logo: 'PUT_sckjsckjsckj',
            tel: 'PUT_18922229999',
            email: 'PUT_sckj@sckj.com',
            website: 'PUT_wwww.sckj.com',
            update_by: 'U_user',
            update_date: '2018-07-07',
            remarks: 'PUT-sckj'
        });
        records = await GET('/company', [newid]);
        expect(records[0].comp_name).to.be.eq('PUT_顺彩科技');

        await DELETE('/company', [newid]);
        records = await GET('/company', [newid]);
        expect(records[0]).to.be.eq(undefined);
    });



});