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

contract StablecoinAVSServiceManager is ECDSAServiceManagerBase, IStablecoinAVSServiceManager {
    using ECDSAUpgradeable for bytes32;
    
    // State variables
    CollateralManager public collateralManager;
    uint32 public latestCheckpointId;
    
    // Monitoring thresholds aligned with CollateralManager
    uint256 public constant MIN_COLLATERAL_RATIO = 150; // 150%
    uint256 public constant CRITICAL_COLLATERAL_RATIO = 130; // 130%

    mapping(uint32 => CollateralCheckpoint) public checkpoints;
    mapping(uint32 => mapping(address => bool)) public validatorConfirmations;

    event NewCheckpointCreated(uint32 indexed checkpointId, CollateralCheckpoint checkpoint);
    event CheckpointConfirmed(uint32 indexed checkpointId, address indexed validator);
    event CollateralWarning(uint32 indexed checkpointId, uint256 collateralRatio);
    event LiquidationTriggered(address indexed position, uint256 collateralRatio);

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
    // Get current prices and calculate real collateral value
    address[] memory activeCollateral = collateralManager.getActiveCollateral();
    uint256 realCollateralValue = 0;
    
    for (uint256 i = 0; i < activeCollateral.length; i++) {
        address token = activeCollateral[i];
        uint256 amount = collateralManager.getTotalCollateralAmount(token);
        uint256 price = collateralManager.priceOracle().getPrice(token);
        realCollateralValue += amount * price;
    }

    // Create checkpoint with real values
    uint32 checkpointId = ++latestCheckpointId;
    CollateralCheckpoint memory checkpoint = CollateralCheckpoint({
        timestamp: block.timestamp,
        totalCollateralValue: realCollateralValue,
        totalStablecoinSupply: totalStablecoinSupply,
        merkleRoot: merkleRoot
    });

    checkpoints[checkpointId] = checkpoint;
    emit NewCheckpointCreated(checkpointId, checkpoint);
    return checkpoint;
}

    function confirmCheckpoint(
        uint32 checkpointId,
        CollateralCheckpoint calldata checkpoint,
        bytes memory signature
    ) external {
        require(checkpointId <= latestCheckpointId, "Invalid checkpoint ID");
        require(!validatorConfirmations[checkpointId][msg.sender], "Already confirmed");
        
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

        validatorConfirmations[checkpointId][msg.sender] = true;
        emit CheckpointConfirmed(checkpointId, msg.sender);

        // Check if liquidation is needed
        uint256 collateralRatio = (checkpoint.totalCollateralValue * 100) / checkpoint.totalStablecoinSupply;
        if (collateralRatio <= CRITICAL_COLLATERAL_RATIO) {
            // Trigger liquidation through CollateralManager
            emit LiquidationTriggered(msg.sender, collateralRatio);
        }
    }

    function getCheckpoint(uint32 checkpointId) external view returns (CollateralCheckpoint memory) {
        require(checkpointId <= latestCheckpointId, "Invalid checkpoint ID");
        return checkpoints[checkpointId];
    }
    
    function isCheckpointConfirmed(uint32 checkpointId, address validator) external view returns (bool) {
        return validatorConfirmations[checkpointId][validator];
    }
} 