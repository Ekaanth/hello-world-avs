import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { StablecoinAVSServiceManager } from "../typechain-types";

dotenv.config();

export class ServiceManager {
    public signer: ethers.Signer;
    public stablecoinAVS: StablecoinAVSServiceManager;

    constructor(signer: ethers.Signer, stablecoinAVS: StablecoinAVSServiceManager) {
        this.signer = signer;
        this.stablecoinAVS = stablecoinAVS;
    }

    static async create(chainId: number, signer: ethers.Signer): Promise<ServiceManager> {
        const deploymentPath = `../deployments/stablecoin_avs/${chainId}.json`;
        const deployment = require(deploymentPath);
        
        const stablecoinAVS = new ethers.Contract(
            deployment.stablecoinAVSServiceManager,
            require('../abis/StablecoinAVSServiceManager.json'),
            signer
        ) as unknown as StablecoinAVSServiceManager;

        return new ServiceManager(signer, stablecoinAVS);
    }

    async registerOperator(): Promise<void> {
        // Implementation needed
        console.log("Registering operator...");
    }
} 