// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { MoonDrop } from '../target/types/moon_drop';
import { IDL as MoonDropIDL } from '../target/types/moon_drop';

// Re-export the generated IDL and type
export { MoonDrop, MoonDropIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const MOON_DROP_PROGRAM_ID = new PublicKey(
  'EZCKQSLEGYUWNAnFtHqneiZWJ7FvSgYnjpAwVPrkJ3uE'
);

// This is a helper function to get the program ID for the MoonDrop program depending on the cluster.
export function getMoonDropProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return MOON_DROP_PROGRAM_ID;
  }
}
