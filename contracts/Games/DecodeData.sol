// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract DecodeData{
    bytes public encodeStringAndUint =hex"00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000b4920416d204e756d626572000000000000000000000000000000000000000000";
     
    struct Player{
       string _string;
       uint256 _number;
    }
    Player public player;

    function decode(string memory _str, uint256 _num) external {
        bytes memory encodedData = abi.encode(_str, _num);
        require(keccak256(encodedData) == keccak256(encodeStringAndUint), "The Answer is incorrect");
        player = Player(_str, _num);
    }
    
}
