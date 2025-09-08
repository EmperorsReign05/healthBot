"use client"

import { useEffect, useRef } from "react"
import type { HealthAlert } from "@/lib/types"
import { ALERT_COLORS } from "@/lib/constants"

interface LeafletMapProps {
  alerts: HealthAlert[]
  onMarkerClick: (alert: HealthAlert) => void
}

export default function LeafletMap({ alerts, onMarkerClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    const initMap = async () => {
      const L = (await import("leaflet")).default

      // Fix for default markers in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map centered on India
        mapInstanceRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Add new markers
      alerts.forEach((alert) => {
        const color = ALERT_COLORS[alert.level]

        // Create custom colored marker
        const markerHtml = `
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: ${color};
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
          ">
            ${alert.cases > 100 ? "!" : ""}
          </div>
        `

        const customIcon = L.divIcon({
          html: markerHtml,
          className: "custom-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const marker = L.marker([alert.lat, alert.lng], { icon: customIcon })
          .bindPopup(
            `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${alert.district}, ${alert.state}</h3>
              <p style="margin: 4px 0;"><strong>Disease:</strong> ${alert.disease}</p>
              <p style="margin: 4px 0;"><strong>Cases:</strong> ${alert.cases}</p>
              <p style="margin: 4px 0;"><strong>Alert Level:</strong> 
                <span style="color: ${color}; font-weight: bold;">${alert.level}</span>
              </p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Week: ${alert.week_iso}</p>
            </div>
          `,
          )
          .on("click", () => onMarkerClick(alert))
          .addTo(mapInstanceRef.current)

        markersRef.current.push(marker)
      })
    }

    updateMarkers()
  }, [alerts, onMarkerClick])

  return <div ref={mapRef} className="h-[500px] w-full rounded-lg" />
}
