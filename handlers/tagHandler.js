const formidable = require('formidable');
const baseHandler = require('./baseHandler');
const fs = require('fs');

const Tag = require('../models/TagSchema');

const REPLACE_ME_STR = '<div class="replaceMe"></div> ';

function generateTagProcess(req, res) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        fs.readFile(__dirname + '/../views/index.html', (err, data) => {
            if (err) {
                console.log(err);
                return;
            }

            let name = fields.tagName;

            Tag.create({
                name: name,
                images: []
            }).then(() => {
                baseHandler.handleSeeOther(req, res, data)
            }).catch(err => {
                console.log(err);
                baseHandler.handleInternalServerError(req, res)
            })
        });
    });
}

module.exports = (req, res) => {
    if (req.pathname === '/generateTag' && req.method === 'POST') {
        generateTagProcess(req, res)
    } else {
        return true
    }
}
