"use client"

import { Button } from "@/components/ui/button"
import { Stethoscope, Shield, AlertCircle } from "lucide-react"
import type { Language } from "@/lib/types"
import { QUICK_ACTIONS } from "@/lib/constants"

interface QuickActionsProps {
  onAction: (actionId: string) => void
  language: Language
}

export function QuickActions({ onAction, language }: QuickActionsProps) {
  const icons = {
    symptoms: Stethoscope,
    prevention: Shield,
    alerts: AlertCircle,
  }

  return (
    <div className="flex gap-2">
      {QUICK_ACTIONS.map((action) => {
        const Icon = icons[action.id as keyof typeof icons]
        const label = language === "en" ? action.label : action.labelHi

        return (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => onAction(action.id)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
