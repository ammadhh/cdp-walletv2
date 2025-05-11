import Link from "next/link"
import { Home, User, PlusCircle } from "lucide-react"

export function Navbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="container flex justify-around py-2">
        <Link href="/browse" className="flex flex-col items-center p-2">
          <Home className="h-6 w-6 text-pink-500" />
          <span className="text-xs mt-1">Browse</span>
        </Link>

        <Link href="/create-profile" className="flex flex-col items-center p-2">
          <PlusCircle className="h-6 w-6 text-pink-500" />
          <span className="text-xs mt-1">Create</span>
        </Link>

        <Link href="/my-profile" className="flex flex-col items-center p-2">
          <User className="h-6 w-6 text-pink-500" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  )
}
