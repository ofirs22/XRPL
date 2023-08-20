// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract BalanceChecker {
    bool public correctBalanceChecked = false;

    function checkBalance(address _account, uint256 _amount) public {
        require(_account.balance == _amount, "Incorrect balance");
        correctBalanceChecked = true;
    }
}