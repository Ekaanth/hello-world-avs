// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ECDSAUpgradeable} from 
    "@openzeppelin-upgrades/contracts/utils/cryptography/ECDSAUpgradeable.sol";
import {ERC20Upgradeable} from 
    "@openzeppelin-upgrades/contracts/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable} from 
    "@openzeppelin-upgrades/contracts/access/OwnableUpgradeable.sol";
import {IEigUSD} from "./interfaces/IEigUSD.sol";

/**
 * @title EigUSD Stablecoin Implementation
 * @author EigenLayer Team
 * @notice Stablecoin implementation that integrates with EigenLayer's AVS system
 */
contract EigUSD is ERC20Upgradeable, OwnableUpgradeable, IEigUSD {
    /// @notice The address of the collateral manager contract
    address public collateralManager;

    /// @notice Event emitted when collateral manager is updated
    event CollateralManagerUpdated(address indexed oldManager, address indexed newManager);

    /**
     * @notice Modifier to restrict access to only the collateral manager
     */
    modifier onlyCollateralManager() {
        require(msg.sender == collateralManager, "EigUSD: caller is not the collateral manager");
        _;
    }

    /**
     * @notice Initializes the EigUSD contract
     * @param _collateralManager The address of the collateral manager contract
     */
    function initialize(address _collateralManager) external initializer {
        __ERC20_init("EigenLayer USD", "eigUSD");
        __Ownable_init();
        require(_collateralManager != address(0), "EigUSD: invalid collateral manager");
        collateralManager = _collateralManager;
        emit CollateralManagerUpdated(address(0), _collateralManager);
    }

    /**
     * @notice Mints new eigUSD tokens
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external override onlyCollateralManager {
        _mint(to, amount);
    }

    /**
     * @notice Burns eigUSD tokens
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burn(address from, uint256 amount) external override onlyCollateralManager {
        _burn(from, amount);
    }

    /**
     * @notice Updates the collateral manager address
     * @param _newManager The new collateral manager address
     */
    function setCollateralManager(address _newManager) external onlyOwner {
        require(_newManager != address(0), "EigUSD: invalid collateral manager");
        address oldManager = collateralManager;
        collateralManager = _newManager;
        emit CollateralManagerUpdated(oldManager, _newManager);
    }
} 