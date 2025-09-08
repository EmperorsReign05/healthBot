"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Map, BarChart3, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/map", label: "Health Map", icon: Map },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/about", label: "About", icon: Info },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <Card className="border-b rounded-none">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/chat" className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-foreground">Swasthya Mitra</span>
            <span className="text-muted-foreground text-sm">स्वास्थ्य मित्र</span>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn("flex items-center gap-2", isActive && "bg-primary text-primary-foreground")}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      </div>
    </Card>
  )
}
