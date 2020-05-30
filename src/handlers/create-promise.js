// src/handlers/create-promise.js

const utils = require("../utils");
const cpt = require("../create-private-topic");
const sm = require("../submit-message");
const { Client, ConsensusMessageSubmitTransaction, Ed25519PrivateKey, Ed25519PublicKey} = require("@hashgraph/sdk");
const operatorAccountId = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_KEY;

module.exports.handler = async (context, req) => {

	context.log("Create promise");
	if (operatorPrivateKey == null ||
		operatorAccountId == null ) {
		throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
	}
	
	// Create our connection to the Hedera network
	const client = Client.forTestnet();

	// Set your client account ID and private key used to pay for transaction fees and sign transactions
	client.setOperator(operatorAccountId, operatorPrivateKey);
	
	//Create topic for promise
	const submitKey = await Ed25519PrivateKey.generate();
	
	myTopic = await cpt.createPrivateTopic(submitKey);
	
	const topicId = myTopic.topicId;
	const message = "Hello world";
	
	myMessage = await sm.submitMessage(submitKey, topicId, message, client);
	
	context.res = { status: 200, 
		headers: {
			'Content-Type': 'application/json'
		},
		body: { myTopic, myMessage } 
	}
};



