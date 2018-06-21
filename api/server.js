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

let parentAddress;

setInterval(() => web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 100000), 100000 - 1);
// const [contractAddress] = web3.eth.accounts;

let userController;
init();
// Compile the source code
function readJSONFile(jsonPath) {
    try {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (error) {
        return null;
    }
}

function findImports(contractsPath) {
    if (contractsPath === 'UserStorage.sol') {
        return { contents: inputStorage.toString() };
    }
    if (contractsPath === 'UserController.sol') {
        return { contents: inputController.toString() };
    }
    return { error: 'File not found' };
}

async function deployParent() {
    /* const inputParent = fs.readFileSync('./../ownBlockchain/contracts/Parent.sol');// ('../ownBlockchain/contracts/Parent.sol');
    const inputStorage = fs.readFileSync('./../ownBlockchain/contracts/UserStorage.sol');// ('../ownBlockchain/contracts/Parent.sol');
    const inputController = fs.readFileSync('./../ownBlockchain/contracts/UserController.sol');// ('../ownBlockchain/contracts/Parent.sol');
 */
    const input = {
        'Parent.sol': fs.readFileSync('./../ownBlockchain/contracts/Parent.sol', 'utf8'),
        'UserStorage.sol': fs.readFileSync('./../ownBlockchain/contracts/UserStorage.sol', 'utf8'),
        'UserController.sol': fs.readFileSync('./../ownBlockchain/contracts/UserController.sol', 'utf8'),
    };
    const output = solc.compile({ sources: input }, 1);
    console.log('​deployParent');
    const abi = JSON.parse(output.contracts['Parent.sol:Parent'].interface);
    const { bytecode } = output.contracts['Parent.sol:Parent'];
    const gasEstimate = web3.eth.estimateGas({
        data: `0x${bytecode}`,
    });
    const contract = web3.eth.contract(abi);

    /*  const deployedContract = web3.eth.contract(abi);
    const deployedInstance = deployedContract.at('0x3869e1f5dc610375e56b898f61f09044ce37065c');
    console.log('Nothing more to deploy');
    return deployedInstance; */
    // Contract object
    // Deploy contract instance
    const deployed = contract.new({
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
            parentAddress = res.address;
            console.log('Inside parentAddress', parentAddress);
            const parent = contract.at(res.address);
            // parent.createUserController({ gas: 2000000 });
            parent.createUserController({ gas: 3091745 }, (error, result) => {
                if (error) console.log('error', error);
                
                // console.log(`UserController Address ${parent.getUserController({ gas: 77000 })}`);
                setTimeout(() => {
                    console.log(`receipt ${result}`);
                    parent.getUserController({ gas: 3091745 }, (err1, result1) => {
                        if (err) console.log('err', err1);
                        console.log(`Address ${result1}`);
                    });
                }, 10000);
            });
            fs.writeFileSync('../contractConfig.json', JSON.stringify({ address: res.address, abi: res.abi }), 'utf8');
            // Let's test the deployed contract
        }
    });
}

