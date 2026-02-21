export type IBlockProgress = {
  label: string;
  completed: number;
};

export type IBlock = {
  blockHeight: number;
  confirmation: number;
  blockHash: string;
  preBlockHash: string;
  merkleRoot: string;
  time: string;
  transactions: IBlockProgress;
  blockSize: IBlockProgress;
  blockReward: IBlockProgress;
  leftLinkTime: number | null; // time in s
  originalBlockHash: string;
  blockFee: number;
  blockSubsidy: number;
};

export type IBlockChain = Array<IBlock>;

export interface IAddress {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
  hasMore: boolean;
  txs: Tx[];
}

export interface Tx {
  block_hash: string;
  block_height: number;
  block_index: number;
  hash: string;
  addresses: string[];
  total: number;
  fees: number;
  size: number;
  vsize: number;
  preference: string;
  relayed_by?: string;
  confirmed: string;
  received: string;
  ver: number;
  double_spend: boolean;
  vin_sz: number;
  vout_sz: number;
  confirmations: number;
  confidence: number;
  inputs: Input[];
  outputs: Output[];
  lock_time?: number;
  opt_in_rbf?: boolean;
  next_inputs?: string;
}

export interface Input {
  prev_hash: string;
  output_index: number;
  output_value: number;
  sequence: number;
  addresses: string[];
  script_type: string;
  age: number;
  witness?: string[];
  script?: string;
}

export interface Output {
  value: number;
  script: string;
  addresses: string[];
  script_type: string;
  spent_by?: string;
}

export interface IAddressTableRow {
  id: string;
  txhash: string;
  confirmations: number;
  inaddr: number;
  outaddr: number;
  txtime: string;
}
export type ITransaction = {
  id: number;
  txhash: string;
  inaddr: number;
  outaddr: number;
  txsize: number;
  txfee: number;
};

export type ITransactionList = Array<ITransaction>;
