const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const Login = require('./app/models/Login');
const bodyParser = require('body-parser');

const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const web3Admin = require('web3admin');

// setInterval(() => web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 100000), 100000 - 1);
// const [contractAddress] = web3.eth.accounts;

let userManagement;
init();
// Compile the source code
function readJSONFile(jsonPath) {
    try {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (error) {
        return null;
    }
}


async function getContract() {
    const contractData = readJSONFile('../contractConfig.json');
    if (contractData) {
        console.log('contractData', contractData.address);
        const deployedContract = web3.eth.contract(contractData.abi);
        const deployedInstance = deployedContract.at(contractData.address);
        console.log('Nothing more to deploy', deployedInstance.ready.call());
        return deployedInstance;
    }
    console.log('Start');
    const input = fs.readFileSync('./../ownBlockchain/contracts/UserManagement.sol');// ('../ownBlockchain/contracts/UserManagement.sol');
    const output = solc.compile(input.toString(), 1);
    const { bytecode } = output.contracts[':UserManagement'];
    const abi = JSON.parse(output.contracts[':UserManagement'].interface);
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
            const constructorResponse = newContractInstance.ready.call();
            console.log(`Yo Yo new deployment ${constructorResponse}`);
            // web3.miner.stop(1);
        }
    });
}

async function init() {
    console.log('init');
    web3Admin.extend(web3);
    web3.miner.start(1);
    // web3.eth.defaultAccount = web3.eth.coinbase;
    [web3.eth.defaultAccount] = web3.eth.accounts;
    web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 10000);
    userManagement = await getContract();
}

app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

app.set('superSecret', 'SomeSecretString');

const port = process.env.PORT || 3003;

const router = express.Router();

app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

router.route('/register/')
    .post((req, res) => {
        console.log(req.body);
        web3.personal.newAccount(req.body.password, (error, address) => {
            console.log('new Account', address);
            // console.log('newContractInstance', newContractInstance, newContractInstance === contractInstance, contractInstance);
            web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 10000);
            const returnVal = userManagement.insertUser(req.body.email, address, 0, { from: web3.eth.defaultAccount });
            // console.log('User index', web3.toAscii(returnVal));// , web3.utils.hexToNumberString(returnVal[2]));// index, 'Email', email);
            if (returnVal) {
                res.json({
                    status: 200,
                    message: 'You have succesfully registered.',
                });
            } else {
                return res.json({
                    status: 409,
                    message: 'User already exist',
                });
            }
        });
    });

router.route('/login')
    .post((req, res) => {
        console.log('req', req.body);
        const payload = {
            username: req.body.username,
        };
        const token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60 * 60 * 24, // expires in 24 hours
        });

        if (userManagement) {
            web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 10000);
            const [ethAddress, coffeeCnt] = userManagement.getUser(req.body.username);
            console.log('coffeeCnt', coffeeCnt, 'ethAddress', ethAddress);
            const isUnlocked = web3.personal.unlockAccount(`${ethAddress}`, req.body.password, 100); // Use Geth API for unlocking the account
            if (isUnlocked) {
                res.status(200).json({
                    message: `You have succesfully loggedin: ${req.body.username}`,
                    user: req.body.username,
                    token,
                });
            } else {
                return res.status(401).json({
                    status: 401,
                    message: 'Invalid username and password.',
                });
            }
        }
    });

router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('superSecret'), (err, decoded) => {
            if (err) {
                return res.json({
                    status: 403,
                    success: false,
                    message: 'Failed to authenticate token.',
                });
            }
            req.decoded = decoded;
            next();
        });
    } else {
        return res.json({
            status: 403,
            success: false,
            message: 'No token provided.',
        });
    }
});

router.route('/result')
    .get((req, res) => {
        Login.find((err, logins) => {
            if (err) {
                res.send(err);
            }

            res.json(logins);
        });
    });

app.use('/api', router);
app.get('/*', (req, res) => {
    res.sendFile('/dist/index.html', {
        root: __dirname,
    });
});
app.listen(port);
