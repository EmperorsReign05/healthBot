"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertBadge } from "./alert-badge"
import { X, MapPin, Calendar, Activity } from "lucide-react"
import type { HealthAlert } from "@/lib/types"

interface DistrictCardProps {
  alert: HealthAlert
  onClose: () => void
}

export function DistrictCard({ alert, onClose }: DistrictCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{alert.district}</CardTitle>
            <p className="text-sm text-muted-foreground">{alert.state}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Alert Level</span>
          <AlertBadge level={alert.level} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{alert.disease}</p>
              <p className="text-xs text-muted-foreground">Disease Type</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{alert.cases} cases</p>
              <p className="text-xs text-muted-foreground">Reported Cases</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{alert.week_iso}</p>
              <p className="text-xs text-muted-foreground">Reporting Week</p>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Prevention Tips</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {alert.disease === "Dengue" && (
              <>
                <p>• Remove stagnant water sources</p>
                <p>• Use mosquito repellents</p>
                <p>• Wear long-sleeved clothing</p>
              </>
            )}
            {alert.disease === "Malaria" && (
              <>
                <p>• Sleep under treated bed nets</p>
                <p>• Use indoor residual spraying</p>
                <p>• Eliminate breeding sites</p>
              </>
            )}
            {alert.disease === "Diarrhea" && (
              <>
                <p>• Drink safe, boiled water</p>
                <p>• Practice good hand hygiene</p>
                <p>• Eat properly cooked food</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
