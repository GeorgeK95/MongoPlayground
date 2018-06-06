const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/*file edited*/

module.exports = (config) => {
    mongoose.connect(config.connectionString);

    let db = mongoose.connection;
    db.once('open', (err) => {
        if (err) {
            console.log(err);
            return;
        }

        console.log('Connected to db.');
    });

    db.on('error', (err) => {
        console.log(err);
    });

    require('../models/ImageSchema');
    require('../models/TagSchema');
};