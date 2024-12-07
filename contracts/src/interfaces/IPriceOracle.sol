// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IPriceOracle {
    /**
     * @notice Gets the current price of a token
     * @param token The token address to get the price for
     * @return The current price with 18 decimals of precision
     */
    function getPrice(address token) external view returns (uint256);
} 