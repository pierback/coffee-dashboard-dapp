pragma solidity ^0.4.24;

import "./UserController.sol";
import "./UserStorage.sol";

contract Parent {
  mapping(bytes32 => address) public controllers;
  address pubController;

  function createUserController() {
      var userStorage = new UserStorage();
      var userController = new UserController(userStorage);
      pubController = userController;
  }

  function getUserController() public constant returns (address) {
    return pubController;
  }

  function upgradeOrganisation(bytes32 key_) public {
    address ucAddress = controllers[key_];
    UserController userController = UserController(ucAddress);
    address userStorage = userController.userStorage();

    UserController userControllerNew = new UserController(userStorage);

    //userController.kill(userControllerNew);

    controllers[key_] = userControllerNew;
  }
}