const { v4: uuidv4 } = require('uuid');

module.exports.buildNewPromise = (byParty, toParties, onBehalfOfParties, obligation, description, notes) => {
	
	console.log("Build new promise");
	if(!byParty || !byParty.party_id){
		return undefined;
	}

	var establishedDate = new Date();
	var expriationDate = new Date(establishedDate.getTime());
	expriationDate.setFullYear(expriationDate.getFullYear() + 1);

	var model = {
		promise_id: "",
		established: establishedDate.toUTCString(),
		concluded: "",
		status: 2,
		expriation: expriationDate.toUTCString(),
		description: description,
		notes: notes,
		parties: [
			//{
			//	party_id:"",
			//	name:"",
			//	notes:""
			//}
		],
		obligations: [
			{
				id: 1,
				obligation: obligation,
				by_party: byParty.party_id,
				to_parties: [],
				on_behalf_of: [],
				attestations: [],
				status: 2,
				conditions: "",
				attachments: [],
				expriation: expriationDate.toUTCString(),
				dependent_on: []
			}
		]
	};

	model.parties.push(byParty);
	model.parties = model.parties.concat(toParties);
	model.parties = model.parties.concat(onBehalfOfParties);

	model.obligations[0].to_parties = model.obligations[0].to_parties.concat(toParties.map(x => x.party_id));

	model.obligations[0].on_behalf_of = model.obligations[0].on_behalf_of.concat(onBehalfOfParties.map(x => x.party_id));

	return model;
}

module.exports.updatePromise = (promise, obligationId, newToParties, newOnBehalfParties, newAttestations) => {

	promise.parties = promise.parties.concat(newToParties);
	promise.parties = promise.parties.concat(newOnBehalfParties);

	var obligationIndex = promise.obligations.findIndex(x => x.id === obligationId);

	if(obligationIndex < 0) return;

	promise.obligations[obligationIndex].to_parties = promise.obligations[obligationIndex].to_parties.concat(newToParties.map(x => x.party_id));

	promise.obligations[obligationIndex].on_behalf_of = promise.obligations[obligationIndex].on_behalf_of.concat(newOnBehalfParties.map(x => x.party_id));

	newAttestations.forEach(newAttestation => {
		newAttestation.id = uuidv4();
		newAttestation.timestamp = new Date();
		promise.obligations[obligationIndex].attestations.push(newAttestation);
	});

	var attStatuses = [];
	promise.parties.forEach(party => {
		var attByParty = promise.obligations[obligationIndex].attestations.filter(x => x.party_id === party.party_id);
		
		var latestAtt = attByParty.sort((a, b) => {
			var aDate = new Date(a.timestamp).getTime();
			var bDate = new Date(b.timestamp).getTime();
			if(a < b) return -1;
			if(a > b) return 1;
			if(a == b) return 0;
		}).reverse()[0];
		attStatuses.push(latestAtt.attestation);
		console.log("~~~~~~~");
		console.log(JSON.stringify(latestAtt));
	});
	

	
	attStatuses = attStatuses.filter(x => x === 2);
	promise.obligations[obligationIndex].status = attStatuses.length === 0 ? 1 : 2;

	var obligationStatuses = promise.obligations.filter(x => x.status === 2);
	promise.status = obligationStatuses.length === 0 ? 1 : 2;

	return promise;
}