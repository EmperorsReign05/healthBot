import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Imports your new, simple stylesheet
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Swasthya Mitra",
  description: "Your AI-powered public health assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}