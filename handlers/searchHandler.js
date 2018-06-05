const REPLACE_ME_STR = '<div class="replaceMe"></div>';

let queryDataMap = [];

const Image = require('../models/ImageSchema');
const Tag = require('../models/TagSchema');
const baseHandler = require('../handlers/baseHandler');

const fs = require('fs');

function parseSearchRequestData(req) {
    queryDataMap = [];
    let queryDataStr = req.url.substr(req.url.indexOf('?') + 1);
    let splitterByAmpersand = queryDataStr.split('&')

    for (let pair of splitterByAmpersand) {
        let keyValuePair = pair.split('=');

        if (keyValuePair[1] !== '') {
            queryDataMap.push({
                key: keyValuePair[0],
                value: keyValuePair[1]
            });
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
            let htmlContent = '';
            for (let image of images) {
                let imageInstanceReplacement = `<fieldset><legend id="${image.title}"></legend> 
                                        <img src="${image.url}">
                                        </img><p>${image.title}</p>
                                        </img><p>${image.description}</p>
                                        <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete</button> 
                                        </fieldset>`
                htmlContent += imageInstanceReplacement
            }

            data = data.toString().replace(REPLACE_ME_STR, htmlContent)

            baseHandler.handleOk(req, res, data)
        });
    })

}
function listByParams(req, res) {
    fs.readFile(__dirname + '/../views/results.html', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        let tagNameValue = queryDataMap[0].value;

        Tag.findOne({name: tagNameValue}, function (err, tag) {
            if (tag === null) {
                baseHandler.handleOk(req, res, data)
                return
            }
            let htmlContent = '';

            for (let imageId of tag.images) {
                Image.findOne({_id: imageId}, function (err, image) {
                    if (err) console.log(err);

                    if (image !== null) {
                        let imageInstanceReplacement = `<fieldset><legend id="${image.title}"></legend> 
                                        <img src="${image.url}">
                                        </img><p>${image.title}</p>
                                        </img><p>${image.description}</p>
                                        <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete</button> 
                                        </fieldset>`
                        htmlContent += imageInstanceReplacement

                        data = data.toString().replace(REPLACE_ME_STR, imageInstanceReplacement)

                        baseHandler.handleOk(req, res, data)
                    }
                })
            }

        });
    })


}
function search(req, res) {
    parseSearchRequestData(req);

    if (isEmpty(queryDataMap)) {
        listAll(req, res);
    } else {
        listByParams(req, res)
    }

}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = (req, res) => {
    if (req.pathname === '/search') {
        search(req, res)
    } else {
        return true
    }
}
