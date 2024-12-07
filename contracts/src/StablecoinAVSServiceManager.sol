// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ECDSAServiceManagerBase} from 
    "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import {ECDSAStakeRegistry} from "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import {IServiceManager} from "@eigenlayer-middleware/src/interfaces/IServiceManager.sol";
import {ECDSAUpgradeable} from 
    "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import {IStablecoinAVSServiceManager} from "./IStablecoinAVSServiceManager.sol";
import "./CollateralManager.sol";
import {Vm} from "forge-std/Vm.sol";

contract StablecoinAVSServiceManager is ECDSAServiceManagerBase, IStablecoinAVSServiceManager {
    using ECDSAUpgradeable for bytes32;

    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    // State variables
    CollateralManager public collateralManager;
    uint32 public latestCheckpointId;
    
    // Monitoring thresholds
    uint256 public constant MIN_COLLATERAL_RATIO = 150; // 150%
    uint256 public constant CRITICAL_COLLATERAL_RATIO = 130; // 130%

    // Storage
    mapping(uint32 => bytes32) public checkpointHashes;
    mapping(uint32 => mapping(address => bool)) public validatorConfirmations;
    mapping(uint32 => CollateralCheckpoint) public checkpoints;

    event NewCheckpointCreated(uint32 indexed checkpointId, CollateralCheckpoint checkpoint);
    event CheckpointConfirmed(uint32 indexed checkpointId, address indexed validator);
    event CollateralWarning(uint32 indexed checkpointId, uint256 collateralRatio);

    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _rewardsCoordinator,
        address _delegationManager,
        address _collateralManager
    ) ECDSAServiceManagerBase(
        _avsDirectory,
        _stakeRegistry,
        _rewardsCoordinator,
        _delegationManager
    ) {
        collateralManager = CollateralManager(_collateralManager);
    }

    function createNewCheckpoint(
        uint256 totalCollateralValue,
        uint256 totalStablecoinSupply,
        bytes32 merkleRoot
    ) external returns (CollateralCheckpoint memory) {
        CollateralCheckpoint memory newCheckpoint = CollateralCheckpoint({
            timestamp: block.timestamp,
            totalCollateralValue: totalCollateralValue,
            totalStablecoinSupply: totalStablecoinSupply,
            merkleRoot: merkleRoot
        });

        // Store checkpoint hash and emit event
        checkpointHashes[latestCheckpointId] = keccak256(abi.encode(newCheckpoint));
        checkpoints[latestCheckpointId] = newCheckpoint;
        
        emit NewCheckpointCreated(latestCheckpointId, newCheckpoint);
        
        // Check collateral ratio
        uint256 collateralRatio = (totalCollateralValue * 100) / totalStablecoinSupply;
        if (collateralRatio < MIN_COLLATERAL_RATIO) {
            emit CollateralWarning(latestCheckpointId, collateralRatio);
        }

        latestCheckpointId++;
        return newCheckpoint;
    }

    function confirmCheckpoint(
        uint32 checkpointId,
        CollateralCheckpoint calldata checkpoint,
        bytes memory signature
    ) external {
        // Verify checkpoint hasn't been confirmed by this validator
        require(
            !validatorConfirmations[checkpointId][msg.sender],
            "Already confirmed"
        );

        // Verify checkpoint matches stored hash
        require(
            keccak256(abi.encode(checkpoint)) == checkpointHashes[checkpointId],
            "Invalid checkpoint data"
        );

        // Verify signature
        bytes32 messageHash = keccak256(abi.encode(
            checkpointId,
            checkpoint.totalCollateralValue,
            checkpoint.totalStablecoinSupply,
            checkpoint.merkleRoot
        ));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        
        require(
            ECDSAStakeRegistry(stakeRegistry).isValidSignature(
                ethSignedMessageHash,
                signature
            ) == bytes4(0),
            "Invalid signature"
        );

        // Record confirmation
        validatorConfirmations[checkpointId][msg.sender] = true;
        emit CheckpointConfirmed(checkpointId, msg.sender);
    }

    // Helper functions
    function getCheckpoint(uint32 checkpointId) external view returns (CollateralCheckpoint memory) {
        return checkpoints[checkpointId];
    }

    function isCheckpointConfirmed(uint32 checkpointId, address validator) external view returns (bool) {
        return validatorConfirmations[checkpointId][validator];
    }
} 