const formidable = require('formidable')
const baseHandler = require('./baseHandler')
const fs = require('fs')
const db = require('../config/db')
const mongoose = require('mongoose')

const Tag = require('../models/TagSchema');
const Image = require('../models/ImageSchema')

const REPLACE_ME_STR = '<div class="replaceMe"></div> '

function initializeObjectIdsArray(fields) {
    let objectsArr = [];

    let tagIds = fields.tagsID.split(',')

    tagIds = tagIds.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b)
        return a
    }, []);

    for (let i = 0; i < tagIds.length - 1; i++) {
        let obj = mongoose.Types.ObjectId(tagIds[i])
        objectsArr[i] = obj;
    }

    return objectsArr;
}
function addImage(req, res) {
    let form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        fs.readFile('./views/index.html', (err, data) => {
            if (err) {
                console.log(err)
                return
            }

            let objectsArr = initializeObjectIdsArray(fields);

            Image.create({
                url: fields.imageUrl,
                title: fields.imageTitle,
                description: fields.description,
                tags: objectsArr
            }).then((img) => {
                for (let tag of objectsArr) {
                    Tag.findOneAndUpdate({_id: tag}, {$push: {images: img._id}}, function (err, data) {
                        if (err) console.log(err);
                    })
                }

                baseHandler.handleSeeOther(req, res, data)
            }).catch(err => {
                console.log(err);
                baseHandler.handleInternalServerError(req, res)
            })

        });
    });
}

function deleteImg(req, res) {
    let queryDataStr = req.url.substr(req.url.indexOf('?') + 1)
    let imgId = queryDataStr.split('=')[1]

    Image.findOne({_id: imgId}).exec((err, image) => {
        if (err) console.log(err);

        Tag.update(
            {_id: image.tags},
            {$pull: {images: imgId}},
            {safe: true},
            function (err, data) {
                if (err) console.log(err);

                Image.remove({_id: imgId}).exec((err, data) => {
                    if (err) console.log(err);

                    baseHandler.handleSeeOther(req, res, '')
                })
            });
    })
}

module.exports = (req, res) => {
    if (req.pathname === '/addImage' && req.method === 'POST') {
        addImage(req, res)
    } else if (req.pathname === '/delete' && req.method === 'GET') {
        deleteImg(req, res)
    } else {
        return true
    }
}
