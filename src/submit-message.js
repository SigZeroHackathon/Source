// src/submit-message.js

const { Client, ConsensusMessageSubmitTransaction, Ed25519PrivateKey} = require("@hashgraph/sdk");
require("dotenv").config();

module.exports.submitMessage =  async function(submitKey, topicId, message, client){

	console.log("Submit message");
	const operatorPrivateKey = process.env.OPERATOR_KEY;
    const operatorAccount = process.env.OPERATOR_ID;
    if (operatorPrivateKey == null || operatorAccount == null) {
        throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
    }
	
	var message = await new ConsensusMessageSubmitTransaction()
		 .setTopicId(topicId)
		 .setMessage(message)
		 .build(client)
		 // Due to the topic having a submitKey requirement, additionally sign the transaction with that key.
		.sign(submitKey)
		.execute(client)
		//This didn't work for some reason...
		//.getReceipt(client);
		
	return message.getReceipt(client);
}
