/**
 * Created by George-Lenovo on 6/1/2018.
 */

module.exports = {
    development: {
        //'mongodb://mpa:mpampa1@ds016718.mlab.com:16718/mongoplayground'
        connectionString:  process.env.MONGOLAB_URI,
        production: {}
    }
};