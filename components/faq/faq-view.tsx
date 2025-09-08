"use client"

import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faqData from "@/data/faq.json";

export function FaqView() {
  return (
    <div style={{ padding: '2rem 0' }}>
      <Card>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h1>
          <Accordion defaultValue="item-0">
            {faqData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p style={{ lineHeight: '1.75' }}>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Card>
    </div>
  );
}