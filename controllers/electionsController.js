var mongoose = require('mongoose');
var Election = require('../models/election');
const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');

const ethereumUri = "http://localhost:8545";
web3 = new Web3(new Web3.providers.HttpProvider(ethereumUri));

const devAdd = '0x00a329c0648769a73afac7f9381e08fb43dbea72';

module.exports.list_all_elections = function (req, res) {
  Election.find({}, function (err, elections) {
    if (err)
      res.send(err);
    res.json(elections);
  });
};




module.exports.create_an_election = function (req, res) {
  var new_election = new Election(req.body);
  //SMART CONTRACT STARTS HERE


  //compile contract
  const code = fs.readFileSync('./public/contracts/Election.sol').toString();
  console.log('compiling contract...');
  const compiledContract = solc.compile(code);
  for (let contractName in compiledContract.contracts) {
    var bytecode = compiledContract.contracts[contractName].bytecode;
    var abi = JSON.parse(compiledContract.contracts[contractName].interface);
  }

  //save the abi to the DB
  console.log(new_election.smart_contract);
  new_election.smart_contract.contract_abi = abi;

  //deploy contract
  let gasEstimate = web3.eth.estimateGas({
    data: '0x' + bytecode
  });
  let MyContract = web3.eth.contract(abi);

  console.log('deploying contract...');
  let myContractReturned = MyContract.new(new_election.duration, {
    from: devAdd,
    data: '0x' + bytecode,
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

        //save the contract address to the DB
        new_election.smart_contract.contract_address = myContract.address;
      }

      // Note that the returned "myContractReturned" === "myContract",
      // so the returned "myContractReturned" object will also get the address set.

      //now save the election
      new_election.contract = JSON.stringify(myContractReturned);
      new_election.save(function (err, election) {
        if (err)
          res.send(err);
        else {
          res.json(election);
        }

      });
    } else {
      console.log(err);
    }
  });

  //SMART CONTRACT ENDS HERE


};


module.exports.read_an_election = function (req, res) {
  Election.findById(req.params.electionId, function (err, election) {
    if (err)
      res.send(err);
    res.json(election);
  });
};


module.exports.voteToCandidate = function (req, res) {
  var elec;
  Election.findOne({
    voters: {
      "$in": [req.params.votekey]
    }
  }).populate('contract_abi', function (err, election) {
    if (err)
      res.send(err);

    //vote transaction starts here 


  }).then(election => {
    var abi = election.smart_contract.contract_abi;
    var contractAdd = election.smart_contract.contract_address;
    var contractInstance = web3.eth.contract(contractAdd, abi);

    var c = contractInstance.vote(0);
    console.log("returned vote : "+c);
    res.json(election);
  });


};


module.exports.delete_an_election = function (req, res) {


  Election.remove({
    _id: req.params.electionId
  }, function (err, election) {
    if (err)
      res.send(err);
    res.json({
      message: 'Election successfully deleted'
    });
  });
};