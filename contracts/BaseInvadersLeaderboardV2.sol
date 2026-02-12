// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BaseInvadersLeaderboardV2 {
    struct Entry {
        address player;
        string name;
        uint256 score;
        uint256 wave;
        uint256 streak;
        uint256 timestamp;
    }

    Entry[] public entries;
    mapping(address => uint256) public playerIndex;
    uint256 public constant MAX_ENTRIES = 100;
    address public owner;

    /// @dev Check-in date (timestamp) per player; independent of leaderboard/score/top-100.
    mapping(address => uint256) public lastCheckIn;

    event ScoreSubmitted(
        address indexed player,
        uint256 score,
        uint256 wave,
        uint256 streak,
        string name
    );
    event LeaderboardCleared(address indexed clearedBy, uint256 timestamp);
    event CheckInRecorded(address indexed player, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    function submitScore(
        uint256 score,
        uint256 wave,
        uint256 streak,
        string calldata name
    ) external {
        require(score > 0, "Score must be greater than 0");
        require(bytes(name).length > 0 && bytes(name).length <= 32, "Invalid name length");

        uint256 existingIndex = playerIndex[msg.sender];

        if (existingIndex > 0) {
            // Update existing entry
            Entry storage existing = entries[existingIndex - 1];
            if (score > existing.score) {
                existing.score = score;
                existing.wave = wave;
                existing.streak = streak;
                existing.name = name;
                existing.timestamp = block.timestamp;
            }
        } else {
            // New entry
            if (entries.length < MAX_ENTRIES) {
                entries.push(Entry({
                    player: msg.sender,
                    name: name,
                    score: score,
                    wave: wave,
                    streak: streak,
                    timestamp: block.timestamp
                }));
                playerIndex[msg.sender] = entries.length;
            } else {
                // Find lowest score
                uint256 lowestIndex = 0;
                uint256 lowestScore = entries[0].score;

                for (uint256 i = 1; i < entries.length; i++) {
                    if (entries[i].score < lowestScore) {
                        lowestScore = entries[i].score;
                        lowestIndex = i;
                    }
                }

                if (score > lowestScore) {
                    // Remove old player from mapping
                    delete playerIndex[entries[lowestIndex].player];

                    // Replace with new entry
                    entries[lowestIndex] = Entry({
                        player: msg.sender,
                        name: name,
                        score: score,
                        wave: wave,
                        streak: streak,
                        timestamp: block.timestamp
                    });
                    playerIndex[msg.sender] = lowestIndex + 1;
                }
            }
        }

        emit ScoreSubmitted(msg.sender, score, wave, streak, name);
    }

    /// @notice Record daily check-in for msg.sender. Does not affect leaderboard.
    function recordCheckIn() external {
        lastCheckIn[msg.sender] = block.timestamp;
        emit CheckInRecorded(msg.sender, block.timestamp);
    }

    /// @notice Alias for recordCheckIn() for frontend/miniapp compatibility.
    function checkIn() external {
        recordCheckIn();
    }

    function getTopPlayers() external view returns (Entry[] memory) {
        return entries;
    }

    function clearLeaderboard() external onlyOwner {
        uint256 length = entries.length;
        for (uint256 i = 0; i < length; i++) {
            delete playerIndex[entries[i].player];
        }
        delete entries;

        emit LeaderboardCleared(msg.sender, block.timestamp);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
    }
}
