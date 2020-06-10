// src/handlers/get-promise.js

const request = require('request-promise');
const utils = require("../utils");
const TextDecoder = require("text-encoding").TextDecoder;

module.exports.handler = async (context, req) => {
	var reqTopicId = utils.getQueryOrBodyParam(req, "topicID");
	if(reqTopicId){
		const dragonGlassOptions = {
		  url: "https://api-testnet.dragonglass.me/hedera/api/hcs/messages?topicID=" + reqTopicId,
		  headers: {
		    "X-API-KEY": "b38a648a-dbe4-3c90-bfb8-0af242280887"
		  },
		  json: true
		};

		var promiseResponse = await request(dragonGlassOptions)
			.then(function(response){
				return response;			
			});

		var numRecords = promiseResponse.totalCount;
		var messages = [];
		var byteArr, message;
		
		for (var i =0; i<numRecords; i++) {
			currentRecord = promiseResponse.data[i];
			byteArr = currentRecord.message.split(/(?=(?:..)*$)/);
			messageText = "";
			byteArr.forEach(x => messageText += String.fromCharCode(parseInt(x, 16)));
			
			message = {
				"messageText": messageText,
				"consensusTime": currentRecord.consensusTime,
				"readableTransactionID": currentRecord.readableTransactionID,
				"transactionID": currentRecord.transactionID
			}
			messages.push(message);
		}
		

		context.res = { status: 200, 
			headers: {
				'Content-Type': 'application/json'
			},
			body: { messages }
		}	
	}	
}