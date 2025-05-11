export interface Profile {
  id: number
  name: string
  age: number
  bio: string
  interests: string
  imageUrl: string
  likeCount: number
  transactionHash?: string // Add transaction hash
}

export interface AccountInfo {
  userAccount: {
    address: string
  }
  smartAccount: {
    address: string
  }
}

export interface TransactionInfo {
  hash: string
  type: "create" | "like"
  profileId: number
  timestamp: number
}
