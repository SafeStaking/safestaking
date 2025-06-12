import { ethers } from "ethers";

export const LIDO_CONTRACT_ADDRESS = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84";

export const LIDO_ABI = [
  // Basic ERC20 functions
  "function balanceOf(address account) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  
  // Lido specific functions
  "function submit(address _referral) external payable returns (uint256)",
  "function getPooledEthByShares(uint256 _sharesAmount) external view returns (uint256)",
  "function getSharesByPooledEth(uint256 _pooledEthAmount) external view returns (uint256)",
  "function getTotalShares() external view returns (uint256)",
  "function getTotalPooledEther() external view returns (uint256)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Submitted(address indexed sender, uint256 amount, address referral)",
];

export const getContract = (
  address: string,
  abi: string[],
  signerOrProvider: ethers.providers.Provider | ethers.Signer
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};