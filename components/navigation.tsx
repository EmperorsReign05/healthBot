"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Map, BarChart3, Info, Syringe, HelpCircle } from "lucide-react"

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/vaccination", label: "Vaccination", icon: Syringe },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/about", label: "About", icon: Info },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <Card>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        <Link href="/chat" style={{ textDecoration: 'none', color: 'inherit', fontWeight: '600' }}>
          Swasthya Mitra
        </Link>
        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} passHref>
                <Button variant={isActive ? "primary" : "ghost"}>
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
    </Card>
  )
}