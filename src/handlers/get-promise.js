// src/handlers/get-promise.js

const request = require('request-promise');
const utils = require("../utils");
const promiseParser = require("../promise-parser");
const TextDecoder = require("text-encoding").TextDecoder;

module.exports.handler = async (context, req) => {
	var reqTopicId = utils.getQueryOrBodyParam(req, "topicID");
	var messages = await promiseParser.parsePromise(reqTopicId);

	context.res = { status: 200, 
		headers: {
			'Content-Type': 'application/json'
		},
		body: { messages }
	}		
}