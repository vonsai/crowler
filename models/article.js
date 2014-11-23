var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Article = new Schema({
   	title: String,
   	subtitle: String,
   	description: String,
   	timestamp: Number,
   	text: String,
   	imageURL: String,
   	url: String,

    category: {type: ObjectId, ref: 'Category'}
});

module.exports = exports = Article;