"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DistrictCard } from "./district-card"
import { MapLegend } from "./map-legend"
import type { HealthAlert } from "@/lib/types"
import { DISEASES } from "@/lib/constants"
// Import your Supabase client
import { supabase } from "@/lib/supabaseClient"

// (DynamicMap import remains the same)
// ...

export function MapView() {
  const [alerts, setAlerts] = useState<HealthAlert[]>([])
  const [selectedDisease, setSelectedDisease] = useState<string>("all")
  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null)
  const [filteredAlerts, setFilteredAlerts] = useState<HealthAlert[]>([])

  useEffect(() => {
    const fetchAlerts = async () => {
        const { data, error } = await supabase.from('public_health_alerts').select('*');
        if (error) {
            console.error("Error fetching alerts for map:", error);
            return;
        }
        if (data) {
            setAlerts(data as HealthAlert[]);
        }
    };
    fetchAlerts();
  }, [])

  // (The rest of the component remains the same)
  // ...
}