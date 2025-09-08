"use client"

import { Card } from "@/components/ui/card"
import { ALERT_COLORS } from "@/lib/constants"

export function MapLegend() {
  const levels = [
    { level: "None", label: "No Alert" },
    { level: "Watch", label: "Watch" },
    { level: "Warning", label: "Warning" },
    { level: "Outbreak", label: "Outbreak" },
  ] as const

  return (
    <Card className="p-3">
      <h4 className="text-sm font-medium mb-2">Alert Levels</h4>
      <div className="flex gap-4">
        {levels.map(({ level, label }) => (
          <div key={level} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: ALERT_COLORS[level] }}
            />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
