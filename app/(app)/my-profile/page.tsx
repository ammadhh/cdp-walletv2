"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getAllProfiles } from "@/lib/cdp-client"
import type { Profile, TransactionInfo } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Loader2,
  PlusCircle,
  Sparkles,
  Clock,
  LinkIcon,
  Copy,
  Check,
  ExternalLink,
  ReceiptText,
  CheckCircle2,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function MyProfilePage() {
  const [myProfile, setMyProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedTx, setCopiedTx] = useState(false)
  const [profilesLiked, setProfilesLiked] = useState<number>(0)
  const [joinedDate, setJoinedDate] = useState<Date | null>(null)
  const [transactions, setTransactions] = useState<TransactionInfo[]>([])
  const [profileTxHash, setProfileTxHash] = useState<string | null>(null)

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        // Get stored account info
        const storedAccounts = localStorage.getItem("blockdate_accounts")
        if (storedAccounts) {
          setAccountInfo(JSON.parse(storedAccounts))

          // Set a random "joined date" for demo purposes
          // In a real app, you'd store this when the account is created
          const daysAgo = Math.floor(Math.random() * 30) + 1
          setJoinedDate(new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000))
        }

        // Get stored transactions
        const storedTransactions = localStorage.getItem("blockdate_transactions")
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions))
        }

        // Get liked profiles
        const storedLikes = localStorage.getItem("blockdate_liked_profiles")
        if (storedLikes) {
          const likes = JSON.parse(storedLikes)
          setProfilesLiked(likes.length)
        }

        const allProfiles = await getAllProfiles()

        // For demo purposes, we'll just take the most recent profile
        // In a real app, you'd match the profile to the user's address
        if (allProfiles.length > 0) {
          const profile = allProfiles[allProfiles.length - 1]
          setMyProfile(profile)

          // Get profile transaction hash
          const profileTxs = JSON.parse(localStorage.getItem("blockdate_profile_txs") || "{}")
          if (profileTxs[profile.id]) {
            setProfileTxHash(profileTxs[profile.id])
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
        setError("Failed to load your profile. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMyProfile()
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-4" />
        <p className="text-lg">Loading your profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-pink-500 text-white rounded-md">
          Try Again
        </button>
      </div>
    )
  }

  if (!myProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg mb-4">You haven't created a profile yet.</p>
        <Link href="/create-profile">
          <Button className="bg-pink-500 hover:bg-pink-600">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Profile
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8 pb-20">
      <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">Your Profile</h1>

      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative w-full h-80">
            <Image
              src={myProfile.imageUrl || "/diverse-group.png"}
              alt={myProfile.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-pink-500 text-white px-3 py-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                On-Chain Profile
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              {myProfile.name}, {myProfile.age}
            </h2>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
              {myProfile.likeCount} likes
            </Badge>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-gray-700">{myProfile.bio}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {myProfile.interests.split(",").map((interest, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {interest.trim()}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 p-3 bg-pink-50 rounded-md">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              <span className="text-sm font-medium">You've liked {profilesLiked} profiles</span>
            </div>

            {joinedDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">Joined {formatDistanceToNow(joinedDate)} ago</span>
              </div>
            )}
          </div>

          {profileTxHash && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Profile Creation Transaction</h3>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Transaction Hash</p>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-xs font-mono truncate max-w-[200px]">{profileTxHash}</span>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(profileTxHash, "tx")}
                    >
                      {copiedTx ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    </Button>
                    <a
                      href={`https://sepolia.basescan.org/tx/${profileTxHash}`}
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

              <div className="mt-3 text-xs text-green-600 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Transaction confirmed on Base Sepolia
              </div>
            </div>
          )}

          {accountInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-semibold mb-3">Blockchain Details</h3>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Profile ID</p>
                  <div className="flex items-center justify-between bg-white p-2 rounded border">
                    <span className="text-sm font-mono">{myProfile.id}</span>
                    <Badge variant="outline" className="text-pink-500 border-pink-200">
                      On-Chain ID
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Smart Account</p>
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

                <div className="flex items-center gap-2 text-xs text-blue-500">
                  <LinkIcon className="h-3 w-3" />
                  <a
                    href={`https://sepolia.basescan.org/address/${accountInfo.smartAccount.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    View on BaseScan
                  </a>
                </div>
              </div>
            </div>
          )}

          {transactions.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Transaction History</h3>
                <Badge variant="outline" className="text-gray-500">
                  {transactions.length} transactions
                </Badge>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {transactions.map((tx, index) => (
                  <div key={index} className="bg-white p-2 rounded border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <ReceiptText className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">
                          {tx.type === "create" ? "Created Profile" : "Liked Profile"}
                        </span>
                      </div>
                      <span className="text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 truncate max-w-[200px]">
                        {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                      </span>
                      <a
                        href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t p-4">
          <Link href="/browse" className="w-full">
            <Button className="w-full bg-pink-500 hover:bg-pink-600">Browse Other Profiles</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
