const { getUserConsumption, getOverallConsumption } = require('../utils');


class GetUserData {
    constructor(_web3, _uc) {
        this.web3 = _web3;
        this.userController = _uc;
    }

    handler(req, res) {
        const user = this.web3.toHex(req.params.email);
        const userConsumption = getUserConsumption(this.userController, user);
        const overallConsumption = getOverallConsumption(this.userController);

        console.log('​user', user);
        return res.status(200).json({
            userConsumption,
            overallConsumption,
        });
    }
}
module.exports = GetUserData;
