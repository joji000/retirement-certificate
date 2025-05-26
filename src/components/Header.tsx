import { ChevronDown, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold text-gray-900">»</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Base Network Selector */}
        <Button variant="outline" className="gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Base
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Connect Wallet Button */}
        <Button variant="outline" className="gap-2">
          <Wallet className="w-4 h-4" />
          Connect wallet
        </Button>
      </div>
    </header>
  )
}
