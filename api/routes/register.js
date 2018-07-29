class Register {
    constructor(_web3, _uc) {
        this.web3 = _web3;
        this.userController = _uc;
    }

    handler(req, res) {
        console.log('Registration', req.body);
        this.web3.personal.newAccount(req.body.password, (error, address) => {
            console.log('new Account', address);
            this.web3.personal.unlockAccount(this.web3.eth.accounts[0], '0000', 10000);
            const newUser = this.web3.toHex(req.body.email);

            this.userController.insertUser.sendTransaction(newUser, this.web3.toHex(address), { gas: 4700000 }, (err, result) => {
                console.log('New User: ', result);
                // this.web3.miner.stop(1);

                if (!err) {
                    return res.json({
                        status: 200,
                        message: 'You have succesfully registered.',
                    });
                }
                return res.json({
                    status: 409,
                    message: 'User already exist',
                });
            });
        });
    }
}
module.exports = Register;
