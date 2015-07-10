var assert = require('assert-plus');
var createHmac = require('create-hmac');
var createHash = require('create-hash');
var headerMap = require('./header-map');

//Return raw digest / signature for a request given a secret
var calcDigest = function(request, secret) {
	var dataToAnalyze = request.data || request.body;
	if(dataToAnalyze) {
		var jsonData = (typeof dataToAnalyze !== 'string' ? JSON.stringify(dataToAnalyze) : dataToAnalyze);
		headerMap.setHeader('content-length', dataToAnalyze.length);
		headerMap.setHeader('content-md5', createHash('md5').update(dataToAnalyze).digest('base64'));
	}

	var stringToSign = ''+
		request.method+'\n'+
		(headerMap.getHeader('content-md5') || '')+'\n'+
		headerMap.getHeader('content-type')+'\n'+
		'x-timestamp:'+headerMap.getHeader('x-timestamp')+'\n'+
		request.path;

	headerMap.removeHeader('content-md5');

	//Calculate signature
	var hmac = createHmac('SHA256', new Buffer(secret, 'base64'));
	hmac.update(stringToSign);
	var signature = hmac.digest('base64');

	return signature;
}

//Signed request (app secret OR instance secret) (INTERNAL)
var sign = function(type, options, credentials) {
	options.path = options.path || (options.url && options.url.match(/^https?:\/\/[^\/]+([^#]*)/)[1]) || (options.uri && options.uri.match(/^https?:\/\/[^\/]+([^#]*)/)[1])

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
	headerMap.headers = options.headers;

    if (!headerMap.getHeader('x-timestamp'))
		headerMap.setHeader('x-timestamp', (new Date()).toISOString());

	if (!headerMap.getHeader('content-type'))
		headerMap.setHeader('content-type', 'application/json; charset=UTF-8');

	var signature = calcDigest(options, credentials.secret);

	//Set the signature
	headerMap.setHeader('authorization', type + credentials.key+':'+signature);
}

applicationSignedRequest = function(options, credentials) {
	return sign('application ', options, credentials);
}

instanceSignedRequest = function(options, credentials) {
	return sign('instance ', options, credentials);
}

//Will verify either Instance or Application signed request
verifySignedRequest = function(options, credentials) {
	throw new Error('Not yet implemented.');
}

module.exports = {
	applicationSignedRequest: applicationSignedRequest,
	instanceSignedRequest: instanceSignedRequest,
	signedRequest: sign,
	verify: verifySignedRequest,
}
