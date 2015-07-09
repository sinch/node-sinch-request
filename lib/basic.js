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

var sign = function(type, options, credentials) {
	assert.string(type, 'type');
	assert.object(options, 'options');
	assert.object(credentials, 'credentials');
	assert.string(credentials.key, 'credentials.key');

	if(typeof options.headers === 'undefined') {
		options.headers = {};
	}
	headers = options.headers;

	if(options.data) {
		var jsonData = (typeof options.data !== 'string' ? JSON.stringify(options.data) : options.data);
		setHeader('content-length', jsonData.length);
	}	
	if (!getHeader('content-type'))
		setHeader('content-type', 'application/json; charset=UTF-8');

	if(credentials.secret) {
		setHeader('authorization', 'Basic ' + Buffer(type+'\\'+credentials.key+':'+credentials.secret).toString('base64'));
	}
	else {
		setHeader('authorization', type + ' ' + credentials.key);
	}
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

//Will verify either Instance or Application signed request
verifySignedRequest = function(options, credentials) {
	//TBD !! 
}

module.exports = {
	applicationBasicAuthRequest: applicationBasicAuthRequest,
	instanceBasicAuthRequest: instanceBasicAuthRequest,
	verify: verifySignedRequest
}
