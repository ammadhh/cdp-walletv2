"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowRight, Copy, Check, ExternalLink } from "lucide-react"

export default function ProfileCreatedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const txHash = searchParams.get("tx")
  const profileId = searchParams.get("id")

  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedTx, setCopiedTx] = useState(false)

  useEffect(() => {
    // Get stored account info
    const storedAccounts = localStorage.getItem("blockdate_accounts")
    if (storedAccounts) {
      setAccountInfo(JSON.parse(storedAccounts))
    }
  }, [])

  const copyToClipboard = (text: string, type: "address" | "tx") => {
    navigator.clipboard.writeText(text)
    if (type === "address") {
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } else {
      setCopiedTx(true)
      setTimeout(() => setCopiedTx(false), 2000)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      <Card className="border-green-100">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl text-green-700">Profile Created!</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your profile has been successfully created on the blockchain. You can now browse and like other profiles!
          </p>

          {txHash && (
            <div className="mt-4 p-4 bg-green-50 rounded-md text-left">
              <h3 className="text-sm font-semibold mb-2">Transaction Details</h3>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Transaction Hash</p>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-xs font-mono truncate max-w-[200px]">{txHash}</span>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(txHash, "tx")}
                    >
                      {copiedTx ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <a
                      href={`https://sepolia.basescan.org/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1"
                    >
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {profileId && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Profile ID</p>
                  <div className="bg-white p-2 rounded border">
                    <span className="text-sm font-medium">{profileId}</span>
                  </div>
                </div>
              )}

              <div className="mt-3 text-xs text-green-600 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Transaction confirmed on Base Sepolia
              </div>
            </div>
          )}

          {accountInfo && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md text-left">
              <h3 className="text-sm font-semibold mb-3">Your Blockchain Account</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Smart Account Address</p>
                  <div className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm font-mono truncate max-w-[200px]">{accountInfo.smartAccount.address}</span>
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(accountInfo.smartAccount.address, "address")}
                      >
                        {copiedAddress ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      </Button>
                      <a
                        href={`https://sepolia.basescan.org/address/${accountInfo.smartAccount.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1"
                      >
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Network</p>
                  <div className="flex items-center gap-2 bg-white p-2 rounded border">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Base Sepolia Testnet</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={() => router.push("/browse")}>
            Browse Profiles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full border-pink-200 text-pink-600"
            onClick={() => router.push("/my-profile")}
          >
            View My Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
