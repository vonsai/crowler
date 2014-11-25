var path = require('path');
var require_safe = function (module){
	try {
		var route = path.join(__dirname, module);
		return require(route);
	} catch (e){
		return {};
	}
}

var confis = {
	development: require_safe('development.json'),
	production: require_safe('production.json')
}

module.exports = exports = confis[(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'development') ? process.env.NODE_ENV : 'development'];