async function getContract() {
    /* const contractData = readJSONFile('../contractConfig.json');

    if (contractData) {
        console.log('contractData', contractData.address);
        const deployedContract = web3.eth.contract(contractData.abi);
        const deployedInstance = deployedContract.at(contractData.address);
        console.log('Nothing more to deploy', deployedInstance.ready.call());
        return deployedInstance;
    } */
    console.log('Start');
    const input = fs.readFileSync('./../ownBlockchain/contracts/UserController.sol');// ('../ownBlockchain/contracts/UserController.sol');
    const output = solc.compile(input.toString(), 1);
    const { bytecode } = output.contracts[':UserController'];
    const abi = JSON.parse(output.contracts[':UserController'].interface);

    const deployedContract = web3.eth.contract(abi);
    const deployedInstance = deployedContract.at('0xd21cc3a6bf14a1e9f25b76333f38738cafe0453c');
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

    /* const parent = */ await deployParent();/*
    parent.createUserController({ gas: 47000 });
    console.log(`Parent Address ${parent.getUserController({ gas: 47000 })}`); */
    /*
    setTimeout(() => {
        const parentInstance = await deployParent();
        console.log('​init -> parentAdress', parentAddress);
        const newParentInstance = parentInstance.at(parentAddress);
        const ucCreated = newParentInstance.createUserController(web3.toHex('1234567890'));
        console.log('​deployParent -> ucCreated ', ucCreated);
        if (ucCreated) {
            const userControllerAddress = parentInstance.getUserController(web3.toHex('1234567890'));
            console.log('​deployParent -> userController', userControllerAddress);
            userController = parentInstance.at(userControllerAddress);
            console.log(`Yo Yo new deployment ${userController.ready()}`);
        }
    }, 25000); */
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

router
    .route('/register/')
    .post((req, res) => {
        console.log(req.body);
        web3.personal.newAccount(req.body.password, (error, address) => {
            console.log('new Account', address);
            // console.log('newContractInstance', newContractInstance, newContractInstance === contractInstance, contractInstance);
            web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 10000);
            const newUser = web3.toHex(req.body.email);
            const returnVal = userController.insertUser(newUser, address, { gas: 47000 });
            console.log('New User: ', returnVal);
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

function getCoffeeString(...coffeeCode) {
    const [size, strength] = coffeeCode;
    const mapping = {
        size: {
            0: 'Small',
            1: 'Big',
        }[size],
        strength: {
            0: 'Mild',
            1: 'Normal',
            2: 'Strong',
        }[strength],
    };
    return `${mapping.size} & ${mapping.strength}`;
}

function getUserConsumption(contract, user) {
    const coffeeCodes = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];
    return coffeeCodes.reduce((consumArr, el) => {
        console.log(`el${el}`);
        const coffeeObj = { [getCoffeeString(...el)]: contract.getUserCoffeeCnt(user, ...el, { gas: 47000 }) };
        consumArr.push(coffeeObj);
        return consumArr;
    }, []);
}

function getOverallConsumption(contract) {
    const coffeeCodes = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];
    return coffeeCodes.reduce((consumArr, el) => {
        const coffeeObj = { [getCoffeeString(...el)]: contract.getOverallCoffeeCnt(...el, { gas: 47000 }) };
        consumArr.push(coffeeObj);
        return consumArr;
    }, []);
}

router
    .route('/getuserdata/:email')
    .get((req, res) => {
        const user = web3.toHex(req.params.email);
        const userConsumption = getUserConsumption(userController, user);
        const overallConsumption = getOverallConsumption(userController);
        console.log('​user', user);
        return res.status(200).json({
            userConsumption,
            overallConsumption,
        });
    });

const getCoffeCode = (coffeeSize, coffeeStrength) => {
    const size = coffeeSize.toLowerCase();
    const strength = coffeeStrength.toLowerCase();

    return {
        size: {
            small: 0,
            big: 1,
        }[size],
        strength: {
            mild: 0,
            normal: 1,
            strong: 2,
        }[strength],
    };
};

router
    .route('/insertcoffee')
    .post((req, res) => {
        const email = web3.toHex(req.body.email);
        console.log('insertcoffee', req.body);
        const { size, strength } = getCoffeCode(req.body.size, req.body.strength);
        res.status(200).json({ coffee: getCoffeeString(size, strength) });
        userController.insertCoffee(email, size, strength, { gas: 47000 });
        /*
        if (inserted) {
            return res.status(200).json(getCoffeeString(size, strength));
        } */
    });


router
    .route('/login')
    .post((req, res) => {
        const payload = {
            email: req.body.email,
        };
        const token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 60 * 60 * 24, // expires in 24 hours
        });
        if (userController) {
            web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 10000);
            const user = web3.toHex(req.body.email);
            console.log('​req.body.email', req.body.email, `user ${user}`);
            const ethAddress = userController.getUser(user);
            console.log('Email', req.body.email, 'ethAddress', ethAddress);
            const isUnlocked = web3.personal.unlockAccount(ethAddress, req.body.password, 1000000); // Use Geth API for unlocking the account

            if (isUnlocked) {
                return res.status(200).json({
                    message: `You have succesfully loggedin: ${req.body.email}`,
                    user: {
                        name: req.body.email,
                        coffeeConsumption: {},
                    },
                    overallConsumption: {},
                    email: req.body.email,
                    token,
                });
            }
            return res.status(401).json({
                status: 401,
                message: 'Invalid username & password.',
            });
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
app.listen(port, '192.168.188.95');
