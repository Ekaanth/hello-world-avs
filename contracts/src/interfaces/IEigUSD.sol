// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IEigUSD {
    /**
     * @notice Mints new eigUSD tokens
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) external;

    /**
     * @notice Burns eigUSD tokens
     * @param from The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burn(address from, uint256 amount) external;
} 