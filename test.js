const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const ethereumUri ="http://localhost:8545";
web3 = new Web3(new Web3.providers.HttpProvider(ethereumUri));
//console.log(web3.eth.accounts);

devAdd = '0x00a329c0648769a73afac7f9381e08fb43dbea72';
contractAdd = '0x2b5978382a4240b02c83adf8246579593f247691';
//account balance
console.log(web3.eth.getBalance(devAdd).toString());
console.log(web3.eth.getBalance(contractAdd).toString());

/*var x = web3.eth.sendTransaction({
    "from": devAdd, 
    "to": contractAdd, 
    "value": web3.toWei(40, 'ether'), 
    "gasPrice": 21000}, function(err,res){
        if(err)
            console.log(err);
        else{
            console.log(res);
            console.log(web3.eth.getBalance(contractAdd).toString());
        }
    });

*/


//compile the code
const code = fs.readFileSync('./public/contracts/Election.sol').toString();
console.log('compiling contract...');
const compiledContract = solc.compile(code);
for (let contractName in compiledContract.contracts) {
    // code and ABI that are needed by web3 
    // console.log(contractName + ': ' + compiledContract.contracts[contractName].bytecode);
    // console.log(contractName + '; ' + JSON.parse(compiledContract.contracts[contractName].interface));
    var bytecode = compiledContract.contracts[contractName].bytecode;
    var abi = JSON.parse(compiledContract.contracts[contractName].interface);
}

//console.log(JSON.stringify(abi, undefined, 2));
console.log(abi);

/*
//deploy the contract
let gasEstimate = web3.eth.estimateGas({data: '0x' + bytecode});
console.log('gasEstimate = ' + gasEstimate);
let MyContract = web3.eth.contract(abi);
console.log('deploying contract...');

let myContractReturned = MyContract.new(84600000, {
    from: devAdd,
    data: '0x'+ bytecode,
    gas: gasEstimate + 50000
}, function (err, myContract) {
    if (!err) {
        // NOTE: The callback will fire twice!
        // Once the contract has the transactionHash property set and once its deployed on an address.

        // e.g. check tx hash on the first call (transaction send)
        if (!myContract.address) {
            console.log(`myContract.transactionHash = ${myContract.transactionHash}`); // The hash of the transaction, which deploys the contract

        // check address on the second call (contract deployed)
        } else {
            console.log(`myContract.address = ${myContract.address}`); // the contract address
            global.contractAddress = myContract.address;
        }

        // Note that the returned "myContractReturned" === "myContract",
        // so the returned "myContractReturned" object will also get the address set.
    } else {
        console.log(err);
    }
});

//myContractReturned.voteToA();

*/


/*var contractInstance = web3.eth.contract(abi).at(contractAdd);
console.log(JSON.parse(contractInstance));*/