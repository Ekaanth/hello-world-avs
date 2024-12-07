/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace IStablecoinAVSServiceManager {
  export type CollateralCheckpointStruct = {
    timestamp: BigNumberish;
    totalCollateralValue: BigNumberish;
    totalStablecoinSupply: BigNumberish;
    merkleRoot: BytesLike;
  };

  export type CollateralCheckpointStructOutput = [
    timestamp: bigint,
    totalCollateralValue: bigint,
    totalStablecoinSupply: bigint,
    merkleRoot: string
  ] & {
    timestamp: bigint;
    totalCollateralValue: bigint;
    totalStablecoinSupply: bigint;
    merkleRoot: string;
  };
}

export declare namespace IRewardsCoordinator {
  export type StrategyAndMultiplierStruct = {
    strategy: AddressLike;
    multiplier: BigNumberish;
  };

  export type StrategyAndMultiplierStructOutput = [
    strategy: string,
    multiplier: bigint
  ] & { strategy: string; multiplier: bigint };

  export type RewardsSubmissionStruct = {
    strategiesAndMultipliers: IRewardsCoordinator.StrategyAndMultiplierStruct[];
    token: AddressLike;
    amount: BigNumberish;
    startTimestamp: BigNumberish;
    duration: BigNumberish;
  };

  export type RewardsSubmissionStructOutput = [
    strategiesAndMultipliers: IRewardsCoordinator.StrategyAndMultiplierStructOutput[],
    token: string,
    amount: bigint,
    startTimestamp: bigint,
    duration: bigint
  ] & {
    strategiesAndMultipliers: IRewardsCoordinator.StrategyAndMultiplierStructOutput[];
    token: string;
    amount: bigint;
    startTimestamp: bigint;
    duration: bigint;
  };
}

export declare namespace ISignatureUtils {
  export type SignatureWithSaltAndExpiryStruct = {
    signature: BytesLike;
    salt: BytesLike;
    expiry: BigNumberish;
  };

  export type SignatureWithSaltAndExpiryStructOutput = [
    signature: string,
    salt: string,
    expiry: bigint
  ] & { signature: string; salt: string; expiry: bigint };
}

