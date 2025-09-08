"use client";

import { Card } from "@/components/ui/card";
import { MetricCard } from "./metric-card";
import { TrendChart } from "./trend-chart";
import { DiseaseDistributionChart } from "./disease-distribution-chart";
import { BarChart3, Users, AlertTriangle, Stethoscope } from "lucide-react";

const generateTrendData = () => {
  const data = [];
  for (let i = 30; i >= 0; i--) {
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      cases: Math.floor(Math.random() * 200) + 50,
    });
  }
  return data;
};

const generateStateDistribution = () => {
  const states = ["Rajasthan", "Gujarat", "Punjab", "Haryana", "Uttar Pradesh"];
  return states.map((state) => ({
    name: state,
    value: Math.floor(Math.random() * 5000) + 1000,
  }));
};

export function DashboardView() {
  const trendData = generateTrendData();
  const stateData = generateStateDistribution();

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1rem' }}>
        Health Dashboard
      </h2>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <MetricCard title="Total Cases" value="12,345" icon={BarChart3} />
        <MetricCard title="Active Alerts" value="78" icon={AlertTriangle} />
        <MetricCard title="Population Covered" value="2.5M" icon={Users} />
        <MetricCard title="Most Common Disease" value="Influenza" icon={Stethoscope} />
      </div>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr', marginTop: '1rem' }}>
        <Card>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', padding: '1rem 1rem 0 1rem' }}>
            Case Trends (Last 30 Days)
          </h3>
          <TrendChart data={trendData} />
        </Card>
        <Card>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', padding: '1rem 1rem 0 1rem' }}>
            Disease Distribution by State
          </h3>
          <DiseaseDistributionChart data={stateData} />
        </Card>
      </div>
    </div>
  );
}