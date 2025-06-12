import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://eth.llamarpc.com",
  displayName: "Ethereum Mainnet",
  blockExplorerUrl: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const YOUR_CLIENT_ID = "BMVvOMNnBjwBnsqM9C2iNfFgSuO4dyVajOvGYrw-e1iaa3lVKIv0vGOCCADb7nKUuz2e1V5Bb4psRUHvLc0cniA";

console.log("🔍 Web3Auth Environment Check:");
console.log("CLIENT_ID provided:", clientId ? "✅ Yes" : "❌ No");
console.log("Using:", clientId ? "Custom Client ID" : "Provided Client ID");

let web3auth: Web3Auth;

try {
  web3auth = new Web3Auth({
    clientId: clientId || YOUR_CLIENT_ID,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    chainConfig,
    uiConfig: {
      appName: "SafeStaking",
      theme: {
        primary: "#3B82F6",
      },
      mode: "light",
      logoLight: "https://web3auth.io/images/web3authlog.png",
      logoDark: "https://web3auth.io/images/web3authlogodark.png",
      defaultLanguage: "en",
      loginGridCol: 3,
      primaryButton: "externalLogin", // This shows external wallets first
    },
    enableLogging: true,
  });

  // Configure OpenLogin Adapter with external wallet enabled settings
  const openloginAdapter = new OpenloginAdapter({
    loginSettings: {
      mfaLevel: "default",
    },
    adapterSettings: {
      uxMode: "popup",
      whiteLabel: {
        appName: "SafeStaking",
        logoLight: "https://web3auth.io/images/web3authlog.png",
        logoDark: "https://web3auth.io/images/web3authlogodark.png",
        defaultLanguage: "en",
        mode: "light",
      },
    },
  });

  web3auth.configureAdapter(openloginAdapter);
  
  console.log("✅ Web3Auth instance created successfully");
} catch (error) {
  console.error("❌ Error creating Web3Auth instance:", error);
  throw error;
}

export { web3auth };
export type { IProvider } from "@web3auth/base";