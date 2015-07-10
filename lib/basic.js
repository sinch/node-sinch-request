var assert = require('assert-plus');
var headerMap = require('./header-map');

var sign = function(type, options, credentials) {
	assert.string(type, 'type');
	assert.object(options, 'options');
	assert.object(credentials, 'credentials');
	assert.string(credentials.key, 'credentials.key');

	if(typeof options.headers === 'undefined') {
		options.headers = {};
	}
	headerMap.headers = options.headers;

	if(options.data) {
		var jsonData = (typeof options.data !== 'string' ? JSON.stringify(options.data) : options.data);
		headerMap.setHeader('content-length', jsonData.length);
	}	
	if (!headerMap.getHeader('content-type'))
		headerMap.setHeader('content-type', 'application/json; charset=UTF-8');

	if(credentials.secret) {
		headerMap.setHeader('authorization', 'Basic ' + Buffer(type+'\\'+credentials.key+':'+credentials.secret).toString('base64'));
	}
	else {
		headerMap.setHeader('authorization', type + ' ' + credentials.key);
	}
}

publicAuthRequest = function(options, credentials) {
	applicationBasicAuthRequest(options);
}

applicationBasicAuthRequest = function(options, credentials) {
	credentials = credentials || {
		key: '669762D5-2B10-44E0-8418-BC9EE4457555' //Default to portal key (Sinch userspace - i.e. partner accounts)
	}

	return sign('application', options, credentials);
}

instanceBasicAuthRequest = function(options, credentials) {
	return sign('instance', options, credentials);
}

module.exports = {
	publicAuthRequest: publicAuthRequest,
	applicationBasicAuthRequest: applicationBasicAuthRequest,
	instanceBasicAuthRequest: instanceBasicAuthRequest,
}
