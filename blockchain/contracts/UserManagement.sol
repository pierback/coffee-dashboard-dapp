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

    address private testAddress;

    function getTestAddress() public constant returns (address) {
        return testAddress;
    }

    function setTestAddress(address _address) public {
        testAddress = _address;
    }

    function ready() public view returns (string) {
        return "I'm ready!!!";
    }


    function getUserCoffeeCnt(bytes32 _email, CoffeeSize _size, CoffeeStrength _strength) public constant returns(uint) {
        uint8 coffee = getCoffeeCode(uint8(_size),uint8(_strength));
        return users[_email].consumption[coffee];
    }

    function getOverallCoffeeCnt(CoffeeSize _size, CoffeeStrength _strength) public constant returns(uint) {
        uint8 coffee = getCoffeeCode(uint8(_size),uint8(_strength));
        return overallConsumption[coffee];
    }

    function insertCoffee(bytes32 _email, CoffeeSize _size, CoffeeStrength _strength) public payable {
        uint8 coffee = getCoffeeCode(uint8(_size),uint8(_strength));
        users[_email].consumption[coffee] = getUserCoffeeCnt(_email, _size, _strength) + 1; 
        overallConsumption[coffee] = getOverallCoffeeCnt(_size, _strength) + 1;
    }
    
    function insertUser(bytes32 _email, address _ethAddress) public {
        users[_email].ethAddress = _ethAddress;
        users[_email].index = userIndex.push(_email)-1;
    }
    
    /* function isUser(string _email) public constant returns (bool) {
        if (userIndex.length == 0) {
            return false;
        }
        return (userIndex[users[_email].index] == _email);
    } */

    function getUser(bytes32 _email) public constant returns(address) {
        return (users[_email].ethAddress);
    }
    
    function userCount() public constant returns(uint count) {
        return userIndex.length;
    }
    
    /* function getUserAtIndex(uint index) public constant returns(bytes32) {
      return userIndex[index];
    } */

    function getCoffeeCode(uint8 x, uint8 y) private pure returns (uint8) {
        return (x * 10 + y);        
    }
}