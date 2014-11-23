var request = require('request'),
	feedparser = require('feedparser'),
	moment = require('moment')

var parseFeed = function(url, cb){

	var parser = new feedparser()
	request.get(url)
		.on('error', cb)
		.pipe(parser)

	var category = {lastBuilt: -1, articles: []}

	parser.on('error', cb)
	parser.on('meta', function (meta) {
		
		category.lastBuilt = moment(meta['rss:lastbuilddate']['#'], 'ddd, DD MMM YYYY HH:mm:ss ZZ').unix()
	})
	parser.on('readable', function (res){

		var stream = this,
			item;

		while (item = stream.read()){
			var article = {}
			article.title = item.title
			article.text = item.description
			article.url = item.link
			article.imageURL = item['image']['url']
			article.timestamp = moment(item['rss:pubdate']['#'], 'ddd DD MMM YYYY HH:mm:ss ZZ').unix()

			category.articles.push(article)
		}
	})

	parser.on('end', function (){

		cb(null, category)
	})
}


module.exports = exports = parseFeed