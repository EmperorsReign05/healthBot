"use client"

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

// This interface now correctly matches the data being passed from the dashboard view.
interface DistributionChartProps {
  data: {
    name: string
    value: number
  }[]
}

export function DiseaseDistributionChart({ data }: DistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={80} />
        <Tooltip cursor={{ fill: 'transparent' }} />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" name="Reported Cases" />
      </BarChart>
    </ResponsiveContainer>
  )
}