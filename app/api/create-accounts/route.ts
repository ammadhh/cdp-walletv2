import { NextResponse } from "next/server"
import { CdpClient } from "@coinbase/cdp-sdk"
import { createPublicClient, http } from "viem"
import { baseSepolia } from "viem/chains"
import { NETWORK } from "@/lib/contract"

// Initialize public client for reading from the blockchain
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

export async function POST() {
  try {
    // Initialize CDP client with environment variables
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID,
      apiKeySecret: process.env.CDP_API_KEY_SECRET,
      walletSecret: process.env.CDP_WALLET_SECRET,
    })

    // Create user account
    const userAccount = await cdp.evm.createAccount()

    // Create smart account
    const smartAccount = await cdp.evm.createSmartAccount({
      owner: userAccount,
    })

    // Fund the smart account with testnet ETH
    const { transactionHash: faucetTxHash } = await smartAccount.requestFaucet({
      network: NETWORK,
      token: "eth",
    })

    // Wait for faucet transaction to confirm
    await publicClient.waitForTransactionReceipt({
      hash: faucetTxHash,
    })

    return NextResponse.json({
      success: true,
      userAccount: {
        address: userAccount.address,
      },
      smartAccount: {
        address: smartAccount.address,
      },
    })
  } catch (error: any) {
    console.error("Error creating accounts:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create accounts",
      },
      { status: 500 },
    )
  }
}
