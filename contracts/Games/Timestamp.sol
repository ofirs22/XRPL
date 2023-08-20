// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract Timestamp {
    uint256 private currentBlockTimestamp;
    bool public success;

    constructor() {
        currentBlockTimestamp = block.timestamp;
    }
    function timeReset(uint256 _Timestamp) external {
        require(currentBlockTimestamp == _Timestamp,"This Is Not The Timestamp");
        currentBlockTimestamp = 0;
        success = true;
    }
}

