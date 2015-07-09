var basic = require('./lib/basic');
var ticket = require('./lib/ticket');
var sign = require('./lib/sign');

module.exports = {
	applicationBasic: basic.applicationBasicAuthRequest, //DONE!
	instanceBasic: basic.instanceBasicAuthRequest, //DONE!
	verifyBasic: basic.verify, //TBD
	ticket: ticket.addTicket, //DONE!
	applicationDigest: sign.applicationSignedRequest, //DONE!
	instanceDigest: sign.instanceSignedRequest, //DONE!
	verifyDigest: sign.verify, //TBD
};

