export const ALERT_COLORS = {
  None: "#22c55e", // green-500
  Watch: "#eab308", // yellow-500
  Warning: "#f97316", // orange-500
  Outbreak: "#ef4444", // red-500
} as const

export const DISEASES = ["Dengue", "Malaria", "Diarrhea"] as const

export const URGENT_KEYWORDS = [
  "chest pain",
  "fainting",
  "breathing difficulty",
  "severe headache",
  "high fever",
  "unconscious",
  "bleeding",
  "seizure",
]

export const QUICK_ACTIONS = [
  { id: "symptoms", label: "Common Symptoms", labelHi: "सामान्य लक्षण" },
  { id: "prevention", label: "Prevention Tips", labelHi: "बचाव के तरीके" },
  { id: "alerts", label: "Health Alerts", labelHi: "स्वास्थ्य चेतावनी" },
] as const
