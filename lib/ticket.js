var assert = require('assert-plus');

var headers = {}; //Default none 

var setHeader = function(headerKey, value) {
	headers[headerKey] = value;
}

var getHeader = function(headerKey) {
	return headers[headerKey];
}

var removeHeader = function(headerKey) {
	delete headers[headerKey];
}

addTicket = function(options, ticket) {
	assert.object(options, 'options');
	assert.string(ticket, 'ticket');

	if(typeof options.headers === 'undefined') {
		options.headers = {};
	}
	headers = options.headers;

	if(options.data) {
		var jsonData = (typeof options.data !== 'string' ? JSON.stringify(options.data) : options.data);
		setHeader('content-length', jsonData.length);
	}

    if (!getHeader('x-timestamp'))
		setHeader('x-timestamp', (new Date()).toISOString());

	if (!getHeader('content-type'))
		setHeader('content-type', 'application/json; charset=UTF-8');

	setHeader('authorization','user ' + ticket);
}

module.exports = {
	addTicket: addTicket
}
