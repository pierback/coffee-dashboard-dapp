const jwt = require('jsonwebtoken');

class Login {
    constructor(_web3, _uc, _app) {
        this.web3 = _web3;
        this.userController = _uc;
        this.app = _app;
    }

    handler(req, res) {
        const payload = {
            email: req.body.email,
        };
        const token = jwt.sign(payload, this.app.get('superSecret'), {
            expiresIn: 60 * 60 * 24, // expires in 24 hours
        });
        if (this.userController) {
            this.web3.personal.unlockAccount(this.web3.eth.accounts[0], '0000', 10000);
            const user = this.web3.toHex(req.body.email);
            console.log('​req.body.email', req.body.email, `user ${user}`);

            // this.web3.miner.start(1);
            const ethAddress = this.userController.getUser(user);
            console.log('Email', req.body.email, 'ethAddress', ethAddress);
            const isUnlocked = this.web3.personal.unlockAccount(ethAddress, req.body.password, 1000000);
            // this.web3.miner.stop(1);

            if (isUnlocked) {
                this.web3.miner.stop(1);

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
        return res.status(404).json({
            status: 404,
            message: 'Server is not ready yet.',
        });
    }
}
module.exports = Login;
