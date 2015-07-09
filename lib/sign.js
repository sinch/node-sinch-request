var assert = require('assert-plus');
var createHmac = require('create-hmac');
var createHash = require('create-hash');

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

//Return raw digest / signature for a request given a secret
var calcDigest = function(request, secret) {
	if(request.data) {
		var jsonData = (typeof request.data !== 'string' ? JSON.stringify(request.data) : request.data);
		setHeader('content-length', jsonData.length);
		setHeader('content-md5', createHash('md5').update(jsonData).digest('base64'));
	}

	var stringToSign = ''+
		request.method+'\n'+
		(getHeader('content-md5') || '')+'\n'+
		getHeader('content-type')+'\n'+
		'x-timestamp:'+getHeader('x-timestamp')+'\n'+
		request.path;

	removeHeader('content-md5');

	//Calculate signature
	var hmac = createHmac('SHA256', new Buffer(secret, 'base64'));
	hmac.update(stringToSign);
	var signature = hmac.digest('base64');

	return signature;
}

//Signed request (app secret OR instance secret) (INTERNAL)
var sign = function(type, options, credentials) {
	assert.string(type, 'type');
	assert.object(options, 'options');
	assert.object(credentials, 'credentials');
	assert.string(options.method, 'options.method must be any of POST/PUT/GET/DELETE/PATCH');
	assert.string(options.path, 'options.path');
	assert.string(credentials.key, 'credentials.key');
	assert.string(credentials.secret, 'credentials.secret');


	if(typeof options.headers === 'undefined') {
		options.headers = {};
	}
	headers = options.headers;

    if (!getHeader('x-timestamp'))
		setHeader('x-timestamp', (new Date()).toISOString());

	if (!getHeader('content-type'))
		setHeader('content-type', 'application/json; charset=UTF-8');

	var signature = calcDigest(options, credentials.secret);

	//Set the signature
	setHeader('authorization', type + credentials.key+':'+signature);
}

applicationSignedRequest = function(options, credentials) {
	return sign('application ', options, credentials);
}

instanceSignedRequest = function(options, credentials) {
	return sign('instance ', options, credentials);
}

//Will verify either Instance or Application signed request
verifySignedRequest = function(options, credentials) {
	//TBD !! 
}

module.exports = {
	applicationSignedRequest: applicationSignedRequest,
	instanceSignedRequest: instanceSignedRequest,
	signedRequest: sign,
	verify: verifySignedRequest,
}