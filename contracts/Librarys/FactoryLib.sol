// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "../Games/Fallback.sol";
import "../Games/InterfaceId.sol";
import "../Games/ChangePassword.sol";
import "../Games/DecodeData.sol";
import "../Games/EncodeData.sol";
import "../Games/Timestamp.sol";
import "../Games/Bytes2.sol";
import "../Games/BlockHash.sol";
import "../Games/BalanceChecker.sol";
import "../Games/PayableContract.sol";
import "../Games/Overflow.sol";
import "../Games/GasChecker.sol";
import "../Games/HashCollision.sol";
import "../Games/Factory.sol";
import "../Games/SupportInterface.sol";
import "../Games/EducatedGuess.sol";
import "../Games/LimitedTickets.sol";



library FactoryLib {
    function checkFallbackGame(address _entity) internal view returns (bool) {
        Fallback entity = Fallback(_entity);
        return entity.fixMe();
    }

    function checkInterfaceIdGame(address _entity)
        internal
        view
        returns (bool)
    {
        InterfaceId entity = InterfaceId(_entity);
        return entity.answer();
    }

    function checkChangePasswordGame(address _entity)
        internal
        view
        returns (bool)
    {
        ChangePassword entity = ChangePassword(_entity);
        return entity.PreviousPassword(0) > 0;
    }

    function checkDecodeDataGame(address _entity) internal view returns (bool) {
        DecodeData entity = DecodeData(_entity);
        (, uint256 number) = entity.player();
        return number == 1;
    }

    function checkEncodeDataGame(address _entity) internal view returns (bool) {
        EncodeData entity = EncodeData(_entity);
        return entity._encodeStringAndUint().length != 0;
    }

    function checkTimestampGame(address _entity) internal view returns (bool) {
        Timestamp entity = Timestamp(_entity);
        return entity.success();
    }

    function checkBytes2Game(address _entity) internal view returns (bool) {
        Bytes2 entity = Bytes2(_entity);
        return entity.num() != 0;
    }

    function checkBlockHashGame(address _entity) internal view returns (bool) {
        BlockHash entity = BlockHash(_entity);
        return entity.correctBlockHash();
    }

    function checkBalanceCheckerGame(address _entity)
        internal
        view
        returns (bool)
    {
        BalanceChecker entity = BalanceChecker(_entity);
        return entity.correctBalanceChecked();
    }

    function checkPayableContractGame(address payable _entity)
        internal
        view
        returns (bool)
    {
        PayableContract entity = PayableContract(_entity);
        return address(entity).balance > 0;
    }

    function checkOverflowGame(address payable _entity)
        internal
        view
        returns (bool)
    {
        Overflow entity = (Overflow(_entity));
        return entity.overflowOccurred();
    }

    function checkGasCheckerGame(address payable _entity)
        internal
        view
        returns (bool)
    {
        GasChecker entity = GasChecker(_entity);
        return entity.GasChecked();
    }

    function checkHashCollisionGame(address payable _entity)
        internal
        view
        returns (bool)
    {
        HashCollision entity = HashCollision(_entity);
        return entity.collisionFound();
    }

    function checkFactoryGame(address _entity)
        internal
        view
        returns (bool)
    {
        Factory entity = Factory(_entity);
        return entity.correctPrediction();
    }
    function checkSupportInterfaceGame(address _entity)
        internal
        view
        returns (bool)
    {
        SupportInterface entity = SupportInterface(_entity);
        return entity.contractInterface();
    }
    function checkLimitedTicketsGame(address _entity)
        internal
        view
        returns (bool)
    {
        LimitedTickets entity = LimitedTickets(_entity);
        return entity.Count(msg.sender) > 3;
    }
    function checkEducatedGuessGame(address _entity)
        internal
        view
        returns (bool)
    {
        EducatedGuess entity = EducatedGuess(_entity);
        return entity.correctGuess();
    }

    function ChooseGame(uint256 game)
        internal
        pure
        returns (bytes memory bytecode)
    {
        if (game == 1) {
            bytecode = type(Bytes2).creationCode;
        } else if (game == 2) {
            bytecode = type(Fallback).creationCode;
        } else if (game == 3) {
            bytecode = type(BalanceChecker).creationCode;
        } else if (game == 4) {
            bytecode = type(PayableContract).creationCode;
        } else if (game == 5) {
            bytecode = type(Timestamp).creationCode;
        } else if (game == 6) {
            bytecode = type(GasChecker).creationCode;
        } else if (game == 7) {
            bytes memory bytecode_value = type(ChangePassword).creationCode;
            bytecode = abi.encodePacked(
                bytecode_value,
                abi.encode(
                    0x446f6e277420466f72676574205468652050617373776f726421
                )
            );
        } else if (game == 8) {
            bytecode = type(Overflow).creationCode;
        } else if (game == 9) {
            bytecode = type(BlockHash).creationCode;
        } else if (game == 10) {
            bytecode = type(InterfaceId).creationCode;
        } else if (game == 11) {
            bytecode = type(EncodeData).creationCode;
        } else if (game == 12) {
            bytecode = type(HashCollision).creationCode;
        } else if (game == 13) {
            bytecode = type(DecodeData).creationCode;
        } else if (game == 14) {
            bytecode = type(Factory).creationCode;
        } else if (game == 15) {
            bytecode = type(SupportInterface).creationCode;
        } else if (game == 16) {
            bytecode = type(LimitedTickets).creationCode;
        } else if (game == 17) {
            bytecode = type(EducatedGuess).creationCode;
        }
        return bytecode;
    }

    function ChooseHackingGame(uint256 game) internal pure returns (bytes memory bytecode) {
        if (game == 16) {
            bytecode = type(HacklimitedTickets).creationCode;
        } else if (game == 17) {
            bytecode = type(HackEducatedGuess).creationCode;
        }
        return bytecode;
    }
}
