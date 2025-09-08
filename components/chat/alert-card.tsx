import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface AlertCardProps {
  disease: string;
  location: string;
}

export function AlertCard({ disease, location }: AlertCardProps) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
        <AlertTriangle style={{ color: 'orange', flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: '600' }}>High Alert: {disease}</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            Increased cases reported in {location}. Please take precautions.
          </p>
        </div>
      </div>
    </Card>
  );
}