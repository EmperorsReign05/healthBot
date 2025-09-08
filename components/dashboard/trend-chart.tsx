"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface TrendChartProps {
  data: Array<{
    week: string
    Dengue: number
    Malaria: number
    Diarrhea: number
  }>
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="week"
            className="text-xs fill-muted-foreground"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.replace("2025-W", "W")}
          />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelFormatter={(value) => `Week: ${value}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Dengue"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Malaria"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Diarrhea"
            stroke="hsl(var(--chart-3))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
