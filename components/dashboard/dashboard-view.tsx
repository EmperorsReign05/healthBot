"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendChart } from "./trend-chart"
import { DiseaseDistributionChart } from "./disease-distribution-chart"
import { MetricCard } from "./metric-card"
import { Activity, AlertTriangle, MapPin, TrendingUp } from "lucide-react"
import type { HealthAlert, DiseaseMetrics } from "@/lib/types"
// Import your Supabase client
import { supabase } from "@/lib/supabaseClient" // Make sure you have created this file

export function DashboardView() {
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [metrics, setMetrics] = useState<DiseaseMetrics>({
    totalDistricts: 0,
    activeOutbreaks: 0,
    mostAffectedDisease: "N/A",
    totalCases: 0,
  })

  // Fetch data from Supabase on component mount
  useEffect(() => {
    const fetchAlerts = async () => {
      const { data, error } = await supabase.from('public_health_alerts').select('*');
      
      if (error) {
        console.error("Error fetching alerts:", error);
        return;
      }

      if (data) {
        const alertsTyped = data as HealthAlert[];
        setAlerts(alertsTyped);

        // Calculate metrics
        const totalDistricts = alertsTyped.length;
        const activeOutbreaks = alertsTyped.filter((alert) => alert.level === "Outbreak").length;
        const totalCases = alertsTyped.reduce((sum, alert) => sum + alert.cases, 0);

        const diseaseStats = alertsTyped.reduce(
          (acc, alert) => {
            acc[alert.disease] = (acc[alert.disease] || 0) + alert.cases;
            return acc;
          },
          {} as Record<string, number>
        );

        const mostAffectedDisease = Object.keys(diseaseStats).length > 0 
          ? Object.entries(diseaseStats).reduce((a, b) => (a[1] > b[1] ? a : b))[0] 
          : "N/A";

        setMetrics({
          totalDistricts,
          activeOutbreaks,
          mostAffectedDisease,
          totalCases,
        });
      }
    };

    fetchAlerts();
  }, []);

  // (The rest of the component remains the same for now)
  // ... functions to generate chart data ...
  const generateTrendData = () => {
    // ... (rest of the function)
  }
  const generateStateDistribution = () => {
    // ... (rest of the function)
  }

  const trendData = generateTrendData();
  const stateData = generateStateDistribution();

  return (
    // ... (rest of the JSX)
  )
}