
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
				id: "1",
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