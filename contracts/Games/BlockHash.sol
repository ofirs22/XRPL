// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract BlockHash {
    bool public correctBlockHash = false;

    function blockHashCheck(uint blockNumber, bytes32 blockHash) external {
        require(blockNumber < block.number, "Block number should be less than current block number");
        require(block.number - blockNumber <= 256, "Block number should be within the last 256 blocks");
        if(blockhash(blockNumber) == blockHash){
            correctBlockHash = true;
        }
    }
}


