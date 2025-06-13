// Dynamic SDK type extensions
export interface DynamicUser {
  userId: string;
  email?: string;
  alias?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  phone?: string;
  twitterAccountName?: string;
  username?: string;
  wallets?: Array<{
    address: string;
    chain: string;
    format: string;
    id: string;
    name?: string;
    nameService?: any;
    public_key?: string;
  }>;
}

export interface DynamicWallet {
  address: string;
  chain: string;
  connector: any;
  id: string;
}