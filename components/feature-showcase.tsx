"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageCircle, Gift, ChevronRight, Send, Clock, Star } from "lucide-react"

export function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState("matches")

  // Example matches data
  const matches = [
    {
      id: 101,
      name: "John",
      age: 30,
      imageUrl: "https://www.researchgate.net/publication/362062287/figure/fig1/AS:1178909135642626@1658085249834/Composite-portraits-of-the-Bored-Ape-Yacht-Club-The-ape-on-the-left-not-present-in-the.jpg",
      matchDate: "2 days ago",
      lastMessage: "Would love to chat about blockchain!",
    },
    {
      id: 102,
      name: "Emma",
      age: 28,
      imageUrl: "https://images.barrons.com/im-394091?width=1280&size=1.77777778",
      matchDate: "5 days ago",
      lastMessage: "Hey, how's your NFT collection going?",
    },
    {
      id: 103,
      name: "Michael",
      age: 32,
      imageUrl: "https://www.thestreet.com/.image/t_share/MTgyMDU5NDcwMTc4NzU1NzE1/boredape1.jpg",
      matchDate: "1 week ago",
      lastMessage: null,
    },
  ]

  // Example messages data
  const messages = [
    {
      id: 1,
      matchId: 101,
      name: "Emma",
      imageUrl: "/professional-woman-portrait.png",
      messages: [
        { sender: "them", text: "Hey! I saw you're into DeFi too!", time: "2 days ago" },
        { sender: "you", text: "Yes! Been exploring yield farming lately. What about you?", time: "2 days ago" },
        { sender: "them", text: "Would love to chat about blockchain!", time: "1 day ago" },
      ],
    },
    {
      id: 2,
      matchId: 102,
      name: "Michael",
      imageUrl: "/smiling-man-portrait.png",
      messages: [
        { sender: "them", text: "Hi there! Nice to match with you!", time: "5 days ago" },
        { sender: "you", text: "Thanks! I liked your profile too.", time: "5 days ago" },
        { sender: "them", text: "Hey, how's your NFT collection going?", time: "3 days ago" },
      ],
    },
  ]

  // Example NFT rewards
  const nftRewards = [
    {
      id: 1,
      name: "First Date Badge",
      description: "Earned after your first successful date",
      imageUrl: "/first-date-nft-badge.png",
      rarity: "Common",
    },
    {
      id: 2,
      name: "Perfect Match",
      description: "When both users rate the date 5 stars",
      imageUrl: "/perfect-match-heart-nft.png",
      rarity: "Rare",
    },
    {
      id: 3,
      name: "Blockchain Romeo",
      description: "For users who've had 10+ successful dates",
      imageUrl: "/romantic-blockchain-nft.png",
      rarity: "Legendary",
    },
  ]

  return (
    <div className="mt-8 mb-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-pink-600">Coming Soon</h2>
        <Badge variant="outline" className="text-pink-500 border-pink-200">
          Preview
        </Badge>
      </div>

      <Tabs defaultValue="matches" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="matches" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>Matches</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
          <TabsTrigger value="nfts" className="flex items-center gap-1">
            <Gift className="h-4 w-4" />
            <span>NFT Rewards</span>
          </TabsTrigger>
        </TabsList>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            When you and another user both like each other, you'll match and can start chatting!
          </p>

          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden">
              <div className="flex items-center p-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image src={match.imageUrl || "/placeholder.svg"} alt={match.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">
                    {match.name}, {match.age}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    Matched {match.matchDate}
                  </p>
                  {match.lastMessage && <p className="text-sm text-gray-700 mt-1 truncate">{match.lastMessage}</p>}
                </div>
                <Button size="sm" className="bg-pink-500 hover:bg-pink-600 ml-2 flex-shrink-0">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
              </div>
            </Card>
          ))}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 mb-2">Keep swiping to find more matches!</p>
            <Button variant="outline" className="text-pink-500 border-pink-200">
              Find More Matches
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Chat securely with your matches. All messages are encrypted and stored on-chain!
          </p>

          {messages.map((conversation) => (
            <Card key={conversation.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={conversation.imageUrl || "/placeholder.svg"}
                      alt={conversation.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="text-lg">{conversation.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {conversation.messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === "you" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-2 rounded-lg ${
                          msg.sender === "you"
                            ? "bg-pink-500 text-white rounded-br-none"
                            : "bg-gray-100 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 p-2 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-pink-500"
                  />
                  <Button className="rounded-l-none bg-pink-500 hover:bg-pink-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        {/* NFT Rewards Tab */}
        <TabsContent value="nfts" className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Earn exclusive NFTs by using BlockDate! These can be traded or displayed on your profile.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {nftRewards.map((nft) => (
              <Card key={nft.id} className="overflow-hidden">
                <div className="flex p-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4 border-2 border-pink-100">
                    <Image src={nft.imageUrl || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg">{nft.name}</h3>
                      <Badge
                        className={
                          nft.rarity === "Legendary"
                            ? "bg-purple-500"
                            : nft.rarity === "Rare"
                              ? "bg-blue-500"
                              : "bg-green-500"
                        }
                      >
                        {nft.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{nft.description}</p>
                    <div className="flex items-center mt-2">
                      {nft.rarity === "Legendary" ? (
                        <>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </>
                      ) : nft.rarity === "Rare" ? (
                        <>
                          <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                          <Star className="h-4 w-4 text-blue-500 fill-blue-500" />
                        </>
                      ) : (
                        <Star className="h-4 w-4 text-green-500 fill-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-4">
            <Button className="bg-pink-500 hover:bg-pink-600">
              <Gift className="h-4 w-4 mr-1" />
              View Collection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
