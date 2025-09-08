"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { MetricCard } from "./metric-card"
import { TrendChart } from "./trend-chart"
import { DiseaseDistributionChart } from "./disease-distribution-chart"
import { BarChart3, Users, AlertTriangle, Stethoscope } from "lucide-react"

// Helper functions to generate mock data
const generateTrendData = () => {
  const data = []
  for (let i = 30; i >= 0; i--) {
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cases: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
    })
  }
  return data
}

const generateStateDistribution = () => {
  const states = ["Rajasthan", "Gujarat", "Punjab", "Haryana", "Uttar Pradesh"]
  return states.map((state) => ({
    name: state,
    value: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
  }))
}

export function DashboardView() {
  const trendData = generateTrendData()
  const stateData = generateStateDistribution()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Health Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Cases"
          value="12,345"
          change="+2.5%"
          icon={BarChart3}
        />
        <MetricCard
          title="Active Alerts"
          value="78"
          change="-5.1%"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Population Covered"
          value="2.5M"
          change="+10%"
          icon={Users}
        />
        <MetricCard
          title="Most Common Disease"
          value="Influenza"
          icon={Stethoscope}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Case Trends (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TrendChart data={trendData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Disease Distribution by State</CardTitle>
          </CardHeader>
          <CardContent>
            <DiseaseDistributionChart data={stateData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}