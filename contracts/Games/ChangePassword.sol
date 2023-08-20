// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract ChangePassword {
    uint256 private password;
    uint256[] public PreviousPassword;

    constructor(uint256 _password) {
        password = _password;
    }
    function changePassword(uint256 _password, uint256 newPassword) external {
        require(password == _password, "Password Cannot Be Changed!");
        require(
            password != newPassword,
            "The Password Must Be Different From The Previous Password!"
        );
        PreviousPassword.push(_password);
        password = newPassword;
    }
}
