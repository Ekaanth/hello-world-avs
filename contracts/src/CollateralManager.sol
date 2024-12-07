// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin-upgrades/contracts/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin-upgrades/contracts/access/OwnableUpgradeable.sol";
import "@openzeppelin-upgrades/contracts/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin-upgrades/contracts/token/ERC20/IERC20Upgradeable.sol";
import "./interfaces/IEigUSD.sol";
import "./interfaces/IPriceOracle.sol";

contract CollateralManager is ReentrancyGuardUpgradeable, OwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    struct CollateralType {
        uint256 weight;          // Weight in basis points (100 = 1%)
        uint256 minCollateral;   // Minimum collateral amount
        uint256 maxCollateral;   // Maximum collateral amount
        bool isActive;
    }
    
    struct Position {
        mapping(address => uint256) collateralAmounts;
        uint256 mintedEigUSD;
        uint256 lastUpdateBlock;
        bool exists;
    }

    // Constants
    uint256 public constant MINIMUM_COLLATERAL_RATIO = 150; // 150%
    uint256 public constant LIQUIDATION_THRESHOLD = 130;    // 130%
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant LIQUIDATION_BONUS = 500;        // 5% bonus for liquidators

    // State variables
    IEigUSD public eigUSD;
    IPriceOracle public priceOracle;
    mapping(address => CollateralType) public collateralTypes;
    mapping(address => Position) public positions;
    
    // Events
    event CollateralAdded(address indexed token, uint256 weight, uint256 minCollateral, uint256 maxCollateral);
    event CollateralDeposited(address indexed user, address indexed token, uint256 amount);
    event StablecoinMinted(address indexed user, uint256 amount);
    event PositionLiquidated(address indexed user, address indexed liquidator, uint256 debt, uint256 collateralValue);
    event CollateralWithdrawn(address indexed user, address indexed token, uint256 amount);

    function initialize(
        address _eigUSD,
        address _priceOracle
    ) external initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        eigUSD = IEigUSD(_eigUSD);
        priceOracle = IPriceOracle(_priceOracle);
    }

    // Admin functions
    function addCollateralType(
        address token,
        uint256 weight,
        uint256 minCollateral,
        uint256 maxCollateral
    ) external onlyOwner {
        require(weight <= BASIS_POINTS, "Weight exceeds maximum");
        
        collateralTypes[token] = CollateralType({
            weight: weight,
            minCollateral: minCollateral,
            maxCollateral: maxCollateral,
            isActive: true
        });
        
        emit CollateralAdded(token, weight, minCollateral, maxCollateral);
    }

    // Core functions
    function depositCollateralAndMint(
        address[] calldata tokens,
        uint256[] calldata amounts,
        uint256 eigUSDToMint
    ) external nonReentrant {
        require(tokens.length == amounts.length, "Length mismatch");
        require(eigUSDToMint > 0, "Zero mint amount");

        uint256 totalCollateralValue = 0;
        Position storage position = positions[msg.sender];
        position.exists = true;
        position.lastUpdateBlock = block.number;

        // Process deposits
        for (uint256 i = 0; i < tokens.length; i++) {
            require(collateralTypes[tokens[i]].isActive, "Invalid collateral");
            
            CollateralType memory collType = collateralTypes[tokens[i]];
            uint256 newAmount = position.collateralAmounts[tokens[i]] + amounts[i];
            
            require(newAmount >= collType.minCollateral, "Below min collateral");
            require(newAmount <= collType.maxCollateral, "Exceeds max collateral");

            // Transfer collateral
            IERC20Upgradeable(tokens[i]).safeTransferFrom(msg.sender, address(this), amounts[i]);
            position.collateralAmounts[tokens[i]] = newAmount;
            
            totalCollateralValue += getCollateralValue(tokens[i], amounts[i]);
            emit CollateralDeposited(msg.sender, tokens[i], amounts[i]);
        }

        // Verify collateral ratio
        uint256 newTotalDebt = position.mintedEigUSD + eigUSDToMint;
        require(
            totalCollateralValue >= (newTotalDebt * MINIMUM_COLLATERAL_RATIO) / 100,
            "Insufficient collateral"
        );

        // Mint eigUSD
        position.mintedEigUSD = newTotalDebt;
        eigUSD.mint(msg.sender, eigUSDToMint);
        
        emit StablecoinMinted(msg.sender, eigUSDToMint);
    }

    function liquidatePosition(
        address user,
        address[] calldata collateralTokens
    ) external nonReentrant {
        Position storage position = positions[user];
        require(position.exists, "Position doesn't exist");
        require(!isPositionHealthy(user), "Position is healthy");

        uint256 totalDebt = position.mintedEigUSD;
        uint256 totalCollateralValue = 0;

        // Calculate liquidation amounts
        for (uint256 i = 0; i < collateralTokens.length; i++) {
            address token = collateralTokens[i];
            uint256 amount = position.collateralAmounts[token];
            if (amount > 0) {
                uint256 value = getCollateralValue(token, amount);
                totalCollateralValue += value;
                
                // Transfer collateral to liquidator with bonus
                uint256 liquidatorAmount = (amount * (BASIS_POINTS + LIQUIDATION_BONUS)) / BASIS_POINTS;
                IERC20Upgradeable(token).safeTransfer(msg.sender, liquidatorAmount);
                position.collateralAmounts[token] = 0;
            }
        }

        // Burn eigUSD
        eigUSD.burn(user, totalDebt);
        position.mintedEigUSD = 0;
        
        emit PositionLiquidated(user, msg.sender, totalDebt, totalCollateralValue);
    }

    function withdrawCollateral(
        address token,
        uint256 amount
    ) external nonReentrant {
        Position storage position = positions[msg.sender];
        require(position.exists, "Position doesn't exist");
        require(position.collateralAmounts[token] >= amount, "Insufficient balance");

        // Calculate new collateral ratio after withdrawal
        uint256 newCollateralAmount = position.collateralAmounts[token] - amount;
        position.collateralAmounts[token] = newCollateralAmount;

        require(isPositionHealthy(msg.sender), "Withdrawal would make position unhealthy");

        IERC20Upgradeable(token).safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, token, amount);
    }

    // View functions
    function getCollateralValue(
        address token,
        uint256 amount
    ) public view returns (uint256) {
        uint256 price = priceOracle.getPrice(token);
        return (price * amount * collateralTypes[token].weight) / BASIS_POINTS;
    }

    function isPositionHealthy(address user) public view returns (bool) {
        Position storage position = positions[user];
        if (!position.exists || position.mintedEigUSD == 0) return true;

        uint256 totalCollateralValue = 0;
        address[] memory activeCollateral = getActiveCollateral();

        for (uint256 i = 0; i < activeCollateral.length; i++) {
            address token = activeCollateral[i];
            uint256 amount = position.collateralAmounts[token];
            if (amount > 0) {
                totalCollateralValue += getCollateralValue(token, amount);
            }
        }

        return totalCollateralValue >= (position.mintedEigUSD * MINIMUM_COLLATERAL_RATIO) / 100;
    }

    function getActiveCollateral() public view returns (address[] memory) {
        // Implementation needed - returns array of active collateral token addresses
        // This would maintain a dynamic array of active collateral tokens
    }

    function getPositionCollateralValue(address user) public view returns (uint256) {
        uint256 totalValue = 0;
        address[] memory activeCollateral = getActiveCollateral();

        for (uint256 i = 0; i < activeCollateral.length; i++) {
            address token = activeCollateral[i];
            uint256 amount = positions[user].collateralAmounts[token];
            if (amount > 0) {
                totalValue += getCollateralValue(token, amount);
            }
        }

        return totalValue;
    }
}