pragma solidity ^0.4.24;

contract UserManagement { 
    enum CoffeeSize {SMALL, BIG}
    enum CoffeeStrength {MILD, Normal, STRONG}

    struct CoffeeStruct {
        CoffeeSize size;
        CoffeeStrength strength;
    }

    struct UserStruct {
        address  ethAddress;
        mapping(uint8 => uint) consumption;
        uint index;
    }

    bytes32[] private userIndex;
    mapping(bytes32 => UserStruct) private users;
    mapping(uint8 => uint) private overallConsumption;

    function ready() public pure returns(string) {
        return "I'm ready!";
    }

    function insertCoffee(bytes32 email, CoffeeSize size, CoffeeStrength strength) {
        uint8 coffee = getCoffeeCode(uint8(size),uint8(strength));
        users[email].consumption[coffee] += 1; 
        overallConsumption[coffee] += 1;
    }

    function getUserCoffeeCnt(bytes32 email, CoffeeSize size, CoffeeStrength strength) constant returns(uint) {
        uint8 coffee = getCoffeeCode(uint8(size),uint8(strength));
        return (overallConsumption[coffee]);//return(users[email].consumption[coffee]);
    }

    function getOverallCoffeeCnt(CoffeeSize size, CoffeeStrength strength) constant returns(uint) {
        uint8 coffee = getCoffeeCode(uint8(size),uint8(strength));
        return overallConsumption[coffee];
    }

    function insertUser(bytes32 email, address _ethAddress) returns(bool, address) {
        if (isUser(email)) throw; 
        users[email].ethAddress = _ethAddress;
        users[email].index = userIndex.push(email)-1;
        return(true, users[email].ethAddress);
    }
    
    function isUser(bytes32 email) public constant returns (bool){
        if (userIndex.length == 0)  return false;
        return (userIndex[users[email].index] == email);
    }

    function getUser(bytes32 email) public constant returns(address) {
        if (!isUser(email)) throw;
        return (users[email].ethAddress);
    }
    
    function getUserCount() public constant returns(uint count) {
        return userIndex.length;
    }
    
    function getUserAtIndex(uint index) public constant returns(bytes32) {
      return userIndex[index];
    }

    function getCoffeeCode(uint8 x, uint8 y) pure returns (uint8) {
        return (x * 10 + y);        
    }
}