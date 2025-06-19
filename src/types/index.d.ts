// types/index.d.ts

declare global {
  interface Window {
    ethereum?: any;
  }
}

declare module '@dynamic-labs/sdk-react-core' {
  export function useDynamicContext(): any;
  export const DynamicContextProvider: React.FC<{
    children: React.ReactNode;
    settings: any;
  }>;
}

declare module '@dynamic-labs/ethereum' {
  export const EthereumWalletConnectors: any;
}

export {};