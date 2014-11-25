var _ = require('async')
var config = require('./config'), 
	db = require('./db'),
	parseFeed = require('./feed')

var Article = db.model('Article')
var Category = db.model('Category')

var setup = function() {

	console.log('vonsai crowler: ' + config.env)

	//Setup categories
	var categories = require('./data/categories')
	_.filter(categories, function (cat, callback){
		
		//Check what categories are already in the db
		Category.findOne({name:cat.name}, function(err, c) {

			callback(err || !c)
		})

	}, function(categoriesToAdd) {
		_.each(categoriesToAdd, function(cat, cb){

			//Add category to db
			var dbcat = new Category(cat)
			_.series([

				function(cbb) {
					//Save category in db
					dbcat.save(cbb)
				},
				function(cbb) {
					//TODO: Add category to users [Issue: https://github.com/vonsai/crowler/issues/1]
					cbb(null, null)
				}], function (results){
					cb()
				}
			)
			
			dbcat.save(cb);
			
		}, handleError)
	})
}

var run = function() {
	console.log('Starting crowler');

	var number = 0
	Category.find({}, function (err, cats) {

		handleError(err)
		if (cats) {
			//For all categories
			_.each(cats, function (cat, cb){
				//RSS feed
				parseFeed(cat.feedURL, function (err, feed) {

					handleError(err)
					//Has feed changed?
					if (feed && feed.lastBuilt > cat.lastBuilt) {

						cat.lastBuilt = feed.lastBuilt

						//Check what articles are already in the db
						_.filter(feed.articles, function(article, cbb) {

							Article.findOne({title: article.title, timestamp: article.timestamp}, function (err, a){
								cbb(err || !a)
							})

						}, function (articlesToAdd){

							_.each(articlesToAdd, function (art, cbbb){

								var dbarticle = new Article(art)
								dbarticle.category = cat._id

								dbarticle.save(cbbb)
								number += 1
							}, function (err) {

								handleError(err)
								cat.save(cb)
							})
						})
					} else {
						cb()
					}
				})
			}, function() {
				console.log('Added '+ number+ ' articles')

				var interval = config.crowlInterval
				console.log('Scheduling crowler for '+ interval)
				setTimeout(run, interval * 1000);
			})
		}
	})
}

var handleError = function (err) {

	if (err) {
		console.log('ERROR '+ err)
	}
}

setup();
run();

