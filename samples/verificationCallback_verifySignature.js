// HTTP backend for verification callbacks

var sinchRequest = require('../index.js');
var https = require('https');
var http = require('http'); // Note; http for demo purposes only, use https in production

const PORT=1024; 

// Your application credentials
var creds = {
  key: 'SOME_APP_KEY',
  secret: 'SOME_APP_SECRET'
}

// Process verification callback events
var handleEvent = function(requestData) {
	var responseData = {};

	switch(requestData.event) {
		case 'VerificationRequestEvent':
			// Do any optional checks (number, area code, or any included custom headers such as session id)
			responseData.action = 'allow'; // Allow sending SMS (may cost money)
			responseData.sms = {code: '1234'}; // Define a custom verification code (optional)
			break;
		case 'VerificationResultEvent':
			// Log result or take other action
			break
		default: 
			console.log('Unknown event');
	}

	return JSON.stringify(responseData);
}

// Create a server
var server = http.createServer(function handleRequest(request, response) {
	var data = '';
	request.on('data', function (chunk) {
		data += chunk;
	});

    request.on('end', function() {
    	request.data = data;

        console.log('Contents of request:', request.data);

	    var validSignature = sinchRequest.verifySignature(request, creds);
	    console.log(validSignature ? '  - valid signature' : '  - invalid signature');

        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        if(validSignature) {
	        response.end(handleEvent(JSON.parse(request.data)));        	
        }
        else {
        	response.end('{}');
        }
    });
});

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

