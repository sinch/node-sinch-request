var assert = require('assert-plus');
var headerMap = require('./header-map');

addTicket = function(options, ticket) {
	assert.object(options, 'options');
	assert.string(ticket, 'ticket');

	if(typeof options.headers === 'undefined') {
		options.headers = {};
	}
	headerMap.headers = options.headers;

	if(options.data) {
		var jsonData = (typeof options.data !== 'string' ? JSON.stringify(options.data) : options.data);
		headerMap.setHeader('content-length', jsonData.length);
	}

    if (!headerMap.getHeader('x-timestamp'))
		headerMap.setHeader('x-timestamp', (new Date()).toISOString());

	if (!headerMap.getHeader('content-type'))
		headerMap.setHeader('content-type', 'application/json; charset=UTF-8');

	headerMap.setHeader('authorization','user ' + ticket);
}

module.exports = {
	addTicket: addTicket
}
