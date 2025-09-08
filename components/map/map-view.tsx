"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DistrictCard } from "./district-card"
import { MapLegend } from "./map-legend"
import type { HealthAlert } from "@/lib/types"
import { DISEASES } from "@/lib/constants"
import alertsData from "@/data/alerts.json"

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
})

export function MapView() {
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [selectedDisease, setSelectedDisease] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null)
  const [filteredAlerts, setFilteredAlerts] = useState<HealthAlert[]>([])

  useEffect(() => {
    setAlerts(alertsData as HealthAlert[])
  }, [])

  useEffect(() => {
    if (selectedDisease === "all") {
      setFilteredAlerts(alerts)
    } else {
      setFilteredAlerts(alerts.filter((alert) => alert.disease === selectedDisease))
    }
  }, [alerts, selectedDisease])

  const handleMarkerClick = (alert: HealthAlert) => {
    setSelectedAlert(alert)
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedDisease} onValueChange={setSelectedDisease} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All Diseases</TabsTrigger>
            {DISEASES.map((disease) => (
              <TabsTrigger key={disease} value={disease}>
                {disease}
              </TabsTrigger>
            ))}
          </TabsList>
          <MapLegend />
        </div>

        <TabsContent value={selectedDisease} className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="p-4">
                <DynamicMap alerts={filteredAlerts} onMarkerClick={handleMarkerClick} />
              </Card>
            </div>

            <div className="space-y-4">
              {selectedAlert ? (
                <DistrictCard alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
              ) : (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">District Information</h3>
                  <p className="text-sm text-muted-foreground">Click on a district marker to view details</p>
                </Card>
              )}

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Alert Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Districts:</span>
                    <span className="font-medium">{filteredAlerts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outbreaks:</span>
                    <span className="font-medium text-red-600">
                      {filteredAlerts.filter((a) => a.level === "Outbreak").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warnings:</span>
                    <span className="font-medium text-orange-600">
                      {filteredAlerts.filter((a) => a.level === "Warning").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Watch:</span>
                    <span className="font-medium text-yellow-600">
                      {filteredAlerts.filter((a) => a.level === "Watch").length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
