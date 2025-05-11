// Contract ABI and address
export const DATING_APP_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_age", type: "uint256" },
      { internalType: "string", name: "_bio", type: "string" },
      { internalType: "string", name: "_interests", type: "string" },
      { internalType: "string", name: "_imageUrl", type: "string" },
    ],
    name: "createProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_profileId", type: "uint256" }],
    name: "likeProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_profileId", type: "uint256" }],
    name: "getProfile",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "age", type: "uint256" },
      { internalType: "string", name: "bio", type: "string" },
      { internalType: "string", name: "interests", type: "string" },
      { internalType: "string", name: "imageUrl", type: "string" },
      { internalType: "uint256", name: "likeCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "profileCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

export const DATING_APP_ADDRESS = "0x1b14db9335e9f6ef02877e685472aaa459b544db"
export const NETWORK = "base-sepolia"
