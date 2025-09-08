"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; 
import vaccinationData from "@/data/vaccination.json";

export function VaccinationView() {
  const { pregnantWomen, infants, children } = vaccinationData;

  // Simple table styles for readability
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };
  const thStyle: React.CSSProperties = {
    padding: '0.75rem',
    textAlign: 'left',
    borderBottom: '1px solid var(--border)',
    backgroundColor: '#f9fafb',
    fontSize: '0.875rem',
    fontWeight: '600',
  };
  const tdStyle: React.CSSProperties = {
    padding: '0.75rem',
    borderBottom: '1px solid var(--border)',
    fontSize: '0.875rem',
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Card>
        <CardHeader>
          <CardTitle>National Immunization Schedule</CardTitle>
          <CardDescription>
            Official vaccination schedules for infants, children, and pregnant women in India.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion defaultValue="item-1">
            
            <AccordionItem value="item-1">
              <AccordionTrigger>For Infants (Up to 1 year)</AccordionTrigger>
              <AccordionContent>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>When to Give</th>
                      <th style={thStyle}>Vaccine</th>
                      <th style={thStyle}>Protects Against</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infants.map((group, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{group.when}</td>
                        <td style={tdStyle}>{group.vaccines.map(v => v.name).join(', ')}</td>
                        <td style={tdStyle}>{group.vaccines.map(v => v.protectsAgainst).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>For Children (1-16 years)</AccordionTrigger>
              <AccordionContent>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>When to Give</th>
                      <th style={thStyle}>Vaccine</th>
                      <th style={thStyle}>Protects Against</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((group, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{group.when}</td>
                        <td style={tdStyle}>{group.vaccines.map(v => v.name).join(', ')}</td>
                        <td style={tdStyle}>{group.vaccines.map(v => v.protectsAgainst).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>For Pregnant Women</AccordionTrigger>
              <AccordionContent>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Vaccine</th>
                      <th style={thStyle}>When to Give</th>
                      <th style={thStyle}>Dose</th>
                      <th style={thStyle}>Protects Against</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pregnantWomen.map((item, index) => (
                      <tr key={index}>
                        <td style={tdStyle}>{item.vaccine}</td>
                        <td style={tdStyle}>{item.when}</td>
                        <td style={tdStyle}>{item.dose}</td>
                        <td style={tdStyle}>{item.protectsAgainst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}