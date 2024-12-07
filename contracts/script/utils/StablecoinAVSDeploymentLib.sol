// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {StablecoinAVSServiceManager} from "../../src/StablecoinAVSServiceManager.sol";
import {ECDSAStakeRegistry} from "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import {CoreDeploymentLib} from "./CoreDeploymentLib.sol";
import {UpgradeableProxyLib} from "./UpgradeableProxyLib.sol";
import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {Quorum} from "@eigenlayer-middleware/src/interfaces/IECDSAStakeRegistryEventsAndErrors.sol";
import {Vm} from "forge-std/Vm.sol";
import {IDelegationManager} from "@eigenlayer/contracts/interfaces/IDelegationManager.sol";

library StablecoinAVSDeploymentLib {
    using UpgradeableProxyLib for address;

    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));


    struct DeploymentData {
        address stakeRegistry;
        address stablecoinAVSServiceManager;
        address strategy;
        address token;
        address eigUSD;
        address collateralManager;
        address priceOracle;
    }

    function deployContracts(
        address proxyAdmin,
        CoreDeploymentLib.DeploymentData memory core,
        Quorum memory quorum,
        address collateralManager
    ) internal returns (DeploymentData memory deploymentData) {
         DeploymentData memory result;

        // First, deploy upgradeable proxy contracts that will point to the implementations.
        result.stablecoinAVSServiceManager = UpgradeableProxyLib.setUpEmptyProxy(proxyAdmin);
        result.stakeRegistry = UpgradeableProxyLib.setUpEmptyProxy(proxyAdmin);
        // Deploy the implementation contracts, using the proxy contracts as inputs
        address stakeRegistryImpl =
            address(new ECDSAStakeRegistry(IDelegationManager(core.delegationManager)));
        address helloWorldServiceManagerImpl = address(
            new StablecoinAVSServiceManager(
                core.avsDirectory, result.stakeRegistry, core.rewardsCoordinator, core.delegationManager, collateralManager
            )
        );
        // Upgrade contracts
        bytes memory upgradeCall = abi.encodeCall(
            ECDSAStakeRegistry.initialize, (result.stablecoinAVSServiceManager, 0, quorum)
        );
        UpgradeableProxyLib.upgradeAndCall(result.stakeRegistry, stakeRegistryImpl, upgradeCall);
        UpgradeableProxyLib.upgrade(result.stablecoinAVSServiceManager, helloWorldServiceManagerImpl);

        return result;
    }

    function writeDeploymentJson(DeploymentData memory deploymentData) internal {
        // Create directory if it doesn't exist
        vm.createDir("deployments/stablecoin_avs", true);
        string memory deploymentJsonString = vm.serializeAddress(
            "deployment",
            "stakeRegistry",
            deploymentData.stakeRegistry
        );
        deploymentJsonString = vm.serializeAddress(
            "deployment",
            "stablecoinAVSServiceManager",
            deploymentData.stablecoinAVSServiceManager
        );
        deploymentJsonString = vm.serializeAddress(
            "deployment",
            "strategy",
            deploymentData.strategy
        );
        deploymentJsonString = vm.serializeAddress(
            "deployment",
            "token",
            deploymentData.token
        );
        deploymentJsonString = vm.serializeAddress(
            "deployment",
            "eigUSD",
            deploymentData.eigUSD
        );
        deploymentJsonString = vm.serializeAddress(
            "deployment",
            "collateralManager",
            deploymentData.collateralManager
        );
        deploymentJsonString = vm.serializeAddress(
            "deployment",
            "priceOracle",
            deploymentData.priceOracle
        );

        vm.writeJson(deploymentJsonString, "deployments/stablecoin_avs/deployment.json");
    }

    function readDeploymentJson(
        string memory path,
        uint256 chainId
    ) internal view returns (DeploymentData memory) {
        string memory chainIdString = vm.toString(chainId);
        string memory deploymentJson = vm.readFile(
            string.concat(path, chainIdString, "/deployment.json")
        );

        DeploymentData memory deploymentData;
        deploymentData.stakeRegistry = vm.parseJsonAddress(
            deploymentJson,
            ".stakeRegistry"
        );
        deploymentData.stablecoinAVSServiceManager = vm.parseJsonAddress(
            deploymentJson,
            ".stablecoinAVSServiceManager"
        );
        deploymentData.strategy = vm.parseJsonAddress(deploymentJson, ".strategy");
        deploymentData.token = vm.parseJsonAddress(deploymentJson, ".token");
        deploymentData.eigUSD = vm.parseJsonAddress(deploymentJson, ".eigUSD");
        deploymentData.collateralManager = vm.parseJsonAddress(
            deploymentJson,
            ".collateralManager"
        );
        deploymentData.priceOracle = vm.parseJsonAddress(
            deploymentJson,
            ".priceOracle"
        );

        return deploymentData;
    }
} 