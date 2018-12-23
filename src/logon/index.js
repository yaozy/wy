const app = require('../base/app');


app.route('/logon', false, require('./logon'));
app.route('/main', false, require('./main'));
