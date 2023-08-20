// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract SupportInterface {

    bool public contractInterface;

    bytes4 public selector1 = bytes4(keccak256("calcFunc1(uint)"));
    
    bytes4 public selector2 = bytes4(keccak256("calcFunc2(bool)"));
    
    function calcFunc1(uint number) private {
    }

    function calcFunc2(bool Boolean) private {
    }

    function calculateXOR(bytes4 id) external {
        bytes4 xorValue = selector1 ^ selector2 ^ bytes4(keccak256("calculateXOR(bytes4)"));
        require(id == xorValue, "This is not the interface of the contract");
            contractInterface = true;
    }
}














contract blabla{
            bytes4 public xorValue = bytes4(keccak256("calcFunc1(uint)")) 
        ^ bytes4(keccak256("calcFunc2(bool)")) 
        ^ bytes4(keccak256("calculateXOR(bytes4)"));
}




















contract sulotion {
    
    function calcFunc1() public pure returns (bytes4) {
        return bytes4(keccak256("calcFunc1(uint)"));
    }

    function calcFunc2() public pure returns (bytes4) {
        return bytes4(keccak256("calcFunc2(bool)"));
    }

    function calcXOR() public pure returns (bytes4) {
        return bytes4(keccak256("calculateXOR(bytes4)"));
    }

    function calculateXOR() public pure returns(bytes4) {
        bytes4 xorValue = bytes4(keccak256("calcFunc1(uint)")) 
        ^ bytes4(keccak256("calcFunc2(bool)")) 
        ^ bytes4(keccak256("calculateXOR(bytes4)"));
        return xorValue;
    }
}