import { Avalanche, BinTools, BN } from 'avalanche';
import { PlatformVMAPI } from 'avalanche/dist/apis/platformvm';

// Constants
export const AVALANCHE_MAINNET_ID = 1;
export const STAKELY_VALIDATOR_ID = 'NodeID-6na5rkzi37wtt5piHV62y11XYfN2kTsTH';

// Avalanche connection
export const getAvalancheInstance = (): Avalanche => {
  return new Avalanche(
    'api.avax.network',
    443,
    'https',
    AVALANCHE_MAINNET_ID,
    'X',
    'C',
    'P'
  );
};

// P-Chain API
export const getPlatformVM = (): PlatformVMAPI => {
  const avalanche = getAvalancheInstance();
  return avalanche.PChain();
};

// Utility functions
export const avaxToNAvax = (avax: string): BN => {
  return new BN(parseFloat(avax) * Math.pow(10, 9));
};

export const nAvaxToAvax = (nAvax: BN | string): string => {
  const bn = typeof nAvax === 'string' ? new BN(nAvax) : nAvax;
  return (bn.toNumber() / Math.pow(10, 9)).toFixed(4);
};

// Stakely validator configuration
export const STAKELY_CONFIG = {
  nodeID: STAKELY_VALIDATOR_ID,
  name: 'Stakely',
  minStake: 25, // AVAX
  minDuration: 14, // days
  maxDuration: 365, // days
  commission: 5, // 5% to Stakely
  safestakingFee: 0, // 0% for launch
  apr: 6.72,
  apy: 6.94,
  totalStaked: 45004.14 // From screenshot
};

// Duration options
export const DURATION_OPTIONS = [
  { label: '2 weeks', value: 14, recommended: false },
  { label: '1 month', value: 30, recommended: false },
  { label: '3 months', value: 90, recommended: true },
  { label: '6 months', value: 180, recommended: false },
  { label: '1 year', value: 365, recommended: false }
];

// Calculate staking rewards
export const calculateStakingRewards = (amount: number, durationDays: number): {
  totalRewards: number;
  dailyRewards: number;
  effectiveAPR: number;
} => {
  const yearlyRewards = amount * (STAKELY_CONFIG.apr / 100);
  const dailyRewards = yearlyRewards / 365;
  const totalRewards = dailyRewards * durationDays;
  const effectiveAPR = (totalRewards / amount) * (365 / durationDays) * 100;

  return {
    totalRewards,
    dailyRewards,
    effectiveAPR
  };
};

// Validate staking parameters
export const validateStakingParams = (amount: string, duration: number): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const numAmount = parseFloat(amount);

  if (!amount || isNaN(numAmount)) {
    errors.push('Please enter a valid amount');
  } else if (numAmount < STAKELY_CONFIG.minStake) {
    errors.push(`Minimum stake is ${STAKELY_CONFIG.minStake} AVAX`);
  }

  if (duration < STAKELY_CONFIG.minDuration) {
    errors.push(`Minimum duration is ${STAKELY_CONFIG.minDuration} days`);
  } else if (duration > STAKELY_CONFIG.maxDuration) {
    errors.push(`Maximum duration is ${STAKELY_CONFIG.maxDuration} days`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};