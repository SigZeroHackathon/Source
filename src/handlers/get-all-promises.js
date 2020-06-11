// src/handlers/get-all-promises.js

const request = require('request-promise');
const utils = require("../utils");
const promiseParser = require("../promise-parser");
const TextDecoder = require("text-encoding").TextDecoder;

module.exports.handler = async (context, req) => {
	var appId = utils.getQueryOrBodyParam(req, "appId");
	var messages = await promiseParser.getTopics("sigzero_" + appId);

	context.res = { status: 200, 
		headers: {
			'Content-Type': 'application/json'
		},
		body: { messages }
	}		
}