// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract HashCollision {
    bytes32 public secretHash = keccak256(abi.encodePacked(sha256("secret")));
    bool public collisionFound = false;

    function findCollision(bytes memory guess) public {
        require(keccak256(abi.encodePacked(guess)) == secretHash, "Not a collision!");
        collisionFound = true;
    }

}
