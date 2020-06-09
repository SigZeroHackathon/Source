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

		var data = promiseResponse.data[0];
		var byteArr = data.message.split(/(?=(?:..)*$)/);
		var message = "";
		byteArr.forEach(x => message += String.fromCharCode(parseInt(x, 16)));

		context.res = { status: 200, 
			headers: {
				'Content-Type': 'application/json'
			},
			body: { promiseResponse, message } 
		}	
	}	
}