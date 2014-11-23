var mongoose = require('mongoose');
var models = require('./models');

var config = require('./config');

mongoose.connect(config.db);

mongoose.model('Category', models.category);
mongoose.model('Article', models.article)

module.exports = exports = mongoose;