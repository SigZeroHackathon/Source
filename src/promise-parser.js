const request = require('request-promise');

module.exports.parsePromise = async (topicId) => {
	if(topicId){
		const dragonGlassOptions = {
		  url: "https://api-testnet.dragonglass.me/hedera/api/hcs/messages?topicID=" + topicId,
		  headers: {
		    "X-API-KEY": "b38a648a-dbe4-3c90-bfb8-0af242280887"
		  },
		  json: true
		};

		var promiseResponse = await request(dragonGlassOptions)
			.then(function(response){
				return response;			
			});

		if(promiseResponse.status == 500){
			return [];
		}

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

		return messages;
	}
}