export interface StablecoinAVSServiceManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "CRITICAL_COLLATERAL_RATIO"
      | "MIN_COLLATERAL_RATIO"
      | "avsDirectory"
      | "checkpointHashes"
      | "checkpoints"
      | "collateralManager"
      | "confirmCheckpoint"
      | "createAVSRewardsSubmission"
      | "createNewCheckpoint"
      | "deregisterOperatorFromAVS"
      | "getCheckpoint"
      | "getOperatorRestakedStrategies"
      | "getRestakeableStrategies"
      | "isCheckpointConfirmed"
      | "latestCheckpointId"
      | "owner"
      | "registerOperatorToAVS"
      | "renounceOwnership"
      | "rewardsInitiator"
      | "setRewardsInitiator"
      | "stakeRegistry"
      | "transferOwnership"
      | "updateAVSMetadataURI"
      | "validatorConfirmations"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "CheckpointConfirmed"
      | "CollateralWarning"
      | "Initialized"
      | "NewCheckpointCreated"
      | "OwnershipTransferred"
      | "RewardsInitiatorUpdated"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "CRITICAL_COLLATERAL_RATIO",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "MIN_COLLATERAL_RATIO",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "avsDirectory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "checkpointHashes",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "checkpoints",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "collateralManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "confirmCheckpoint",
    values: [
      BigNumberish,
      IStablecoinAVSServiceManager.CollateralCheckpointStruct,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createAVSRewardsSubmission",
    values: [IRewardsCoordinator.RewardsSubmissionStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "createNewCheckpoint",
    values: [BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "deregisterOperatorFromAVS",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getCheckpoint",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getOperatorRestakedStrategies",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRestakeableStrategies",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isCheckpointConfirmed",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "latestCheckpointId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "registerOperatorToAVS",
    values: [AddressLike, ISignatureUtils.SignatureWithSaltAndExpiryStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsInitiator",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardsInitiator",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "stakeRegistry",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateAVSMetadataURI",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "validatorConfirmations",
    values: [BigNumberish, AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "CRITICAL_COLLATERAL_RATIO",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "MIN_COLLATERAL_RATIO",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "avsDirectory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkpointHashes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "checkpoints",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "collateralManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "confirmCheckpoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createAVSRewardsSubmission",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createNewCheckpoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deregisterOperatorFromAVS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCheckpoint",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getOperatorRestakedStrategies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRestakeableStrategies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isCheckpointConfirmed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "latestCheckpointId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "registerOperatorToAVS",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardsInitiator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardsInitiator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakeRegistry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateAVSMetadataURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validatorConfirmations",
    data: BytesLike
  ): Result;
}

export namespace CheckpointConfirmedEvent {
  export type InputTuple = [checkpointId: BigNumberish, validator: AddressLike];
  export type OutputTuple = [checkpointId: bigint, validator: string];
  export interface OutputObject {
    checkpointId: bigint;
    validator: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CollateralWarningEvent {
  export type InputTuple = [
    checkpointId: BigNumberish,
    collateralRatio: BigNumberish
  ];
  export type OutputTuple = [checkpointId: bigint, collateralRatio: bigint];
  export interface OutputObject {
    checkpointId: bigint;
    collateralRatio: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace NewCheckpointCreatedEvent {
  export type InputTuple = [
    checkpointId: BigNumberish,
    checkpoint: IStablecoinAVSServiceManager.CollateralCheckpointStruct
  ];
  export type OutputTuple = [
    checkpointId: bigint,
    checkpoint: IStablecoinAVSServiceManager.CollateralCheckpointStructOutput
  ];
  export interface OutputObject {
    checkpointId: bigint;
    checkpoint: IStablecoinAVSServiceManager.CollateralCheckpointStructOutput;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RewardsInitiatorUpdatedEvent {
  export type InputTuple = [
    prevRewardsInitiator: AddressLike,
    newRewardsInitiator: AddressLike
  ];
  export type OutputTuple = [
    prevRewardsInitiator: string,
    newRewardsInitiator: string
  ];
  export interface OutputObject {
    prevRewardsInitiator: string;
    newRewardsInitiator: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface StablecoinAVSServiceManager extends BaseContract {
  connect(runner?: ContractRunner | null): StablecoinAVSServiceManager;
  waitForDeployment(): Promise<this>;

  interface: StablecoinAVSServiceManagerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  CRITICAL_COLLATERAL_RATIO: TypedContractMethod<[], [bigint], "view">;

  MIN_COLLATERAL_RATIO: TypedContractMethod<[], [bigint], "view">;

  avsDirectory: TypedContractMethod<[], [string], "view">;

  checkpointHashes: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  checkpoints: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, bigint, bigint, string] & {
        timestamp: bigint;
        totalCollateralValue: bigint;
        totalStablecoinSupply: bigint;
        merkleRoot: string;
      }
    ],
    "view"
  >;

  collateralManager: TypedContractMethod<[], [string], "view">;

  confirmCheckpoint: TypedContractMethod<
    [
      checkpointId: BigNumberish,
      checkpoint: IStablecoinAVSServiceManager.CollateralCheckpointStruct,
      signature: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  createAVSRewardsSubmission: TypedContractMethod<
    [rewardsSubmissions: IRewardsCoordinator.RewardsSubmissionStruct[]],
    [void],
    "nonpayable"
  >;

  createNewCheckpoint: TypedContractMethod<
    [
      totalCollateralValue: BigNumberish,
      totalStablecoinSupply: BigNumberish,
      merkleRoot: BytesLike
    ],
    [IStablecoinAVSServiceManager.CollateralCheckpointStructOutput],
    "nonpayable"
  >;

  deregisterOperatorFromAVS: TypedContractMethod<
    [operator: AddressLike],
    [void],
    "nonpayable"
  >;

  getCheckpoint: TypedContractMethod<
    [checkpointId: BigNumberish],
    [IStablecoinAVSServiceManager.CollateralCheckpointStructOutput],
    "view"
  >;

  getOperatorRestakedStrategies: TypedContractMethod<
    [_operator: AddressLike],
    [string[]],
    "view"
  >;

  getRestakeableStrategies: TypedContractMethod<[], [string[]], "view">;

  isCheckpointConfirmed: TypedContractMethod<
    [checkpointId: BigNumberish, validator: AddressLike],
    [boolean],
    "view"
  >;

  latestCheckpointId: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  registerOperatorToAVS: TypedContractMethod<
    [
      operator: AddressLike,
      operatorSignature: ISignatureUtils.SignatureWithSaltAndExpiryStruct
    ],
    [void],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  rewardsInitiator: TypedContractMethod<[], [string], "view">;

  setRewardsInitiator: TypedContractMethod<
    [newRewardsInitiator: AddressLike],
    [void],
    "nonpayable"
  >;

  stakeRegistry: TypedContractMethod<[], [string], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateAVSMetadataURI: TypedContractMethod<
    [_metadataURI: string],
    [void],
    "nonpayable"
  >;

  validatorConfirmations: TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "CRITICAL_COLLATERAL_RATIO"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "MIN_COLLATERAL_RATIO"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "avsDirectory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "checkpointHashes"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "checkpoints"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, bigint, bigint, string] & {
        timestamp: bigint;
        totalCollateralValue: bigint;
        totalStablecoinSupply: bigint;
        merkleRoot: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "collateralManager"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "confirmCheckpoint"
  ): TypedContractMethod<
    [
      checkpointId: BigNumberish,
      checkpoint: IStablecoinAVSServiceManager.CollateralCheckpointStruct,
      signature: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createAVSRewardsSubmission"
  ): TypedContractMethod<
    [rewardsSubmissions: IRewardsCoordinator.RewardsSubmissionStruct[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "createNewCheckpoint"
  ): TypedContractMethod<
    [
      totalCollateralValue: BigNumberish,
      totalStablecoinSupply: BigNumberish,
      merkleRoot: BytesLike
    ],
    [IStablecoinAVSServiceManager.CollateralCheckpointStructOutput],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "deregisterOperatorFromAVS"
  ): TypedContractMethod<[operator: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "getCheckpoint"
  ): TypedContractMethod<
    [checkpointId: BigNumberish],
    [IStablecoinAVSServiceManager.CollateralCheckpointStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getOperatorRestakedStrategies"
  ): TypedContractMethod<[_operator: AddressLike], [string[]], "view">;
  getFunction(
    nameOrSignature: "getRestakeableStrategies"
  ): TypedContractMethod<[], [string[]], "view">;
  getFunction(
    nameOrSignature: "isCheckpointConfirmed"
  ): TypedContractMethod<
    [checkpointId: BigNumberish, validator: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "latestCheckpointId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "registerOperatorToAVS"
  ): TypedContractMethod<
    [
      operator: AddressLike,
      operatorSignature: ISignatureUtils.SignatureWithSaltAndExpiryStruct
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rewardsInitiator"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "setRewardsInitiator"
  ): TypedContractMethod<
    [newRewardsInitiator: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "stakeRegistry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateAVSMetadataURI"
  ): TypedContractMethod<[_metadataURI: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validatorConfirmations"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;

  getEvent(
    key: "CheckpointConfirmed"
  ): TypedContractEvent<
    CheckpointConfirmedEvent.InputTuple,
    CheckpointConfirmedEvent.OutputTuple,
    CheckpointConfirmedEvent.OutputObject
  >;
  getEvent(
    key: "CollateralWarning"
  ): TypedContractEvent<
    CollateralWarningEvent.InputTuple,
    CollateralWarningEvent.OutputTuple,
    CollateralWarningEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "NewCheckpointCreated"
  ): TypedContractEvent<
    NewCheckpointCreatedEvent.InputTuple,
    NewCheckpointCreatedEvent.OutputTuple,
    NewCheckpointCreatedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "RewardsInitiatorUpdated"
  ): TypedContractEvent<
    RewardsInitiatorUpdatedEvent.InputTuple,
    RewardsInitiatorUpdatedEvent.OutputTuple,
    RewardsInitiatorUpdatedEvent.OutputObject
  >;

  filters: {
    "CheckpointConfirmed(uint32,address)": TypedContractEvent<
      CheckpointConfirmedEvent.InputTuple,
      CheckpointConfirmedEvent.OutputTuple,
      CheckpointConfirmedEvent.OutputObject
    >;
    CheckpointConfirmed: TypedContractEvent<
      CheckpointConfirmedEvent.InputTuple,
      CheckpointConfirmedEvent.OutputTuple,
      CheckpointConfirmedEvent.OutputObject
    >;

    "CollateralWarning(uint32,uint256)": TypedContractEvent<
      CollateralWarningEvent.InputTuple,
      CollateralWarningEvent.OutputTuple,
      CollateralWarningEvent.OutputObject
    >;
    CollateralWarning: TypedContractEvent<
      CollateralWarningEvent.InputTuple,
      CollateralWarningEvent.OutputTuple,
      CollateralWarningEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;

    "NewCheckpointCreated(uint32,tuple)": TypedContractEvent<
      NewCheckpointCreatedEvent.InputTuple,
      NewCheckpointCreatedEvent.OutputTuple,
      NewCheckpointCreatedEvent.OutputObject
    >;
    NewCheckpointCreated: TypedContractEvent<
      NewCheckpointCreatedEvent.InputTuple,
      NewCheckpointCreatedEvent.OutputTuple,
      NewCheckpointCreatedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "RewardsInitiatorUpdated(address,address)": TypedContractEvent<
      RewardsInitiatorUpdatedEvent.InputTuple,
      RewardsInitiatorUpdatedEvent.OutputTuple,
      RewardsInitiatorUpdatedEvent.OutputObject
    >;
    RewardsInitiatorUpdated: TypedContractEvent<
      RewardsInitiatorUpdatedEvent.InputTuple,
      RewardsInitiatorUpdatedEvent.OutputTuple,
      RewardsInitiatorUpdatedEvent.OutputObject
    >;
  };
}
