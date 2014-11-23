var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Category = new Schema({
    id: ObjectId,
   	name: String,
    feedURL: String,
    lastBuilt: Number
});

module.exports = exports = Category;