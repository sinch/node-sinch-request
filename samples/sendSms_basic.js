// Send SMS using Sinch

// This sample can be 'browserified' to run in the browser (Please see browserify.org)

var sinchRequest = require('../index.js');
var https = require('https');

// Your application credentials
var creds = {
  key: 'SOME_APP_KEY',
  secret: 'SOME_APP_SECRET'
}

// HTTP request parameters for sending SMS
var options = {
  protocol: 'https:',
  method: 'POST',
  host: 'messagingapi-01.sinch.com',
  port: 443,
  path: '/v1/sms/+1555123456',
  data: '{"message":"Hello World!"}', // Data to be sent in JSON format
  withCredentials: false, // Necessary for browser compatability (browserify)
};

// Use sinch-request to 'pre-process' request headers, adding authorization digest
sinchRequest.applicationSigned(options, creds);

// Perform the request
var req = https.request(options, function(response) {
  console.log('API response', response.statusCode);
  var data = '';
  response.on('data', function (chunk) {
    data += chunk;
  });
  response.on('end', function () {
    console.log('Response body: ' + data);
  });
});
req.end(options.data);
