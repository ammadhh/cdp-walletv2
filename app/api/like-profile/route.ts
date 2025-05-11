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
    const { profileId } = await request.json()

    if (!profileId) {
      return NextResponse.json({ success: false, error: "Missing profile ID" }, { status: 400 })
    }

    console.log(`Starting like operation for profile ID: ${profileId}`)

    // Initialize CDP client with environment variables
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    })

    // Create a user account for liking
    console.log("Creating user account for liking...")
    const userAccount = await cdp.evm.createAccount()
    console.log(`Created user account: ${userAccount.address}`)

    // Create a smart account
    console.log("Creating smart account...")
    const smartAccount = await cdp.evm.createSmartAccount({
      owner: userAccount,
    })
    console.log(`Created smart account: ${smartAccount.address}`)

    // Fund the smart account with testnet ETH
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

    // Encode like operation for the profile
    const likeProfileData = encodeFunctionData({
      abi: DATING_APP_ABI,
      functionName: "likeProfile",
      args: [BigInt(profileId)],
    })

    const likeCalls = [
      {
        to: DATING_APP_ADDRESS,
        data: likeProfileData,
        value: parseEther("0"),
      },
    ]

    // Send like operation
    console.log(`Sending like operation for profile ID: ${profileId}`)
    const likeResult = await smartAccount.sendUserOperation({
      network: NETWORK,
      calls: likeCalls,
    })

    console.log("Waiting for like operation to confirm...")
    const likeOpResult = await smartAccount.waitForUserOperation({
      userOpHash: likeResult.userOpHash,
    })

    if (likeOpResult.status === "complete") {
      console.log(`Like operation complete! Transaction: ${likeOpResult.transactionHash}`)

      // Store transaction info
      const transactionInfo = {
        hash: likeOpResult.transactionHash,
        type: "like",
        profileId: profileId,
        timestamp: Date.now(),
      }

      return NextResponse.json({
        success: true,
        transactionHash: likeOpResult.transactionHash,
        transactionInfo,
      })
    } else {
      console.log("Like operation failed.")
      return NextResponse.json({ success: false, error: "Like operation failed" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error liking profile:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to like profile",
      },
      { status: 500 },
    )
  }
}
