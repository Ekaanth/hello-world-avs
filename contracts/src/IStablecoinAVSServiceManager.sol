// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IStablecoinAVSServiceManager {
    struct CollateralCheckpoint {
        uint256 timestamp;
        uint256 totalCollateralValue;
        uint256 totalStablecoinSupply;
        bytes32 merkleRoot;
    }

    function createNewCheckpoint(
        uint256 totalCollateralValue,
        uint256 totalStablecoinSupply,
        bytes32 merkleRoot
    ) external returns (CollateralCheckpoint memory);

    function confirmCheckpoint(
        uint32 checkpointId,
        CollateralCheckpoint calldata checkpoint,
        bytes memory signature
    ) external;

    function getCheckpoint(uint32 checkpointId) external view returns (CollateralCheckpoint memory);
    
    function isCheckpointConfirmed(uint32 checkpointId, address validator) external view returns (bool);
} 