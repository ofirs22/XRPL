// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract PayableContract {

    receive() external payable {
        require(msg.value == 1 wei, "Incorrect amount received");
    }
}


