export interface HealthAlert {
  state: string
  district: string
  disease: string
  week_iso: string
  level: "None" | "Watch" | "Warning" | "Outbreak"
  cases: number
  lat: number
  lng: number
}

export interface ChatMessage {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isUrgent?: boolean
}

export type Language = "en" | "hi"

export interface DiseaseMetrics {
  totalDistricts: number
  activeOutbreaks: number
  mostAffectedDisease: string
  totalCases: number
}
