// src/handlers/balance.js

const utils = require("../utils");
const { Client, AccountBalanceQuery } = require("@hashgraph/sdk");
const operatorAccountId = process.env.OPERATOR_ID;
const operatorPrivateKey = process.env.OPERATOR_KEY;

module.exports.handler = async (context, req) => {

	context.log("Balance Handler hit");
	if (operatorPrivateKey == null ||
		operatorAccountId == null ) {
		throw new Error("environment variables OPERATOR_KEY and OPERATOR_ID must be present");
	}
	
	// Create our connection to the Hedera network
	const client = Client.forTestnet();

	// Set your client account ID and private key used to pay for transaction fees and sign transactions
	client.setOperator(operatorAccountId, operatorPrivateKey);

	  // Attempt to get and display the balance of our account
	var currentBalance = await new AccountBalanceQuery().setAccountId(operatorAccountId).execute(client);
	context.res = { status: 200, 
		headers: {
			'Content-Type': 'application/json'
		},
		body: { 'balance': currentBalance.toString() } }; 
  
};



