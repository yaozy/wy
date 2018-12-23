const expect = require('chai').expect;
const { GET, POST, PUT, DELETE } = require('./sql');


describe('/log', function () {

    it('debug', async function () {
        let result = await POST('/log', { time: '2018-07-27', log_by: 'c_user', type: 'system', text: 'sckj' });

        let newid = result.insertId;

        let records = await GET('/log', [newid]);
        expect(records[0].log_by).to.be.eq('c_user');

        await PUT('/log', [newid], { time: '2018-07-28', log_by: 'put_user', type: 'put_system', text: 'put_sckj' });
        records = await GET('/log', [newid]);

        expect(records[0].log_by).to.be.eq('put_user');

        await DELETE('/log', [newid]);
        records = await GET('/log', [newid]);
        expect(records[0]).to.be.eq(undefined);

    });
});

