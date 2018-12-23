//select id, user_password, user_name, jobno, phone, email, is_use, sort, create_by, create_date, update_by, update_date, remarks, del_flag from userinfo;

const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/user', function () {

    it('debug', async function () {

        let result = await POST('/user', {
            id: 'system_new',
            user_password: '123456789',
            user_name: '系统管理员',
            jobno: '10089',
            phone: '18922229999',
            email: 'sckj@sckj.com',
            is_use: 1,
            sort: 101,
            create_by: 'C_user',
            create_date: '2018-07-01',
            remarks: '系统管理员'
        });

        let records = await GET('/user', ['system_new']);
        expect(records[0].user_name).to.be.eq('系统管理员');

        await PUT('/user', ['system_new'], {
            user_password: 'PUT_123456789',
            user_name: 'PUT_系统管理员',
            jobno: 'PUT_10089',
            phone: 'PUT_18922229999',
            email: 'PUT_sckj@sckj.com',
            is_use: 1,
            sort: 102,
            update_by: 'U_user',
            update_date: '2018-07-07',
            remarks: 'PUT_系统管理员'
        });
        records = await GET('/user', ['system_new']);
        expect(records[0].user_name).to.be.eq('PUT_系统管理员');

        await DELETE('/user', ['system_new']);
        records = await GET('/user', ['system_new']);
        expect(records[0]).to.be.eq(undefined);
    });



});