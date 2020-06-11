// src/handlers/create-promise.js

const utils = require("../utils");
const sm = require("../submit-message");
const pb = require("../promise-builder");
const promiseParser = require("../promise-parser");

const { Client, ConsensusMessageSubmitTransaction, Ed25519PrivateKey, Ed25519PublicKey} = require("@hashgraph/sdk");
const operatorAccountId = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_KEY;

module.exports.handler = async (context, req) => {
	const topicId = utils.getQueryOrBodyParam(req, "topicID");
	
	context.log("Update promise");
	if (operatorPrivateKey == null ||
		operatorAccountId == null ) {
		throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
	}
	
	// Create our connection to the Hedera network
	const client = Client.forTestnet();
	
	// Set your client account ID and private key used to pay for transaction fees and sign transactions
	client.setOperator(operatorAccountId, operatorPrivateKey);

	var toParties = [];
	var reqToParties = utils.getQueryOrBodyParam(req, "toParties");
	if(reqToParties){
		var reqToPartiesArr = reqToParties.split(",");
		reqToPartiesArr.forEach(x => {
			toParties.push({
				party_id: x
			});
		});
	}	

	var onBehalfParties = [];
	var reqOnBehalfParties = utils.getQueryOrBodyParam(req, "onBehalfParties");
	if(reqOnBehalfParties){
		var reqOnBehalfPartiesArr = reqOnBehalfParties.split(",");
		reqOnBehalfPartiesArr.forEach(x => {
			onBehalfParties.push({
				party_id: x
			});
		});
	}

	var reqObId = utils.getQueryOrBodyParam(req, "obId");
	var allMessages = await promiseParser.parsePromise(topicId);
	var latestMessage = allMessages.sort((a, b) => {
		var aDate = new Date(a.consensusTime).getTime();
		var bDate = new Date(b.consensusTime).getTime();
		if(a < b) return -1;
		if(a > b) return 1;
		if(a == b) return 0;
	})[0];

	var reqNewAttestations = utils.getQueryOrBodyParam(req, "attestations");

	var promiseModel = pb.updatePromise(JSON.parse(latestMessage.messageText), reqObId, toParties, onBehalfParties, reqNewAttestations);

	if(promiseModel){	
		returnMessage = await sm.submitMessage(topicId, JSON.stringify(promiseModel), client);

		context.res = { status: 200, 
			headers: {
				'Content-Type': 'application/json'
			},
			body: { returnMessage, promiseModel } 
		}
	} else {
		context.res = { status: 200, 
			headers: {
				'Content-Type': 'application/json'
			},
			body: {  } 
		}
	}		
};