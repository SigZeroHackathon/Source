// src/handlers/create-promise.js

const utils = require("../utils");
const sm = require("../submit-message");
const pb = require("../promise-builder");
const { Client, ConsensusMessageSubmitTransaction, Ed25519PrivateKey, Ed25519PublicKey} = require("@hashgraph/sdk");
const operatorAccountId = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_KEY;

module.exports.handler = async (context, req) => {
	const topicId = utils.getQueryOrBodyParam(req, "topicID");
	
	context.log("Create promise");
	if (operatorPrivateKey == null ||
		operatorAccountId == null ) {
		throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
	}
	
	// Create our connection to the Hedera network
	const client = Client.forTestnet();
	
	const submitKey = utils.getQueryOrBodyParam(req, "submitKey");	
	byteArr = submitKey.split(/(?=(?:..)*$)/);
	messageText = "";
	byteArr.forEach(x => messageText += String.fromCharCode(parseInt(x, 16)));
	console.log(messageText);
	//const submitKey = await Ed25519PrivateKey.generate();

	// Set your client account ID and private key used to pay for transaction fees and sign transactions
	client.setOperator(operatorAccountId, operatorPrivateKey);

	reqByParty = utils.getQueryOrBodyParam(req, "byParty");
	var byParty = {};
	if(reqByParty){
		byParty.party_id = reqByParty;
	}

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

	var reqObligation = utils.getQueryOrBodyParam(req, "ob");

	var promiseModel = pb.buildNewPromise(byParty, toParties, onBehalfParties, reqObligation);

	if(promiseModel){	
		returnMessage = await sm.submitMessage(submitKey, topicId, JSON.stringify(promiseModel), client);

		context.res = { status: 200, 
			headers: {
				'Content-Type': 'application/json'
			},
			body: { myTopic, returnMessage, promiseModel } 
		}
	} else {
		context.res = { status: 200, 
			headers: {
				'Content-Type': 'application/json'
			},
			body: { myTopic } 
		}
	}		
};


