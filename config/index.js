var path = require('path');
var require_safe = function (module){
	try {
		var route = path.join(__dirname, module);
		return require(route);
	} catch (e){
		return {};
	}
}

var dev = require_safe('development.json');
var prod = require_safe('production.json');

var confis = {
	development: dev,
	production: prod
}

module.exports = exports = confis[process.env.NODE_ENV || 'development'];