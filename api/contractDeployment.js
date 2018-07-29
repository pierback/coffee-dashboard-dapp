const fs = require('fs');
const solc = require('solc');

async function getContract(web3) {
    /* const contractData = readJSONFile('../contractConfig.json');

    if (contractData) {
        console.log('contractData', contractData.address);
        const deployedContract = web3.eth.contract(contractData.abi);
        const deployedInstance = deployedContract.at(contractData.address);
        console.log('Nothing more to deploy', deployedInstance.ready.call());
        return deployedInstance;
    } */
    console.log('Start');
    const input = fs.readFileSync('./../blockchain/contracts/UserManagement.sol');// ('../blockchain/contracts/UserController.sol');
    const output = solc.compile(input.toString(), 1);
    const { bytecode } = output.contracts[':UserManagement'];
    const abi = JSON.parse(output.contracts[':UserManagement'].interface);

    const deployedContract = web3.eth.contract(abi);
    const deployedInstance = deployedContract.at('0xab37fd5b395e8acaa7c0c7009f6a1f193eb03dba');
    console.log('Nothing more to deploy', deployedInstance.ready.call());
    return deployedInstance;

    const gasEstimate = web3.eth.estimateGas({
        data: `0x${bytecode}`,
    });
    const contract = web3.eth.contract(abi);
    // Contract object
    // Deploy contract instance
    return contract.new({
        data: `0x${bytecode}`,
        from: web3.eth.defaultAccount,
        gas: gasEstimate,
    }, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        // If we have an address property, the contract was deployed
        if (res.address) {
            fs.writeFileSync('../contractConfig.json', JSON.stringify({ address: res.address, abi: res.abi }), 'utf8');
            // Let's test the deployed contract
            const newContractInstance = contract.at(res.address);
            userController = newContractInstance;
            const constructorResponse = newContractInstance.ready.call();
            console.log(`Yo Yo new deployment ${constructorResponse} ${res.address}`);
            // web3.miner.stop(1);
        }
    });
}

module.exports = { getContract };
