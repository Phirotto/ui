export const TESTNET_CHAIN_IDS = [11155111];

export const CHAIN_IDS = [1];

export const SUPPORTED_CHAIN_IDS = [...CHAIN_IDS, ...TESTNET_CHAIN_IDS];

export const DEFAULT_CHAIN_ID_TO_SWITCH = CHAIN_IDS[0];

export const SUPPORTED_CURRENCIES = new Map([
  [
    1,
    String(import.meta.env.VITE_MAINNET_CURRENCIES)
      ?.split(",")
      ?.map((a) => a.toLowerCase()) || [],
  ],
  [
    11155111,
    String(import.meta.env.VITE_SEPOLIA_CURRENCIES)
      ?.split(",")
      ?.map((a) => a.toLowerCase()) || [],
  ],
]);

// export const VAULT_ABI = [
//   {
//     inputs: [],
//     name: "requestedAmount",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "fillPercent",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
// ];

export const VAULT_ABI = [
  "function requestedAmount() view returns(uint256)",
  "function fillPercent() view returns(uint256)",
];
