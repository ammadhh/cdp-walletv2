import { NextResponse } from "next/server"
import { CdpClient } from "@coinbase/cdp-sdk"
import { createPublicClient, http, encodeFunctionData, parseEther } from "viem"
import { baseSepolia } from "viem/chains"
import { DATING_APP_ABI, DATING_APP_ADDRESS, NETWORK } from "@/lib/contract"

// Initialize public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

export async function POST(request: Request) {
  try {
    const { name, age, bio, interests, imageUrl } = await request.json()

    if (!name || !age || !bio || !interests) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    console.log("Starting profile creation process...")

    // Initialize CDP client with environment variables
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    })

    // Step 1: Create an EVM account (this would be a user account)
    console.log("Creating user account...")
    const userAccount = await cdp.evm.createAccount()
    console.log(`Created user account: ${userAccount.address}`)

    // Step 2: Create a smart account owned by the user account
    console.log("Creating smart account...")
    const smartAccount = await cdp.evm.createSmartAccount({
      owner: userAccount,
    })
    console.log(`Created smart account: ${smartAccount.address}`)

    // Step 3: Fund the smart account with testnet ETH
    console.log("Requesting ETH from faucet...")
    const { transactionHash: faucetTxHash } = await smartAccount.requestFaucet({
      network: NETWORK,
      token: "eth",
    })

    console.log("Waiting for faucet transaction to confirm...")
    await publicClient.waitForTransactionReceipt({
      hash: faucetTxHash,
    })
    console.log(`Faucet transaction confirmed: ${faucetTxHash}`)

    // Step 4: Create a user profile with an image URL
    console.log("Creating user profile with image URL...")

    // Encode the createProfile function call with imageUrl
    const createProfileData = encodeFunctionData({
      abi: DATING_APP_ABI,
      functionName: "createProfile",
      args: [name, BigInt(age), bio, interests, imageUrl || "/diverse-group.png"],
    })

    // Send user operation to create profile
    console.log("Sending user operation to create profile...")
    const createProfileResult = await smartAccount.sendUserOperation({
      network: NETWORK,
      calls: [
        {
          to: DATING_APP_ADDRESS,
          data: createProfileData,
          value: parseEther("0"),
        },
      ],
    })

    console.log("Waiting for profile creation to confirm...")
    const createProfileOpResult = await smartAccount.waitForUserOperation({
      userOpHash: createProfileResult.userOpHash,
    })

    if (createProfileOpResult.status === "complete") {
      console.log(`Profile created! Transaction: ${createProfileOpResult.transactionHash}`)

      // Step 5: Check total profile count to see our new profile
      const profileCountResult = await publicClient.readContract({
        address: DATING_APP_ADDRESS,
        abi: DATING_APP_ABI,
        functionName: "profileCount",
      })

      const profileCount = Number(profileCountResult)
      console.log(`Total profiles: ${profileCount}`)
      console.log(`New profile ID: ${profileCount}`)

      // Store transaction info in localStorage
      const transactionInfo = {
        hash: createProfileOpResult.transactionHash,
        type: "create",
        profileId: profileCount,
        timestamp: Date.now(),
      }

      // Return success response with account info, profile ID, and transaction hash
      return NextResponse.json({
        success: true,
        transactionHash: createProfileOpResult.transactionHash,
        profileId: profileCount,
        userAccount: {
          address: userAccount.address,
        },
        smartAccount: {
          address: smartAccount.address,
        },
        transactionInfo,
      })
    } else {
      console.log("Profile creation failed.")
      return NextResponse.json({ success: false, error: "Profile creation failed" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error creating profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create profile",
      },
      { status: 500 },
    )
  }
}
