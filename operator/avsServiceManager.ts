import { ServiceManager } from "./serviceManager";
import { StablecoinAVSServiceManager } from "../typechain-types";
import { ethers } from "ethers";

export class AVSServiceManager {
  private serviceManager: ServiceManager;
  private stablecoinAVS: StablecoinAVSServiceManager;

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
      
      const collateralRatio = checkpoint.totalCollateralValue.mul(100).div(checkpoint.totalStablecoinSupply);
      console.log(`Collateral ratio: ${collateralRatio}%`);

      if (this.isValidCheckpoint(checkpoint)) {
        const signature = await this.signCheckpoint(checkpointId, checkpoint);
        await this.stablecoinAVS.confirmCheckpoint(checkpointId, checkpoint, signature);
      }
    });
  }

  private isValidCheckpoint(checkpoint: any): boolean {
    return true; // Implement validation logic
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