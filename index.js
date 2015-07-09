var basic = require('./lib/basic');
var ticket = require('./lib/ticket');
var sign = require('./lib/sign');

module.exports = {
	public: basic.applicationBasicAuthRequest,
	applicationBasic: basic.applicationBasicAuthRequest,
	instanceBasic: basic.instanceBasicAuthRequest,
	verifyBasic: basic.verify, // TODO
	ticket: ticket.addTicket,
	applicationSigned: sign.applicationSignedRequest,
	instanceSigned: sign.instanceSignedRequest,
	verify: sign.verify, // TODO
};

