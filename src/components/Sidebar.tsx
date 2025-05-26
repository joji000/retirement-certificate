import { Home, Users, Settings, DollarSign, HelpCircle, FileText, BarChart3, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const navigationItems = [
    { icon: Home, label: "Home" },
    { icon: Users, label: "Users" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Settings, label: "Settings" },
    { icon: DollarSign, label: "Finance" },
    { icon: HelpCircle, label: "Help" },
    { icon: FileText, label: "Documents" },
    { icon: Headphones, label: "Support" },
  ]

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">T</span>
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col gap-2">
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className="w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <item.icon className="w-5 h-5" />
            <span className="sr-only">{item.label}</span>
          </Button>
        ))}
      </nav>
    </div>
  )
}
