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
import {stdJson} from "forge-std/StdJson.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {console2} from "forge-std/Test.sol";

library StablecoinAVSDeploymentLib {
    using stdJson for string;
    using Strings for *;
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
    ) internal returns (DeploymentData memory result) {
        DeploymentData memory result;

        // First, deploy upgradeable proxy contracts that will point to the implementations.
        result.stablecoinAVSServiceManager = UpgradeableProxyLib.setUpEmptyProxy(proxyAdmin);
        result.stakeRegistry = UpgradeableProxyLib.setUpEmptyProxy(proxyAdmin);
        // Deploy the implementation contracts, using the proxy contracts as inputs
        address stakeRegistryImpl =
            address(new ECDSAStakeRegistry(IDelegationManager(core.delegationManager)));
        address stablecoinAVSServiceManagerImpl = address(
            new StablecoinAVSServiceManager(
                core.avsDirectory, result.stakeRegistry, core.rewardsCoordinator, core.delegationManager, collateralManager
            )
        );
        // Upgrade contracts
        bytes memory upgradeCall = abi.encodeCall(
            ECDSAStakeRegistry.initialize, (result.stablecoinAVSServiceManager, 0, quorum)
        );
        UpgradeableProxyLib.upgradeAndCall(result.stakeRegistry, stakeRegistryImpl, upgradeCall);
        UpgradeableProxyLib.upgrade(result.stablecoinAVSServiceManager, stablecoinAVSServiceManagerImpl);

        return result;
    }

    function writeDeploymentJson(DeploymentData memory data) internal {
        writeDeploymentJson("deployments/stablecoin_avs/", block.chainid, data);
    }

    function writeDeploymentJson(
        string memory outputPath,
        uint256 chainId,
        DeploymentData memory data
    ) internal {
        address proxyAdmin = address(UpgradeableProxyLib.getProxyAdmin(data.stablecoinAVSServiceManager));
        string memory deploymentData = _generateDeploymentJson(data, proxyAdmin);

        string memory fileName = string.concat(outputPath, vm.toString(chainId), ".json");
        if (!vm.exists(outputPath)) {
            vm.createDir(outputPath, true);
        }

        vm.writeFile(fileName, deploymentData);
        console2.log("Deployment artifacts written to:", fileName);
    }

    function _generateDeploymentJson(
        DeploymentData memory data,
        address proxyAdmin
    ) private view returns (string memory) {
        return string.concat(
            '{"lastUpdate":{"timestamp":"',
            vm.toString(block.timestamp),
            '","block_number":"',
            vm.toString(block.number),
            '"},"addresses":',
            _generateContractsJson(data, proxyAdmin),
            "}"
        );
    }

    function _generateContractsJson(
        DeploymentData memory data,
        address proxyAdmin
    ) private view returns (string memory) {
        return string.concat(
            '{"proxyAdmin":"',
            proxyAdmin.toHexString(),
            '","stablecoinAVSServiceManager":"',
            data.stablecoinAVSServiceManager.toHexString(),
            '","stablecoinAVSServiceManagerImpl":"',
            data.stablecoinAVSServiceManager.getImplementation().toHexString(),
            '","stakeRegistry":"',
            data.stakeRegistry.toHexString(),
            '","stakeRegistryImpl":"',
            data.stakeRegistry.getImplementation().toHexString(),
            '","strategy":"',
            data.strategy.toHexString(),
            '","token":"',
            data.token.toHexString(),
            '","eigUSD":"',
            data.eigUSD.toHexString(),
            '","collateralManager":"',
            data.collateralManager.toHexString(),
            '","priceOracle":"',
            data.priceOracle.toHexString(),
            '"}'
        );
    }

    function readDeploymentJson(
        string memory path,
        uint256 chainId
    ) internal returns (DeploymentData memory) {
        string memory fileName = string.concat(path, vm.toString(chainId), ".json");
        require(vm.exists(fileName), "Deployment file does not exist");
        
        string memory json = vm.readFile(fileName);
        DeploymentData memory data;
        
        data.stablecoinAVSServiceManager = json.readAddress(".addresses.stablecoinAVSServiceManager");
        data.stakeRegistry = json.readAddress(".addresses.stakeRegistry");
        data.strategy = json.readAddress(".addresses.strategy");
        data.token = json.readAddress(".addresses.token");
        data.eigUSD = json.readAddress(".addresses.eigUSD");
        data.collateralManager = json.readAddress(".addresses.collateralManager");
        data.priceOracle = json.readAddress(".addresses.priceOracle");

        return data;
    }
} 