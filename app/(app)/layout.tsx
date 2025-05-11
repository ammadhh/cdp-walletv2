import type React from "react"
import { Navbar } from "@/components/navbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pb-16">
      {children}
      <Navbar />
    </div>
  )
}
