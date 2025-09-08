"use client"

import { Card } from "@/components/ui/card";

export function AboutView() {
  return (
    <div style={{ padding: '2rem 0' }}>
      <Card>
        <div style={{ padding: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
            About Swasthya Mitra
          </h1>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>
            Your AI-powered public health assistant, dedicated to providing accessible and reliable health information.
          </p>
          <div style={{ lineHeight: '1.75' }}>
            <p style={{ marginBottom: '1rem' }}>
              Swasthya Mitra (स्वास्थ्य मित्र) was created to bridge the information gap in healthcare, especially for rural and semi-urban populations. We believe that everyone deserves access to clear, accurate, and timely health information to make informed decisions for themselves and their families.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Our platform uses a powerful AI chatbot to answer your health questions, provides up-to-date vaccination schedules based on national guidelines, and offers a dashboard to visualize public health trends.
            </p>
            <p>
              Our mission is to empower communities with knowledge, promote preventive healthcare, and contribute to a healthier India.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}