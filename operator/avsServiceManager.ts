import { ServiceManager } from "./serviceManager";
import { StablecoinAVSServiceManager } from "../typechain-types";
import { ethers } from "ethers";

export class AVSServiceManager {
  private serviceManager: ServiceManager;
  private stablecoinAVS: StablecoinAVSServiceManager;
  private readonly CRITICAL_RATIO = 130; // 130%

  constructor(serviceManager: ServiceManager) {
    this.serviceManager = serviceManager;
    this.stablecoinAVS = serviceManager.stablecoinAVS;
  }

  async startMonitoring() {
    console.log("Starting collateral monitoring...");
    
    this.stablecoinAVS.on(
        this.stablecoinAVS.getEvent("NewCheckpointCreated"),
        async (checkpointId: bigint, checkpoint: any) => {
            console.log(`New checkpoint created: ${checkpointId.toString()}`);
      
            const collateralRatio = checkpoint.totalCollateralValue * BigInt(100) / checkpoint.totalStablecoinSupply;
            console.log(`Collateral ratio: ${collateralRatio.toString()}%`);

            if (this.isValidCheckpoint(checkpoint, collateralRatio)) {
                const signature = await this.signCheckpoint(checkpointId, checkpoint);
                await this.stablecoinAVS.confirmCheckpoint(checkpointId, checkpoint, signature);
                
                // Log warning if ratio is close to critical
                if (collateralRatio < BigInt(150)) {
                    console.warn(`Warning: Low collateral ratio: ${collateralRatio.toString()}%`);
                }
            }
    });
  }

  private isValidCheckpoint(checkpoint: any, collateralRatio: bigint): boolean {
    if (checkpoint.totalStablecoinSupply === BigInt(0)) return false;
    if (collateralRatio < BigInt(this.CRITICAL_RATIO)) return false;
    if (checkpoint.timestamp > Math.floor(Date.now() / 1000)) return false;
    return true;
  }

  private async signCheckpoint(checkpointId: bigint, checkpoint: any): Promise<string> {
    const messageHash = ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
            ["uint32", "uint256", "uint256", "bytes32"],
            [Number(checkpointId), checkpoint.totalCollateralValue, checkpoint.totalStablecoinSupply, checkpoint.merkleRoot]
        )
    );
    return await this.serviceManager.signer.signMessage(ethers.getBytes(messageHash));
  }
} 


