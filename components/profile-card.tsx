"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  LinkIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/lib/types"

interface ProfileCardProps {
  profile: Profile
  onLike: (profileId: number) => Promise<boolean>
  onNext: () => void
  onPrevious: () => void
  isLiking: boolean
  isLiked?: boolean
}

export function ProfileCard({ profile, onLike, onNext, onPrevious, isLiking, isLiked = false }: ProfileCardProps) {
  const [hasLiked, setHasLiked] = useState(isLiked)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)
  const [copiedTx, setCopiedTx] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [accountInfo, setAccountInfo] = useState<any>(null)

  useEffect(() => {
    // Get stored account info - only use real data from localStorage
    const storedAccounts = localStorage.getItem("blockdate_accounts")
    if (storedAccounts) {
      setAccountInfo(JSON.parse(storedAccounts))
    }
  }, [])

  const handleLike = async () => {
    if (!hasLiked) {
      const success = await onLike(profile.id)
      if (success) {
        setHasLiked(true)
        setShowLikeAnimation(true)
        setTimeout(() => setShowLikeAnimation(false), 1500)
      }
    }
  }

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
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-lg relative">
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30">
          <Heart className="h-32 w-32 text-pink-500 fill-pink-500 animate-pulse" />
        </div>
      )}

      <div className="relative w-full h-96">
        <Image src={profile.imageUrl || "/diverse-group.png"} alt={profile.name} fill className="object-cover" />
        <div className="absolute top-4 right-4">
          <Badge className="bg-pink-500/80 text-white px-3 py-1 flex items-center gap-1 backdrop-blur-sm">
            <Sparkles className="h-3 w-3" />
            On-Chain
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">
            {profile.name}, {profile.age}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
              Profile ID: {profile.id}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">About</h3>
          <Badge variant="outline" className="flex items-center gap-1">
            <Heart className="h-3 w-3 fill-pink-500 text-pink-500" />
            {profile.likeCount + (hasLiked && !isLiked ? 1 : 0)}
          </Badge>
        </div>

        <p className="text-gray-700 mb-4">{profile.bio}</p>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.split(",").map((interest, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {interest.trim()}
              </Badge>
            ))}
          </div>
        </div>

        {/* Transaction information section - only show if real transaction hash exists */}
        {profile.transactionHash && (
          <div className="mt-4 p-3 bg-green-50 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Profile Creation Transaction</h3>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">Transaction Hash</p>
              <div className="flex items-center justify-between bg-white p-2 rounded border">
                <span className="text-xs font-mono truncate max-w-[200px]">{profile.transactionHash}</span>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(profile.transactionHash || "", "tx")}
                  >
                    {copiedTx ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <a
                    href={`https://sepolia.basescan.org/tx/${profile.transactionHash}`}
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

        {/* Blockchain Details section - only show if real account info exists */}
        {accountInfo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold mb-3">Blockchain Details</h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Profile ID</p>
                <div className="flex items-center justify-between bg-white p-2 rounded border">
                  <span className="text-sm font-mono">{profile.id}</span>
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
      </CardContent>

      <CardFooter className="p-4 border-t flex justify-between">
        <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={onPrevious}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500"
          onClick={onNext}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Skip</span>
        </Button>

        <Button
          variant={hasLiked ? "secondary" : "default"}
          size="icon"
          className={`rounded-full h-12 w-12 ${hasLiked ? "bg-pink-100" : "bg-pink-500"}`}
          onClick={handleLike}
          disabled={isLiking || hasLiked}
        >
          <Heart className={`h-6 w-6 ${hasLiked ? "fill-pink-500 text-pink-500" : "text-white"}`} />
          <span className="sr-only">Like</span>
        </Button>

        <Button variant="outline" size="icon" className="rounded-full h-12 w-12" onClick={onNext}>
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
