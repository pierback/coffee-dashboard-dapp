
const { getUserConsumption, getCoffeeCode, getCoffeeString } = require('../utils');


class InsertCoffee {
    constructor(_web3, _uc) {
        this.web3 = _web3;
        this.userController = _uc;
    }

    handler(req, res) {
        const email = this.web3.toHex(req.body.email);
        const { size, strength } = getCoffeeCode(req.body.size, req.body.strength);
        console.log('insertcoffee', req.body, 'typeof size', typeof strength);

        // this.web3.miner.start(1);
        this.userController.insertCoffee.sendTransaction(email, size, strength, /* { gas: 4700000 }, */(err, result) => {
            // this.userController.methods.insertCoffee(email, size, strength).send({ gas: 47000 }, (err, result) => {
            if (err) console.log('err', err);
            // this.userController.getUserCoffeeCnt(email, size, strength, { gas: 47000 });
            console.log('coffee inserted', getUserConsumption(this.userController, email));// this.userController.getUserCoffeeCnt(email, size, strength, { gas: 47000 }));
            // this.web3.miner.stop(1);
        });
        res.status(200).json({ coffee: getCoffeeString(size, strength) });
    }
}
module.exports = InsertCoffee;
