// List Sinch available "Direct Inward Dial" number pools available, using the partner administration API's
// Sample features a mix of basic auth and digest authentication

// This sample can be 'browserified' to run in the browser (Please see browserify.org)

var sinchRequest = require('../index.js');
var https = require('https');

// Step 1: Request authentication ticket for a particular user
var user = {
  email: 'PARTNER_USER@EXAMPLE.COM',
  password: 'SOME_PASSWORD'
}

var options = {
  method: 'POST',
  host: 'userapi.sinch.com',
  port: 443,
  path: '/v1/users/email/'+user.email+'/authentication',
  data: '{"password":"'+user.password+'"}',
  withCredentials: false,
};

sinchRequest.public(options); // Basic Auth w. Partner management application key (default)

var req = https.request(options, function(response) {
  console.log('Ticket request', response.statusCode);
  var data = '';
  response.on('data', function (chunk) {
    data += chunk;
  });
  response.on('end', function () {
    responseObj = JSON.parse(data);
    getInstance(responseObj.authorization);
  });
});
req.end(options.data);


// Step 2: Get instance (temporary key/secret) to access REST resources as a particular user
var getInstance = function(authTicket) {
  var options = {
    method: 'POST',
    host: 'api.sinch.com',
    port: 443,
    path: '/v1/instance',
    data: '{"version":{"os": "portal", "platform": "node"},expiresIn:128000}',
    withCredentials: false,
  };

  sinchRequest.ticket(options, authTicket); // Add ticket to authorization headers, necessary when retrieving an instance

  var req = https.request(options, function(response) {
    console.log('Instance request', response.statusCode);
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });    
    response.on('end', function () {
      var responseObj = JSON.parse(data);
      var creds = {
        key: responseObj.id,
        secret: responseObj.secret
      }
      getOrgs(creds);
    });
  });
  req.end(options.data);
}

// Step 3: Retrieve the organization assigned to the particular user we're authenticated as
var getOrgs = function(creds) {
  var options = {
    method: 'GET',
    host: 'api.sinch.com',
    port: 443,
    path: '/v1/organisations',
    withCredentials: false,
  };

  sinchRequest.instanceSigned(options, creds); // We sign our request using our instance key/secret with the Digest method (more secure)

  var req = https.request(options, function(response) {
    console.log('  Organization request', response.statusCode);
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      var responseObj = JSON.parse(data);
      getDidsForSale(creds, responseObj[0].id);
    });
  });
  req.end();
}

// Step 4: Retrieve the list of number pools available to given organizationId and particular user we're authenticated as
var getDidsForSale = function(creds, organizationId) {
  var options = {
    method: 'GET',
    host: 'portalapi.sinch.com',
    port: 443,
    path: '/v1/organisations/id/'+organizationId+'/numbers/shop',
    withCredentials: false,
  };

  sinchRequest.instanceSigned(options, creds); // We sign our request using our instance key/secret with the Digest method (more secure)

  var req = https.request(options, function(response) {
    console.log('  DID request', response.statusCode);
    var data = '';
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function () {
      var responseObj = JSON.parse(data);
      listDids(responseObj);
    });
  });
  req.end();
}

// Step 5: Pretty-print result of script
var listDids = function(didList) {
  console.log('\nList of available DIDs')
  for (var i = 0; i < didList.length; i++) {
    var didPool = didList[i];
    console.log(didPool.countryId + ', ' + didPool.city + '('+didPool.areaCode+') - ' + didPool.availability + ' numbers available');
  }
}
