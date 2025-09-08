"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendChart } from "./trend-chart"
import { DiseaseDistributionChart } from "./disease-distribution-chart"
import { MetricCard } from "./metric-card"
import { Activity, AlertTriangle, MapPin, TrendingUp } from "lucide-react"
import type { HealthAlert, DiseaseMetrics } from "@/lib/types"
import alertsData from "@/data/alerts.json"

export function DashboardView() {
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [metrics, setMetrics] = useState<DiseaseMetrics>({
    totalDistricts: 0,
    activeOutbreaks: 0,
    mostAffectedDisease: "",
    totalCases: 0,
  })

  useEffect(() => {
    const alertsTyped = alertsData as HealthAlert[]
    setAlerts(alertsTyped)

    // Calculate metrics
    const totalDistricts = alertsTyped.length
    const activeOutbreaks = alertsTyped.filter((alert) => alert.level === "Outbreak").length
    const totalCases = alertsTyped.reduce((sum, alert) => sum + alert.cases, 0)

    // Find most affected disease by total cases
    const diseaseStats = alertsTyped.reduce(
      (acc, alert) => {
        acc[alert.disease] = (acc[alert.disease] || 0) + alert.cases
        return acc
      },
      {} as Record<string, number>,
    )

    const mostAffectedDisease = Object.entries(diseaseStats).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    setMetrics({
      totalDistricts,
      activeOutbreaks,
      mostAffectedDisease,
      totalCases,
    })
  }, [])

  // Generate trend data (simulated weekly data)
  const generateTrendData = () => {
    const weeks = ["2025-W32", "2025-W33", "2025-W34", "2025-W35", "2025-W36"]
    const diseases = ["Dengue", "Malaria", "Diarrhea"]

    return weeks.map((week) => {
      const weekData: any = { week }
      diseases.forEach((disease) => {
        // Simulate trend data based on current alerts
        const currentCases = alerts
          .filter((alert) => alert.disease === disease)
          .reduce((sum, alert) => sum + alert.cases, 0)
        const variation = Math.random() * 0.4 + 0.8 // 80-120% of current
        weekData[disease] = Math.round(currentCases * variation)
      })
      return weekData
    })
  }

  // Generate state distribution data
  const generateStateDistribution = () => {
    const stateStats = alerts.reduce(
      (acc, alert) => {
        acc[alert.state] = (acc[alert.state] || 0) + alert.cases
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(stateStats).map(([state, cases]) => ({
      state,
      cases,
      percentage: Math.round((cases / metrics.totalCases) * 100),
    }))
  }

  const trendData = generateTrendData()
  const stateData = generateStateDistribution()

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Districts Monitored"
          value={metrics.totalDistricts.toString()}
          icon={MapPin}
          description="Total districts under surveillance"
        />
        <MetricCard
          title="Active Outbreaks"
          value={metrics.activeOutbreaks.toString()}
          icon={AlertTriangle}
          description="Districts with outbreak status"
          variant="destructive"
        />
        <MetricCard
          title="Most Affected Disease"
          value={metrics.mostAffectedDisease}
          icon={Activity}
          description="Disease with highest case count"
        />
        <MetricCard
          title="Total Cases"
          value={metrics.totalCases.toLocaleString()}
          icon={TrendingUp}
          description="Cumulative reported cases"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="trends">Disease Trends</TabsTrigger>
          <TabsTrigger value="distribution">State Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cases Over Time</CardTitle>
                <p className="text-sm text-muted-foreground">Weekly disease surveillance trends</p>
              </CardHeader>
              <CardContent>
                <TrendChart data={trendData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Level Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Current alert status across districts</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["None", "Watch", "Warning", "Outbreak"].map((level) => {
                    const count = alerts.filter((alert) => alert.level === level).length
                    const percentage = Math.round((count / alerts.length) * 100)
                    const colors = {
                      None: "bg-green-500",
                      Watch: "bg-yellow-500",
                      Warning: "bg-orange-500",
                      Outbreak: "bg-red-500",
                    }

                    return (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${colors[level as keyof typeof colors]}`} />
                          <span className="text-sm font-medium">{level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{count} districts</span>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cases by State</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of disease cases across Indian states</p>
            </CardHeader>
            <CardContent>
              <DiseaseDistributionChart data={stateData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
