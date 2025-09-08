// lib/types.ts

// The 'export' keyword makes this type available to other files.
export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type HealthAlert = {
  id: number;
  disease: string;
  location: string;
  latitude: number;
  longitude: number;
  alert_level: "High" | "Medium" | "Low";
  cases: number;
  timestamp: string;
};