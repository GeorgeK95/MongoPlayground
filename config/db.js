const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/*file edited*/

module.exports = (/*config*/) => {
    console.log('gtest:' + process.env.MONGOLAB_URI);

    mongoose.connect(process.env.MONGOLAB_URI);

    console.log(11);

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