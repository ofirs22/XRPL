// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract SomeContract {
    /*              ~~~~                                    ~~~~ 
             ~~                                       ~~
                ~~                                       ~~
             ~~                                        ~~
                ~~                                       ~~
            _____                                      _____
           /|   |\                                    /|   |\
          /_|___|_\                                  /_|___|_\
         ||_|___|_||                                ||_|___|_||
       /             \                            /             \
      /               \                          /               \
     /_________________\  ____________________  /_________________\
    |   ____________    ||   ____    ____     ||   ____________    |
    |  |            |   ||  |    |  |    |    ||  |            |   |
    |  |____________|   ||  |____|  |____|    ||  |____________|   |
    |                   ||                    ||                   |
    |   _____________   ||   _____________    ||   _____________   |
    |  |             |  ||  |             |   ||  |             |  |
    |  |   _     _   |  ||  |   _     _   |   ||  |   _     _   |  |
    |  |  | |   | |  |  ||  |  | |   | |  |   ||  |  | |   | |  |  |
    |__|__| |___| |__|__||__|__| |___| |__|___||__|__| |___| |__|__|      
     */
}

contract Factory {
    SomeContract[] public SomeContracts;

    bool public correctPrediction;

    uint256 public _salt = 1;

    bytes public bytecode = type(SomeContract).creationCode;

    function checkAddress(address _addr, uint256 _sal, bytes memory _bytecode)
        external
        pure
        returns (address)
    {
        bytes32 result = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(_addr),
                _sal,
                keccak256(_bytecode)
            )
        );
        return address(uint160(uint256(result)));
    }

    function deploy(address _add) external{
    require(_add != address(0), "Address must not be null");
    
        bytes32 salt = bytes32(_salt);
        SomeContract someContract = (new SomeContract){salt: salt}();
        SomeContracts.push(someContract);
        if (address(SomeContracts[0]) == _add){
        correctPrediction = true;
        }
        require(correctPrediction,"not correct");
    }

}
