// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * Base Invaders Check-In v2
 * 
 * Uses UTC day boundary instead of 24-hour cooldown.
 * After 00:00 UTC, check-in becomes available immediately
 * (no need to wait until the same clock time as previous day).
 */
contract BaseInvadersCheckIn {
    /// @dev UTC day number (block.timestamp / 1 days) when user last checked in
    mapping(address => uint256) public lastCheckInDay;

    event CheckedIn(address indexed user, uint256 day);

    /// @notice One check-in per UTC day. Available immediately after 00:00 UTC.
    function checkIn() external {
        uint256 currentDay = block.timestamp / 1 days;
        require(
            lastCheckInDay[msg.sender] < currentDay,
            "Already checked in today"
        );
        lastCheckInDay[msg.sender] = currentDay;
        emit CheckedIn(msg.sender, currentDay);
    }
}
