"use client"

import { useState, useEffect } from "react"
import { ProfileCard } from "@/components/profile-card"
import { FeatureShowcase } from "@/components/feature-showcase"
import { getAllProfiles } from "@/lib/cdp-client"
import type { Profile } from "@/lib/types"
import { Loader2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BrowsePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [likedProfiles, setLikedProfiles] = useState<number[]>([])

  useEffect(() => {
    // Load liked profiles from localStorage
    const storedLikes = localStorage.getItem("blockdate_liked_profiles")
    if (storedLikes) {
      setLikedProfiles(JSON.parse(storedLikes))
    }

    const fetchProfiles = async () => {
      try {
        const allProfiles = await getAllProfiles()

        // Get profile transaction hashes from localStorage - only use real data
        const profileTxs = JSON.parse(localStorage.getItem("blockdate_profile_txs") || "{}")

        // Add transaction hashes to profiles if available
        const profilesWithTxs = allProfiles.map((profile) => {
          if (profileTxs[profile.id]) {
            return { ...profile, transactionHash: profileTxs[profile.id] }
          }
          return profile
        })

        setProfiles(profilesWithTxs)
      } catch (err) {
        console.error("Failed to fetch profiles:", err)
        setError("Failed to load profiles. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfiles()
  }, [])

  const handleLike = async (profileId: number) => {
    setIsLiking(true)
    setStatusMessage("Processing like on the blockchain...")
    setError(null)

    try {
      const response = await fetch("/api/like-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: profileId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to like profile")
      }

      if (data.success) {
        // Update the profile's like count in the local state
        setProfiles(
          profiles.map((profile) =>
            profile.id === profileId ? { ...profile, likeCount: profile.likeCount + 1 } : profile,
          ),
        )

        // Add to liked profiles
        const updatedLikes = [...likedProfiles, profileId]
        setLikedProfiles(updatedLikes)
        localStorage.setItem("blockdate_liked_profiles", JSON.stringify(updatedLikes))

        // Store transaction info
        if (data.transactionInfo) {
          const transactions = JSON.parse(localStorage.getItem("blockdate_transactions") || "[]")
          transactions.push(data.transactionInfo)
          localStorage.setItem("blockdate_transactions", JSON.stringify(transactions))
        }

        // Store like transaction hash
        if (data.transactionHash) {
          const likeTxs = JSON.parse(localStorage.getItem("blockdate_like_txs") || "{}")
          if (!likeTxs[profileId]) {
            likeTxs[profileId] = []
          }
          likeTxs[profileId].push(data.transactionHash)
          localStorage.setItem("blockdate_like_txs", JSON.stringify(likeTxs))
        }

        setStatusMessage(null)
        return true
      } else {
        throw new Error(data.error || "Failed to like profile")
      }
    } catch (err: any) {
      console.error("Failed to like profile:", err)
      setError(`Failed to like profile: ${err.message}`)
      return false
    } finally {
      setIsLiking(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop back to the first profile
      setCurrentIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      // Loop to the last profile
      setCurrentIndex(profiles.length - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-4" />
        <p className="text-lg">Finding matches for you...</p>
        <p className="text-sm text-gray-500 mt-2">Loading profiles from the blockchain</p>
      </div>
    )
  }

  if (error && !statusMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-pink-500 text-white rounded-md">
          Try Again
        </button>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <Search className="h-12 w-12 text-pink-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No profiles found</h2>
        <p className="text-gray-600 mb-6">Be the first to create a profile on BlockDate!</p>
        <Link href="/create-profile">
          <Button className="bg-pink-500 hover:bg-pink-600">Create Your Profile</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-pink-600">BlockDate</h1>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-500">{profiles.length} profiles online</span>
        </div>
      </div>

      {statusMessage && <div className="text-sm text-blue-500 p-2 bg-blue-50 rounded mb-4">{statusMessage}</div>}

      {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded mb-4">{error}</div>}

      <ProfileCard
        profile={profiles[currentIndex]}
        onLike={handleLike}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLiking={isLiking}
        isLiked={likedProfiles.includes(profiles[currentIndex].id)}
      />

      <div className="flex justify-between items-center mt-4 mb-8">
        <p className="text-sm text-gray-500">
          Profile {currentIndex + 1} of {profiles.length}
        </p>

        {likedProfiles.length > 0 && (
          <p className="text-sm text-pink-500">
            You've liked {likedProfiles.length} {likedProfiles.length === 1 ? "profile" : "profiles"}
          </p>
        )}
      </div>

      {/* Feature Showcase Section */}
      <FeatureShowcase />
    </div>
  )
}
