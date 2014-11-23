var _ = require('async')
var config = require('./config'), 
	db = require('./db')

var Category = db.model('Category')

var setup = function() {

	console.log('vonsai crowler: ' + config.env)

	//Setup categories
	var categories = require('./data/categories')
	_.filter(categories, function (cat, callback){
		
		//Check what categories are already in the db
		Category.findOne({name:cat.name}, function(err, c) {

			if (err || !c) {
				callback(true)
			} else {
				callback(false)
			}
		})

	}, function(categoriesToAdd) {
		_.eachSeries(categoriesToAdd, function(cat, cb){

			var dbcat = new Category({name: cat.name, feedURL: cat.feedURL, lastBuilt: 0});
			dbcat.save(cb)

		}, function (err) {
			if (err) {
				console.log('ERROR adding categories '+err)
			}
		})
	})
}

var run = function() {
	console.log('Starting crowler');

	var interval = config.crowlInterval
	console.log('Scheduling crowler for '+ interval)
	setTimeout(run, interval * 1000);
}

setup();
run();