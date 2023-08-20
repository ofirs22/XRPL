// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./Librarys/FactoryLib.sol";

contract GameFactory is Initializable, OwnableUpgradeable {

    bool public paused;
    uint public games;

    event DeployInstance(address indexed Instance, address indexed sender, uint indexed game );

    function initialize() external initializer{
        __Ownable_init();
        paused = false;
    }

    function deploy(uint game) external returns (address addr, address hackAddr) { 
        require(!paused, "The contract is paused!");
        require(game > 0 && game <= games, "There Is No More Games");
        bytes memory bytecode = FactoryLib.ChooseGame(game);
        assembly {

            addr := create(callvalue(), add(bytecode, 0x20), mload(bytecode))
        }
        require(addr != address(0), "deploy failed");
        emit DeployInstance(addr , msg.sender, game);
        
        bytes memory hackBytecode = FactoryLib.ChooseHackingGame(game);
        if (hackBytecode.length > 0) {
            assembly {
                hackAddr := create(callvalue(), add(hackBytecode, 0x20), mload(hackBytecode))
            }
            require(hackAddr != address(0), "Hack deploy failed");
            emit DeployInstance(hackAddr, msg.sender, game);
        }
    }

    function setGames(uint num) external onlyOwner{
        games = num;
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }
}