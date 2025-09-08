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

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">National Immunization Schedule</CardTitle>
          <CardDescription>
            Following the official vaccination schedule is crucial for protecting against preventable diseases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
            
            {/* Schedule for Infants */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">For Infants (Up to 1 year)</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When to Give</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protects Against</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {infants.map((group, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 font-medium">{group.when}</td>
                          <td className="px-6 py-4">
                            {group.vaccines.map(v => v.name).join(', ')}
                          </td>
                          <td className="px-6 py-4">
                            {group.vaccines.map(v => v.protectsAgainst).join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Schedule for Children */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">For Children (1-16 years)</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When to Give</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protects Against</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {children.map((group, index) => (
                         <tr key={index}>
                          <td className="px-6 py-4 font-medium">{group.when}</td>
                          <td className="px-6 py-4">
                            {group.vaccines.map(v => v.name).join(', ')}
                          </td>
                          <td className="px-6 py-4">
                            {group.vaccines.map(v => v.protectsAgainst).join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Schedule for Pregnant Women */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">For Pregnant Women</AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vaccine</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When to Give</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dose</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protects Against</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pregnantWomen.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{item.vaccine}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.when}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.dose}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.protectsAgainst}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
            
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}