"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DistributionChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

export function DiseaseDistributionChart({ data }: DistributionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={80} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" name="Cases" />
      </BarChart>
    </ResponsiveContainer>
  );
}