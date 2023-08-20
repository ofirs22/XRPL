// SPDX-License-Identifier: MIT
import "./FactoryLib.sol";

pragma solidity ^0.8.10;

library NftLib {
    function mintRequirements(uint256 id, address _entity)
        internal
        view
        returns (bool)
    {
        require((id >= 1 && id <= 17), "Id out of range");
        if (id == 1) {
            require(
                FactoryLib.checkBytes2Game(_entity),
                "You must pass level 1"
            );
        } else if (id == 2) {
            require(
                FactoryLib.checkFallbackGame(_entity),
                "You must pass level 2"
            );
        } else if (id == 3) {
            require(
                FactoryLib.checkBalanceCheckerGame(_entity),
                "You must pass level 3"
            );
        } else if (id == 4) {
            require(
                FactoryLib.checkPayableContractGame(payable(_entity)),
                "You must pass level 4"
            );
        } else if (id == 5) {
            require(
                FactoryLib.checkTimestampGame(_entity),
                "You must pass level 5"
            );
        } else if (id == 6) {
            require(
                FactoryLib.checkGasCheckerGame(payable(_entity)),
                "You must pass level 6"
            );
        } else if (id == 7) {
            require(
                FactoryLib.checkChangePasswordGame(_entity),
                "You must pass level 7"
            );
        } else if (id == 8) {
            require(
                FactoryLib.checkOverflowGame(payable(_entity)),
                "You must pass level 8"
            );
        } else if (id == 9) {
            require(
                FactoryLib.checkBlockHashGame(_entity),
                "You must pass level 9"
            );
        } else if (id == 10) {
            require(
                FactoryLib.checkInterfaceIdGame(_entity),
                "You must pass level 10"
            );
        } else if (id == 11) {
            require(
                FactoryLib.checkEncodeDataGame(_entity),
                "You must pass level 11"
            );
        } else if (id == 12) {
            require(
                FactoryLib.checkHashCollisionGame(payable(_entity)),
                "You must pass level 12"
            );
        } else if (id == 13) {
            require(
                FactoryLib.checkDecodeDataGame(_entity),
                "You must pass level 13"
            );
        } else if (id == 14) {
            require(
                FactoryLib.checkFactoryGame(_entity),
                "You must pass level 14"
            );
        } else if (id == 15) {
            require(
                FactoryLib.checkSupportInterfaceGame(_entity),
                "You must pass level 15"
            );
        } else if (id == 16) {
            require(
                FactoryLib.checkLimitedTicketsGame(_entity),
                "You must pass level 16"
            );
        } else if (id == 17) {
            require(
                FactoryLib.checkEducatedGuessGame(_entity),
                "You must pass level 17"
            );
        }
        return true;
    }
}
