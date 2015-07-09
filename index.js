var basic = require('./lib/basic');
var ticket = require('./lib/ticket');
var sign = require('./lib/sign');

module.exports = {
	applicationBasic: basic.applicationBasicAuthRequest,
	instanceBasic: basic.instanceBasicAuthRequest,
	verifyBasic: basic.verify, // TODO
	ticket: ticket.addTicket,
	applicationDigest: sign.applicationSignedRequest,
	instanceDigest: sign.instanceSignedRequest,
	verifyDigest: sign.verify, // TODO
};

