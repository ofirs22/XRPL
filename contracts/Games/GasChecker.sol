// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract GasChecker {
    uint256 public gasUsed = 0; 
    bool public GasChecked = false;

    function complexOperation(uint256 iterations) external {
        uint256 gasStart = gasleft();

        uint256 sum = 0;
        for(uint256 i = 0; i < iterations; i++) {
            sum += i;
        }

        gasUsed = gasStart - gasleft();
        
        if(gasUsed > 3000 && gasUsed < 5000){
         GasChecked = true;
        }
    }
}


