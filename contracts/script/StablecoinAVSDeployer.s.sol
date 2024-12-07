// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/Test.sol";
import {StablecoinAVSDeploymentLib} from "./utils/StablecoinAVSDeploymentLib.sol";
import {CoreDeploymentLib} from "./utils/CoreDeploymentLib.sol";
import {UpgradeableProxyLib} from "./utils/UpgradeableProxyLib.sol";
import {StrategyBase} from "@eigenlayer/contracts/strategies/StrategyBase.sol";
import {ERC20Mock} from "../test/ERC20Mock.sol";
import {TransparentUpgradeableProxy} from
    "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import {StrategyFactory} from "@eigenlayer/contracts/strategies/StrategyFactory.sol";
import {EigUSD} from "../src/EigUSD.sol";
import {CollateralManager} from "../src/CollateralManager.sol";
import {StablecoinAVSServiceManager} from "../src/StablecoinAVSServiceManager.sol";
import {PriceOracleMock} from "../test/PriceOracleMock.sol";

import {
    Quorum,
    StrategyParams,
    IStrategy
} from "@eigenlayer-middleware/src/interfaces/IECDSAStakeRegistryEventsAndErrors.sol";

contract StablecoinAVSDeployer is Script {
    using CoreDeploymentLib for *;
    using UpgradeableProxyLib for address;

    address private deployer;
    address proxyAdmin;
    IStrategy stablecoinStrategy;
    CoreDeploymentLib.DeploymentData coreDeployment;
    StablecoinAVSDeploymentLib.DeploymentData stablecoinDeployment;
    Quorum internal quorum;
    ERC20Mock token;
    
    // StablecoinAVS specific contracts
    EigUSD eigUSD;
    CollateralManager collateralManager;
    PriceOracleMock priceOracle;

    function setUp() public virtual {
        deployer = vm.rememberKey(vm.envUint("PRIVATE_KEY"));
        vm.label(deployer, "Deployer");

        coreDeployment = CoreDeploymentLib.readDeploymentJson("deployments/core/", block.chainid);
       
        token = new ERC20Mock();
        stablecoinStrategy = IStrategy(StrategyFactory(coreDeployment.strategyFactory).deployNewStrategy(token));

        quorum.strategies.push(
            StrategyParams({strategy: stablecoinStrategy, multiplier: 10_000})
        );
    }

    function run() external {
        vm.startBroadcast(deployer);
        
        // Deploy proxy admin
        proxyAdmin = UpgradeableProxyLib.deployProxyAdmin();

        // Deploy mock price oracle
        priceOracle = new PriceOracleMock();

        // Deploy and initialize EigUSD
        address eigUSDImpl = address(new EigUSD());
        address eigUSDProxy = address(new TransparentUpgradeableProxy(
            eigUSDImpl,
            proxyAdmin,
            ""
        ));
        eigUSD = EigUSD(eigUSDProxy);

        // Deploy and initialize CollateralManager
        address collateralManagerImpl = address(new CollateralManager());
        address collateralManagerProxy = address(new TransparentUpgradeableProxy(
            collateralManagerImpl,
            proxyAdmin,
            ""
        ));
        collateralManager = CollateralManager(collateralManagerProxy);

        // Initialize contracts
        eigUSD.initialize(address(collateralManager));
        collateralManager.initialize(address(eigUSD), address(priceOracle));

        // Deploy StablecoinAVS contracts
        stablecoinDeployment = StablecoinAVSDeploymentLib.deployContracts(
            proxyAdmin,
            coreDeployment,
            quorum,
            address(collateralManager)
        );

        stablecoinDeployment.strategy = address(stablecoinStrategy);
        stablecoinDeployment.token = address(token);
        stablecoinDeployment.eigUSD = address(eigUSD);
        stablecoinDeployment.collateralManager = address(collateralManager);
        stablecoinDeployment.priceOracle = address(priceOracle);

        vm.stopBroadcast();

        verifyDeployment();
        StablecoinAVSDeploymentLib.writeDeploymentJson(stablecoinDeployment);
    }

    function verifyDeployment() internal view {
        require(
            stablecoinDeployment.stakeRegistry != address(0),
            "StakeRegistry address cannot be zero"
        );
        require(
            stablecoinDeployment.stablecoinAVSServiceManager != address(0),
            "StablecoinAVSServiceManager address cannot be zero"
        );
        require(
            stablecoinDeployment.strategy != address(0),
            "Strategy address cannot be zero"
        );
        require(
            stablecoinDeployment.eigUSD != address(0),
            "EigUSD address cannot be zero"
        );
        require(
            stablecoinDeployment.collateralManager != address(0),
            "CollateralManager address cannot be zero"
        );
        require(proxyAdmin != address(0), "ProxyAdmin address cannot be zero");
        require(
            coreDeployment.delegationManager != address(0),
            "DelegationManager address cannot be zero"
        );
        require(
            coreDeployment.avsDirectory != address(0),
            "AVSDirectory address cannot be zero"
        );
    }
} 