
const fs = require('fs');

const coffeeCodes = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];

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
    return coffeeCodes.reduce((consumArr, el) => {
        const val = contract.getUserCoffeeCnt(user, ...el, { gas: 47000 });
        const coffeeObj = { [getCoffeeString(...el)]: val };
        consumArr.push(coffeeObj);
        return consumArr;
    }, []);
}

function getOverallConsumption(contract) {
    return coffeeCodes.reduce((consumArr, el) => {
        const val = contract.getOverallCoffeeCnt(...el, { gas: 47000 });
        const coffeeObj = { [getCoffeeString(...el)]: val };
        consumArr.push(coffeeObj);
        return consumArr;
    }, []);
}

function getCoffeeCode(coffeeSize, coffeeStrength) {
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
}

function readJSONFile(jsonPath) {
    try {
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (error) {
        return null;
    }
}


module.exports = {
    getCoffeeCode,
    getCoffeeString,
    getOverallConsumption,
    getUserConsumption,
};
