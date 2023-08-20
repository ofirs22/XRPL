// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Overflow {
    uint256 public counter = type(uint256).max - 3;
    bool public overflowOccurred = false;

    function add(uint256 value) external {
        unchecked {
            counter += value;
            if (counter == 3) {
                overflowOccurred = true;
            }
        }
    }
}


