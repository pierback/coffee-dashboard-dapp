pragma solidity ^0.4.19;

contract UserManagement { 
    /* enum CoffeeSize {SMALL, BIG}
    enum CoffeeStrength {MILD, MEDIUM, STRONG}

    struct CoffeeStruct {
        CoffeeSize size;
        CoffeeStrength strength;
    } */

    struct UserStruct {
        address  ethAddress;
        uint coffeeCnt;
    }
    UserStruct[] public people;
    mapping(bytes32 => UserStruct) private users;

    function ready() public pure returns(string) {
        return "I'm ready!";
    }

    function insertUser(bytes32 email, address _ethAddress, uint _coffeeCnt) returns(bool) {
            //UserStruct user;
            //users[email] = UserStruct(_ethAddress, 26);
            users[email].ethAddress = _ethAddress;
            users[email].coffeeCnt = _coffeeCnt;
            return(true);
    }

    function getUser(bytes32 email) public constant returns(address, uint) {
        return (users[email].ethAddress, users[email].coffeeCnt);
    }
}