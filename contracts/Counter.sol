// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Counter {
    int public value;
    address private organizer;

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only the organizer can perform this action.");
        _;
    }

    constructor() {
        organizer = msg.sender;
    }

    function initialize(int x) public onlyOrganizer {
        value = x;
    }

    function increment(int n) public {
        value = value + n;
    }

    function decrement(int n) public {
        value = value - n;
    }
}
