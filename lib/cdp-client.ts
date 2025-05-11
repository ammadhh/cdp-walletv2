import { CdpClient } from "@coinbase/cdp-sdk"
import { createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"
import { DATING_APP_ABI, DATING_APP_ADDRESS } from "./contract"
import type { Profile } from "./types"

// Initialize public client for reading from the blockchain
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

// Get a singleton CDP client instance
let cdpClientInstance: CdpClient | null = null

export const getCdpClient = () => {
  if (!cdpClientInstance) {
    // Make sure to pass all required parameters
    cdpClientInstance = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    })
  }
  return cdpClientInstance
}

// Get profile count
export const getProfileCount = async (): Promise<number> => {
  try {
    const profileCountResult = await publicClient.readContract({
      address: DATING_APP_ADDRESS,
      abi: DATING_APP_ABI,
      functionName: "profileCount",
    })

    return Number(profileCountResult)
  } catch (error) {
    console.error("Error getting profile count:", error)
    throw error
  }
}

// Get profile by ID
export const getProfile = async (profileId: number): Promise<Profile> => {
  try {
    const profileData = await publicClient.readContract({
      address: DATING_APP_ADDRESS,
      abi: DATING_APP_ABI,
      functionName: "getProfile",
      args: [BigInt(profileId)],
    })

    // Get profile transaction hash from localStorage if available
    let transactionHash
    if (typeof window !== "undefined") {
      const profileTxs = JSON.parse(localStorage.getItem("blockdate_profile_txs") || "{}")
      transactionHash = profileTxs[profileId]
    }

    return {
      id: profileId,
      name: profileData[0],
      age: Number(profileData[1]),
      bio: profileData[2],
      interests: profileData[3],
      imageUrl: profileData[4],
      likeCount: Number(profileData[5]),
      transactionHash,
    }
  } catch (error) {
    console.error(`Error getting profile ${profileId}:`, error)
    throw error
  }
}

// Get all profiles
export const getAllProfiles = async (): Promise<Profile[]> => {
  try {
    const count = await getProfileCount()
    const profiles: Profile[] = []

    for (let i = 1; i <= count; i++) {
      try {
        const profile = await getProfile(i)
        profiles.push(profile)
      } catch (error) {
        console.error(`Error fetching profile ${i}:`, error)
        // Continue with other profiles even if one fails
      }
    }

    return profiles
  } catch (error) {
    console.error("Error getting all profiles:", error)
    throw error
  }
}
