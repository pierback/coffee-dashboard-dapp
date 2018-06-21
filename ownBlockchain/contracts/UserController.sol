pragma solidity ^0.4.24;

import "./UserStorage.sol";

contract UserController { 

    enum CoffeeSize {SMALL, BIG}
    enum CoffeeStrength {MILD, Normal, STRONG}

    address public userStorage;

    constructor (address _userStorage) public {
        userStorage = _userStorage;
        //userStorage = UserStorage(_userStorage);
    }

    function ready() public pure returns(string) {
        return "I'm ready!";
    }  

    function getUserCoffeeCnt(bytes32 _email, CoffeeSize _size, CoffeeStrength _strength) public constant returns(uint) {
        uint8 coffee = getCoffeeCode(uint8(_size),uint8(_strength));
        UserStorage us = UserStorage(userStorage);
        return us.getUserCoffeeCnt(_email, coffee);
    }

    function insertCoffee(bytes32 _email, CoffeeSize _size, CoffeeStrength _strength) public {
        uint8 coffee = getCoffeeCode(uint8(_size),uint8(_strength));
        UserStorage us = UserStorage(userStorage);
        us.insertCoffee(_email, coffee);
    }


    function getOverallCoffeeCnt(CoffeeSize _size, CoffeeStrength _strength) public constant returns(uint) {
        uint8 coffee = getCoffeeCode(uint8(_size),uint8(_strength));
        UserStorage us = UserStorage(userStorage);
        return us.getOverallCoffeeCnt(coffee);
    }

    function insertUser(bytes32 _email, address _ethAddress) public returns (bool, address) {
        UserStorage us = UserStorage(userStorage);
        if (us.isUser(_email)) {
            revert(); 
        }
        return us.insertUser(_email, _ethAddress);
    }
    
    function getUser(bytes32 _email) public constant returns (address) {
        UserStorage us = UserStorage(userStorage);
        if (!us.isUser(_email)) {
            revert();
        }
        return us.getUser(_email);
    }
    
    function getUserCount() public constant returns(uint count) {
        UserStorage us = UserStorage(userStorage);
        return us.userCount();
    }
    
    function getUserAtIndex(uint _index) public constant returns(bytes32) {
        UserStorage us = UserStorage(userStorage);
        return us.getUserAtIndex(_index);
    }
    
    function getCoffeeCode(uint8 x, uint8 y) private pure returns (uint8) {
        return (x * 10 + y);        
    }

    
    /* function kill(address upgradedOrganisation_) {
        var tokenBalance = tokenLedger.balanceOf(this);
        tokenLedger.transfer(upgradedOrganisation_, tokenBalance);
        selfdestruct(upgradedOrganisation_);
    } */
}