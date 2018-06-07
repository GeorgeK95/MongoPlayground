const REPLACE_ME_STR = '<div class="replaceMe"></div>';

let queryDataMapReal = {};

const Image = require('../models/ImageSchema');
const Tag = require('../models/TagSchema');
const baseHandler = require('../handlers/baseHandler');

const fs = require('fs');

function parseSearchRequestData(req) {
    queryDataMapReal = {};
    let queryDataStr = req.url.substr(req.url.indexOf('?') + 1);
    let splitterByAmpersand = queryDataStr.split('&')

    for (let pair of splitterByAmpersand) {
        let keyValuePair = pair.split('=');

        if (keyValuePair[1] !== '') {
            queryDataMapReal[keyValuePair[0]] = keyValuePair[1]
        }
    }
}

function listAll(req, res) {
    fs.readFile(__dirname + '/../views/results.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        Image.find({}, function (err, images) {
            sendImagesToClient(req, res, data, images);
        });
    })

}

function renderImages(images) {
    let htmlContent = '';

    for (let image of images) {
        if (image !== null) {
            htmlContent += `<fieldset><legend id="${image.title}"></legend>
                                                            <img src="${image.url}">
                                                            </img><p>${image.title}</p>
                                                            </img><p>${image.description}</p>
                                                            <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete</button>
                                                            </fieldset>`
        }
    }

    return htmlContent;
}
function sendImagesToClient(req, res, data, images) {
    let htmlContent = renderImages(images);

    data = data.toString().replace(REPLACE_ME_STR, htmlContent)
    baseHandler.handleOk(req, res, data)
}

function listByAllParams(req, res, data) {
    let tagNameValue = queryDataMapReal['tagName'];
    let afterDate = queryDataMapReal['afterDate'] || new Date(2000, 1, 1, 0, 0, 0, 0);
    let beforeDate = queryDataMapReal['beforeDate'] || new Date(2100, 1, 1, 0, 0, 0, 0);
    let limit = parseInt(queryDataMapReal['Limit']) || 10;

    Tag.findOne({name: tagNameValue}, function (err, tag) {
        if (tag === null) {
            baseHandler.handleOk(req, res, data)
            return
        }

        Image
            .find({tags: tag._id})
            .where('creationDate').gt(afterDate).lt(beforeDate)
            .limit(limit)
            .exec((err, images) => {
                if (err) console.log(err);

                sendImagesToClient(req, res, data, images);
            })
    });
}
function listByDatesOnly(req, res, data) {
    let afterDate = queryDataMapReal['afterDate'] || new Date(2000, 1, 1, 0, 0, 0, 0);
    let beforeDate = queryDataMapReal['beforeDate'] || new Date(2100, 1, 1, 0, 0, 0, 0);
    let limit = parseInt(queryDataMapReal['Limit']) || 10;

    Image
        .find({})
        .where('creationDate').gt(afterDate).lt(beforeDate)
        .limit(limit)
        .exec((err, images) => {
            if (err) console.log(err);

            sendImagesToClient(req, res, data, images);
        })
}

function listByParams(req, res) {
    fs.readFile(__dirname + '/../views/results.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        if (queryDataMapReal['tagName']) {
            listByAllParams(req, res, data);
        } else {
            listByDatesOnly(req, res, data)
        }
    })
}

function search(req, res) {
    parseSearchRequestData(req);

    if (getDictionarySize(queryDataMapReal) === 0) {
        listAll(req, res);
    } else {
        listByParams(req, res)
    }

}

function getDictionarySize(obj) {
    return Object.keys(obj).length;
}

module.exports = (req, res) => {
    if (req.pathname === '/search') {
        search(req, res)
    } else {
        return true
    }
}
