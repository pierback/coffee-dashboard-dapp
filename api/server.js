const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const app = express()
const Login = require('./app/models/Login')
const config = require('./config')
const bodyParser = require('body-parser')

const Web3 = require('web3');
const fs = require("fs");
const solc = require('solc')

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

//let sourceFile = fs.readFileSync('/Users/fabianpieringer/Projects/ownBlockchain/contracts/Hello.sol', 'utf8');
web3.eth.defaultAccount = web3.eth.accounts[0];
web3.personal.unlockAccount(web3.eth.accounts[0], '0000');
const contractAddress = web3.eth.accounts[0];

// Compile the source code
const input = fs.readFileSync('/Users/fabianpieringer/Projects/ownBlockchain/contracts/Hello.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':Hello'].bytecode;
const abi = JSON.parse(output.contracts[':Hello'].interface);
let gasEstimate = web3.eth.estimateGas({
  data: '0x' + bytecode
});

// Contract object
const contract = web3.eth.contract(abi);

// Deploy contract instance
const contractInstance = contract.new({
  data: '0x' + bytecode,
  from: web3.eth.accounts[0],
  gas: gasEstimate
}, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }
  // Log the tx, you can explore status with eth.getTransaction()
  console.log('transactionHash', res.transactionHash);

  // If we have an address property, the contract was deployed
  if (res.address) {
    console.log('Contract address: ' + res.address);
    // Let's test the deployed contract
    testContract(res.address);
  }
});

// Quick test the contract

function testContract(address) {
  // Reference to the deployed contract
  const contractInstance = contract.at(address);
  const constructorResponse = contractInstance.message.call();
  const sayHello = () => contractInstance.sayHello.call('Bernd das Brot!!!');
  const sayHelloBrot = sayHello();
  setInterval(() => console.log(sayHello()), 3000);
  console.log(constructorResponse);
  console.log(sayHelloBrot);
  // Call the transfer function
  /* token.transfer(dest_account, 100, {
    from: web3.eth.coinbase
  }, (err, res) => {
    // Log transaction, in case you want to explore
    console.log('tx: ' + res);
    // Assert destination account balance, should be 100 
    const balance2 = token.balances.call(dest_account);
    console.log(balance2 == 100);
  }); */
}



return



/*                                                              */
// create contract
var MyContract = web3.eth.contract(abi);
// the identifier you pass need to be UNIQUE per contract, so you can reliably detect the log generated by your "Created" event
var myContractInstance = MyContract.new('0x16bd7d60bc08217d2e78d09658610a9eb6de22df8b587fdca9e980fafc4ecfcc', {
  data: '0x' + bytecode,
  from: web3.eth.accounts[0],
  gas: 123456
})
var createdAtBlock = web3.eth.blockNumber;


// listen for created log/event
var Created = web3.eth.filter({
  topics: [null, '0x16bd7d60bc08217d2e78d09658610a9eb6de22df8b587fdca9e980fafc4ecfcc'],
  fromBlock: createdAtBlock,
  toBlock: 'latest'
});
Created.watch(function (error, log) {
  if (!error) {
    console.log('Contract created on ' + log.address);

    myContractInstance.address = log.address;

    // remove filter
    Created.stopWatching();

    // watch for the last next 12 blocks if the code is still at the address
    var filter = web3.eth.filter('latest');
    filter.watch(function (e, blockHash) {
      if (!e) {
        var block = web3.eth.getBlock(blockHash);

        // check if contract stille exists, if show error to the user
        if ((block.number - createdAtBlock) < 12 &&
          web3.eth.getCode(myContractInstance.address).length > 2) {
          alert('Oh no the contract is gone!');
        } else if (block.number - createdAtBlock > 12) {
          filter.stopWatching();
        }
      }
    });
  }
});

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

app.set('superSecret', config.secret)

const port = process.env.PORT || 3003

const router = express.Router()

app.use(express.static(path.join(__dirname, 'dist')))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

router.route('/register/')
  .post(function (req, res) {
    console.log(req.body)
    //const login = new Login()

    res.json({
      status: 200,
      message: 'You have succesfully registered.'
    })

    /*    Login.findOne({
          'username': req.body.username
        }, function (err, user_data) {
          if (err) {
            console.log(err)
          }
          if (user_data) {
            return res.json({
              status: 409,
              message: 'User already exist'
            })
          }
          console.log(req.body, 44)
          login.username = req.body.username
          login.password = req.body.password
          login.confirm_password = req.body.confirm_password
          login.email = req.body.email
          console.log(login, 49)
          login.save(function (err, login_data) {
            if (err) {
              return res.status(400).send(err)
            }
            res.json({
              status: 200,
              message: 'You have succesfully registered.'
            })
          })
        })*/
  })

router.route('/login')
  .post(function (req, res) {
    const payload = {
      username: req.body.username
    }
    const token = jwt.sign(payload, app.get('superSecret'), {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    })
    res.status(200).json({
      message: 'You have succesfully loggedin.',
      token: token
    })

    /* Login.findOne({
      'username': req.body.username,
      'password': req.body.password
    }, function (err, user_data) {
      if (err || !user_data) {
        return res.status(401).json({
          status: 401,
          message: 'Invalid username and password.'
        })
      } else {
        const payload = {
          username: user_data.username
        }
        const token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        })
        res.status(200).json({
          message: 'You have succesfully loggedin.',
          token: token
        })
      }
    }) */
  })

router.use(function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({
          status: 403,
          success: false,
          message: 'Failed to authenticate token.'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.json({
      status: 403,
      success: false,
      message: 'No token provided.'
    })
  }
})

router.route('/result')
  .get(function (req, res) {
    Login.find(function (err, logins) {
      if (err) {
        res.send(err)
      }

      res.json(logins)
    })
  })

app.use('/api', router)
app.get('/*', function (req, res) {
  res.sendFile('/dist/index.html', {
    root: __dirname
  })
})
app.listen(port)
