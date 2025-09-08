import { MapView } from "@/components/map/map-view"

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-balance">Health Alert Map</h1>
        <p className="text-muted-foreground mt-2">Real-time disease surveillance across Indian districts</p>
      </div>
      <MapView />
    </div>
  )
}
