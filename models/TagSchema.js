const mongoose = require('mongoose')

let tagSchema = new mongoose.Schema({
    name: {type: mongoose.SchemaTypes.String, required: true},
    creationDate: {type: mongoose.SchemaTypes.Date, default: Date.now},
    images: [{type: mongoose.SchemaTypes.ObjectId}]
})

tagSchema.methods.getNameToLowerCase = function () {
    return this.name.toLowerCase();
}

module.exports = mongoose.model('Tag', tagSchema)