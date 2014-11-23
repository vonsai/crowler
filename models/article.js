var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Article = new Schema({
    id: ObjectId,
   	title: String,
   	description: String,
   	timestamp: Number,
   	text: String,
   	imageURL: String,
   	url: String,

    category: {type: ObjectId, ref: 'Category'},
    subcategory: String
});

module.exports = exports = Article;