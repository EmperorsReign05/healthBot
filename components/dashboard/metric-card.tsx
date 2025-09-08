import { Card } from "@/components/ui/card";
import type { LucideProps } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
}

export function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
          <Icon style={{ height: '1rem', width: '1rem', color: 'var(--muted-foreground)' }} />
        </div>
        <p style={{ fontSize: '1.875rem', fontWeight: '700', marginTop: '0.5rem' }}>{value}</p>
      </div>
    </Card>
  );
}