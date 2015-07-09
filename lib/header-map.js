
var setHeader = function(headerKey, value) {
	module.exports.headers[headerKey] = value;
}

var getHeader = function(headerKey) {
	return module.exports.headers[headerKey];
}

var removeHeader = function(headerKey) {
	delete module.exports.headers[headerKey];
}

module.exports = {
	headers: {},
	setHeader: setHeader,
	getHeader: getHeader,
	removeHeader: removeHeader,
}
