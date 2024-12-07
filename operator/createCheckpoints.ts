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
const stablecoinAVSServiceManagerAddress = avsDeploymentData.stablecoinAVSServiceManager;
const stablecoinAVSServiceManagerABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../abis/StablecoinAVSServiceManager.json'), 'utf8'));

// Initialize contract objects from ABIs
const stablecoinAVS = new ethers.Contract(stablecoinAVSServiceManagerAddress, stablecoinAVSServiceManagerABI, wallet);

// Function to generate random collateral values (using smaller numbers)
function generateRandomValues(): { collateral: bigint, supply: bigint } {
    // Random collateral between 15-25 ETH (with 18 decimals)
    const collateral = BigInt(Math.floor(Math.random() * 10 + 15)) * BigInt(10**18);
    // Random supply between 10-15 USD (with 18 decimals)
    const supply = BigInt(Math.floor(Math.random() * 5 + 10)) * BigInt(10**18);
    return { collateral, supply };
}

async function createNewCheckpoint() {
    try {
        // Check balance first
        const balance = await provider.getBalance(wallet.address);
        const gasEstimate = await stablecoinAVS.createNewCheckpoint.estimateGas(
            0n, 0n, ethers.ZeroHash
        );
        const gasPrice = await provider.getFeeData();
        const gasCost = gasEstimate * gasPrice.gasPrice!;

        if (balance < gasCost) {
            console.error(`Insufficient funds. Have ${ethers.formatEther(balance)} ETH, need ${ethers.formatEther(gasCost)} ETH`);
            return;
        }

        const { collateral, supply } = generateRandomValues();
        const merkleRoot = ethers.keccak256(ethers.toUtf8Bytes("checkpoint")); 

        const tx = await stablecoinAVS.createNewCheckpoint(
            collateral,
            supply,
            merkleRoot,
            { gasLimit: gasEstimate * 12n / 10n } // Add 20% buffer to gas estimate
        );
        
        const receipt = await tx.wait();
        console.log(`Checkpoint created with hash: ${receipt.hash}`);
        console.log(`Collateral Ratio: ${Number(collateral * BigInt(100) / supply)}%`);
    } catch (error) {
        console.error('Error creating checkpoint:', error);
    }
}

// Create checkpoints every 30 seconds
function startCreatingCheckpoints() {
    setInterval(() => {
        console.log("Creating new checkpoint...");
        createNewCheckpoint();
    }, 30000);
}

// Start the process
startCreatingCheckpoints(); 