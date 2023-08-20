// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract EncodeData {
    bytes public _encodeStringAndUint = hex"";

    function encode(bytes memory encodedData) external {
        require(
            keccak256(encodedData) == keccak256(abi.encode("WEB", 3)),
            "The Answer is incorrect"
        );
        _encodeStringAndUint = encodedData;
    }  
}
