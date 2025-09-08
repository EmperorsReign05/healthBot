"use client"

import { Badge } from "@/components/ui/badge"
import { ALERT_COLORS } from "@/lib/constants"
import type { HealthAlert } from "@/lib/types"

interface AlertBadgeProps {
  level: HealthAlert["level"]
}

export function AlertBadge({ level }: AlertBadgeProps) {
  const color = ALERT_COLORS[level]

  const variants = {
    None: "secondary",
    Watch: "secondary",
    Warning: "secondary",
    Outbreak: "destructive",
  } as const

  return (
    <Badge
      variant={variants[level]}
      className="text-xs"
      style={{
        backgroundColor: level === "Outbreak" ? undefined : color,
        color: level === "None" ? "#000" : "#fff",
        borderColor: color,
      }}
    >
      {level}
    </Badge>
  )
}
