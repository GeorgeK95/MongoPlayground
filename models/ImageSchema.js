const mongoose = require('mongoose')
const Schema = mongoose.Schema

let imageSchema = new Schema({
    url: {type: String, required: true},
    creationDate: {type: Date, default: Date.now},
    title: {type: String, required: true},
    description: {type: String},
    tags: []
})

module.exports = mongoose.model('Image', imageSchema)