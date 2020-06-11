// src/create-private-topic.js

const { Client, ConsensusTopicCreateTransaction, Ed25519PrivateKey } = require("@hashgraph/sdk");
require("dotenv").config();

module.exports.createPrivateTopic = async function(appId){
	
	console.log("Create private topic");
	
    const operatorPrivateKey = process.env.OPERATOR_KEY;
    const operatorAccount = process.env.OPERATOR_ID;
    const submitKey = Ed25519PrivateKey.fromString(process.env.SUBMIT_KEY);    
	
    if (operatorPrivateKey == null || operatorAccount == null) {
        throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
    }

    const client = Client.forTestnet();

    client.setOperator(operatorAccount, operatorPrivateKey);

    const submitPublicKey = submitKey.publicKey;

    const transactionId = await new ConsensusTopicCreateTransaction()
        .setTopicMemo("sigzero_" + appId)
        .setSubmitKey(submitPublicKey)
        .execute(client);

    const receipt = await transactionId.getReceipt(client); 
    const topicId = receipt.getConsensusTopicId(); 

	//What is ${[X]} notation?
	var createdTopic = {
		submitKey: `${submitKey}`,
		"receipt": `${receipt.status}`,
		"topicId": `${topicId}`
	};
	
	return createdTopic;
}
