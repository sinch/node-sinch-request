var basic = require('./lib/basic');
var ticket = require('./lib/ticket');
var sign = require('./lib/sign');

module.exports = {
	public: basic.publicAuthRequest,
	applicationBasic: basic.applicationBasicAuthRequest,
	instanceBasic: basic.instanceBasicAuthRequest,
	ticket: ticket.addTicket,
	applicationSigned: sign.applicationSignedRequest,
	instanceSigned: sign.instanceSignedRequest,
	verifySignature: sign.verifySignature, // TODO
};

