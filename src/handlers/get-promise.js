const request = require('request-promise');

module.exports.handler = async (context, req) => {
	const dragonGlassOptions = {
	  url: "https://api-testnet.dragonglass.me/hedera/api/hcs/messages?topicID=0.0.61404",
	  headers: {
	    "X-API-KEY": "b38a648a-dbe4-3c90-bfb8-0af242280887"
	  },
	  json: true
	};

	var promiseResponse = await request(dragonGlassOptions)
		.then(function(response){
			return response;			
		});

	context.res = { status: 200, 
		headers: {
			'Content-Type': 'application/json'
		},
		body: { promiseResponse } 
	}	
}