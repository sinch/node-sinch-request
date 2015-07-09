# Sinch HTTP Authentication node module

Node module to add authentication headers, or validate request headers, according to Sinch HTTP Authentication practice for Basic, Digest and Ticket authentication. Compatible with browserify for browser based applications.

Transforming request headers usually involves verifying and/or setting the following headers as needed;

 - authorization
 - x-timestamp
 - content-length
 - content-type

## Installing

Install is straight forward using npm; 

	npm install sinch-request --save

_Note: Module is compatible with browserify_

## Include in your project

	var sinchRequest = require('sinch-request');

Pass the options object through the relevant sinchRequest method, before proceeding with the http request, as shown in the following example.

	var sinchRequest = require('sinch-request');
	var https = require('https');

	// Your application credentials
	var creds = {
	  key: 'SOME_APP_KEY',
	  secret: 'SOME_APP_SECRET'
	}

	// HTTP request parameters for sending SMS
	var options = {
	  method: 'POST',
	  host: 'messagingapi-01.sinch.com',
	  port: 443,
	  path: '/v1/sms/+1555123456',
	  data: '{"message":"Hello World!"}', // Data to be sent in JSON format
	  withCredentials: false, // Necessary for browser compatability (browserify)
	};

	// Add basic authentication header (application)
	sinchRequest.applicationBasic(options, creds);

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

## Methods

- __applicationBasic__ - Basic authentication using application credentials
- __instanceBasic__ - Basic authentication using instance credentials
- __verifyBasic__ - Verify incoming request with Basic authentication (TBD)
- __applicationDigest__ - Digest authentication using application credentials
- __instanceDigest__ - Digest authentication using instance credentials
- __verifyDigest__ - Verify incoming request with Digest authentication (TBD)
- __ticket__ - Use a ticket for request authentication

## Application or Instance credentials?

Sinch credentials (key and secret pair) come in two flavors; __application__ and __instance__. 

_Application credentials_ are used when API calls are made on behalf of a particular application and are usually made by systems you control (not your customers or end-users). There are exceptions however, some User-API endpoints rely on basic auth, using only the application key for user authentication and creation (if enabled in dashboard). 

The important take-away is that the application secret must always be kept a secret, i.e. application signed requests using key and secret should strictly only be made by you, or systems you control.

_Instance credentials_ are used for authenticated users and have an expire time set. Usually the credentials are valid for 24 hours and can be used to access resources on behalf of that particular user, for example, when placing a call. A user can get instance credentials by providing an authentication ticket to the `/instance` endpoint on the base API (api.sinch.com). The authentication ticket itself can be created using the `sinch-ticketgen` module, or by relying on Sinch User Authentication services. See the [Sinch REST user guide](https://www.sinch.com/docs/overview/) for more information. 

## Basic or Digest authentication?

Sinch HTTP Authentication rely on two mechanisms to securley authenticate HTTP requests; __Basic Authentication__ and __Digest Authentication__. 

_Basic authentication_ will transmit the credential key/secret pair in readable form with no protection, except that provided by HTTPS. Basic Auth is usually considered secure enough for many operations but are limited to a few scenarios in the Sinch API, such as sending an SMS or requesting SMS verification, but not making a call. 

_Digest authentication_ add some security on top of HTTPS, in that the method will never transmit the secret. Instead the metod relies on a signature generated using various parts of the request header and body (if it's a POST), togheter with the credentials. This means it's not possible for an attacker to replicate the request or modify the request. The x-timestamp header reduce risk for replay-attacks, since older requests are not allowed. 

For instructions on how to use particular REST resources, please see the Sinch user guide.

## Samples

See the `samples/` folder, for some basic usage examples. Both samples work fine both in Node.js and in the browser by using browserify. 

First edit the relevant sample to ensure it got your credentials or user information. Then you can run the sample in Node using: 

	$ node samples/SAMPLE_NAME.js

If you'd like to run it in the browser, first [browserify](http://browserify.org) the sample into a browser-compatible script using: 

	$ browserify samples/SAMPLE_NAME.js > sample_bundle.js

Include the bundle in a web project, by adding the following tag to your HTML file:

	<script src="sample_bundle.js"></script>

Be sure to check the developer console for sample output. 

## Feedback 

Questions and/or feedback on this module can be sent by contacting [dev@sinch.com](mailto:dev@sinch.com).

## License

The MIT License (MIT)

Copyright (c) 2015 Sinch AB

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
