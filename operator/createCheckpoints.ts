import { ethers } from "ethers";
import * as dotenv from "dotenv";
const fs = require('fs');
const path = require('path');
dotenv.config();

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
let chainId = 31337;

const avsDeploymentData = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../contracts/deployments/stablecoin_avs/${chainId}.json`), 'utf8'));

if (!avsDeploymentData || !avsDeploymentData.addresses) {
    throw new Error("Deployment data or address is undefined");
}

const stablecoinAVSServiceManagerAddress = avsDeploymentData.addresses.stablecoinAVSServiceManager;
const stablecoinAVSServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/StablecoinAVSServiceManager.json'), 'utf8'));
const stablecoinAVS = new ethers.Contract(stablecoinAVSServiceManagerAddress, stablecoinAVSServiceManagerABI, wallet);

// Simulation constants
const CRITICAL_RATIO = 130; // 130%
const INITIAL_PRICE = BigInt(2000) * BigInt(10**18); // Initial price $2000
const MAX_PRICE_CHANGE = 10; // Max 10% price change per interval

let currentPrice = INITIAL_PRICE;

function simulatePriceChange(): bigint {
    // Random change between -MAX_PRICE_CHANGE and +MAX_PRICE_CHANGE percent
    const changePercent = (Math.random() * 2 - 1) * MAX_PRICE_CHANGE;
    const change = (currentPrice * BigInt(Math.floor(changePercent * 100))) / BigInt(10000);
    currentPrice = currentPrice + change;
    return currentPrice;
}

async function createNewCheckpoint() {
    try {
        // Simulate new price and calculate values
        const newPrice = simulatePriceChange();
        const collateralAmount = BigInt(10) * BigInt(10**18); // 10 ETH collateral
        const totalCollateralValue = (newPrice * collateralAmount) / BigInt(10**18);
        const totalStablecoinSupply = BigInt(15000) * BigInt(10**18); // 15000 stablecoins
        
        // Calculate current ratio
        const collateralRatio = (totalCollateralValue * BigInt(100)) / totalStablecoinSupply;
        
        console.log(`
            New ETH Price: $${ethers.formatEther(newPrice)}
            Total Collateral Value: $${ethers.formatEther(totalCollateralValue)}
            Collateral Ratio: ${collateralRatio}%
        `);

        // Create merkle root from state
        const merkleRoot = ethers.keccak256(
            ethers.AbiCoder.defaultAbiCoder().encode(
                ["uint256", "uint256", "uint256"],
                [newPrice, totalCollateralValue, totalStablecoinSupply]
            )
        );

        const tx = await stablecoinAVS.createNewCheckpoint(
            totalCollateralValue,
            totalStablecoinSupply,
            merkleRoot,
            { gasLimit: ethers.parseUnits("1000000", "wei") }
        );
        
        const receipt = await tx.wait();
        console.log(`Checkpoint created with hash: ${receipt.hash}`);

        // Alert if ratio is too low
        if (collateralRatio < BigInt(150)) {
            console.warn(`⚠️ WARNING: Low collateral ratio detected: ${collateralRatio}%`);
        }

    } catch (error) {
        console.error('Error creating checkpoint:', error);
    }
}

async function startSimulation() {
    console.log("Starting price simulation and checkpoint creation...");
    console.log(`Initial ETH Price: $${ethers.formatEther(currentPrice)}`);
    
    for(let i = 0; i < 3; i++) {
        await createNewCheckpoint();
    }
}

// Start the simulation
startSimulation().catch(console.error); 