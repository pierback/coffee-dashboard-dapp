const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

const Web3 = require('web3');

const port = process.env.PORT || 3003;
const host = process.env.HOST || '137.250.39.239';
const web3 = new Web3(new Web3.providers.HttpProvider(`http://${host}:8545`));
const web3Admin = require('web3admin');
const { getContract } = require('./contractDeployment.js');

const Login = require('./routes/login');
const Register = require('./routes/register');
const InserCoffee = require('./routes/insertCoffee');
const GetUserData = require('./routes/getUserData');

let login;
let register;
let insert;
let userData;

async function init() {
    console.log('init');
    web3Admin.extend(web3);
    setInterval(() => web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 100000), 100000 - 1);
    [web3.eth.defaultAccount] = web3.eth.accounts;
    web3.personal.unlockAccount(web3.eth.accounts[0], '0000', 10000);

    const userController = await getContract(web3);
    login = new Login(web3, userController, app);
    register = new Register(web3, userController);
    insert = new InserCoffee(web3, userController);
    userData = new GetUserData(web3, userController);
}
init();

app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

app.set('superSecret', 'SomeSecretString');


app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const router = express.Router();

app.use('/api', router);
app.get('/*', (req, res) => {
    res.sendFile('/dist/index.html', {
        root: __dirname,
    });
});
app.listen(port, host);


router.route('/register/').post((req, res) => register.handler((req, res)));
router.route('/getuserdata/:email').get((req, res) => userData.handler(req, res));
router.route('/insertcoffee').post((req, res) => insert.handler(req, res));
router.route('/login').post((req, res) => login.handler(req, res));

router.use((req, res, next) => {
    web3.miner.start(1);
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
