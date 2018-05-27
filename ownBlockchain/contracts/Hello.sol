pragma solidity ^0.4.15;

contract Hello { 
    string public message; 

    function Hello() {
        message = "Hello, World"; 
    }
    function sayHello(string name) returns(string) {        
        var strName = name;
        return strName;
    }
}