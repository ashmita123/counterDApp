// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Attendance {
    uint public numberAttending = 0;

    function IM_HERE() public payable {
        numberAttending++;
    }
}
