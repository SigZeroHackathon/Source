const { Client, MirrorConsensusTopicQuery, MirrorClient, Ed25519PrivateKey} = require("@hashgraph/sdk");

async function main() {
    const operatorPrivateKey = Ed25519PrivateKey.fromString(process.env.OPERATOR_KEY);
    const operatorAccount = process.env.OPERATOR_ID;
    const mirrorNodeAddress = process.env.MIRROR_NODE_ADDRESS;
    const nodeAddress = process.env.NODE_ADDRESS;

    if (operatorPrivateKey == null ||
      operatorAccount == null ||
      mirrorNodeAddress == null ||
      nodeAddress == null) {
        throw new Error("environment variables OPERATOR_KEY, OPERATOR_ID, MIRROR_NODE_ADDRESS, NODE_ADDRESS must be present");
    }

    const consensusClient = new MirrorClient(mirrorNodeAddress);
	
	new MirrorConsensusTopicQuery()
        .setTopicId("0.0.57590")
        .subscribe(
            consensusClient,
            (message) => console.log(message.toString()),
            (error) => console.log(`Error: ${error}`)
        );
}
main();