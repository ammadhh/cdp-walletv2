"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function CreateProfilePage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    bio: "",
    interests: "",
    imageUrl: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.age || !formData.bio || !formData.interests) {
      setError("Please fill in all required fields")
      return
    }

    const age = Number.parseInt(formData.age)
    if (isNaN(age) || age < 18 || age > 120) {
      setError("Please enter a valid age between 18 and 120")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setStatusMessage("Initializing blockchain account...")

    try {
      setStatusMessage("Creating your profile on the blockchain (this may take a minute)...")

      const response = await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          age: age,
          bio: formData.bio,
          interests: formData.interests,
          imageUrl: formData.imageUrl || "/diverse-group.png",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create profile")
      }

      if (data.success) {
        // Store the account info in localStorage
        if (data.userAccount && data.smartAccount) {
          localStorage.setItem(
            "blockdate_accounts",
            JSON.stringify({
              userAccount: data.userAccount,
              smartAccount: data.smartAccount,
            }),
          )
        }

        // Store transaction info
        if (data.transactionInfo) {
          const transactions = JSON.parse(localStorage.getItem("blockdate_transactions") || "[]")
          transactions.push(data.transactionInfo)
          localStorage.setItem("blockdate_transactions", JSON.stringify(transactions))
        }

        // Store profile transaction hash
        if (data.profileId && data.transactionHash) {
          console.log(`Storing transaction hash ${data.transactionHash} for profile ${data.profileId}`)
          const profileTxs = JSON.parse(localStorage.getItem("blockdate_profile_txs") || "{}")
          profileTxs[data.profileId] = data.transactionHash
          localStorage.setItem("blockdate_profile_txs", JSON.stringify(profileTxs))
        }

        // Redirect to success page after successful creation
        router.push(`/profile-created?tx=${data.transactionHash}&id=${data.profileId}`)
      } else {
        throw new Error(data.error || "Failed to create profile")
      }
    } catch (err: any) {
      console.error("Failed to create profile:", err)
      setError(`Failed to create profile: ${err.message}`)
    } finally {
      setIsSubmitting(false)
      setStatusMessage(null)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-pink-600">Create Your Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="18"
                max="120"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">
                Interests * <span className="text-sm text-gray-500">(comma separated)</span>
              </Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. Hiking, Reading, Travel"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500">Leave blank to use a default image</p>
            </div>

            {statusMessage && <div className="text-sm text-blue-500 p-2 bg-blue-50 rounded">{statusMessage}</div>}

            {error && <div className="text-sm text-red-500 p-2 bg-red-50 rounded">{error}</div>}
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                "Create Profile"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
