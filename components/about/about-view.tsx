"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Shield, Globe, Users, Heart, ExternalLink, AlertTriangle } from "lucide-react"

export function AboutView() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-balance">Swasthya Mitra</CardTitle>
              <p className="text-xl text-muted-foreground mt-1">स्वास्थ्य मित्र</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Your AI-powered public health companion for disease surveillance, prevention guidance, and health awareness
            across India
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              Multilingual Support
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Real-time Surveillance
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Community Health
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Swasthya Mitra is dedicated to democratizing access to public health information and empowering communities
            across India with timely, accurate, and actionable health guidance. We bridge the gap between complex
            epidemiological data and everyday health decisions.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">What We Do</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Provide real-time disease surveillance and outbreak monitoring
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Offer multilingual health guidance and prevention tips
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Detect urgent symptoms and recommend immediate care
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  Visualize health trends and patterns across Indian districts
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Our Impact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  Supporting informed health decisions in rural and urban areas
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  Enabling early detection and prevention of disease outbreaks
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  Reducing health disparities through accessible information
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  Strengthening community resilience against health threats
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology & Partners */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">AI</span>
                </div>
                <p className="text-sm font-medium">AI Assistant</p>
                <p className="text-xs text-muted-foreground">Natural Language Processing</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium">Interactive Maps</p>
                <p className="text-xs text-muted-foreground">Leaflet.js Integration</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">📊</span>
                </div>
                <p className="text-sm font-medium">Data Analytics</p>
                <p className="text-xs text-muted-foreground">Recharts Visualization</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-sm">⚡</span>
                </div>
                <p className="text-sm font-medium">Real-time Updates</p>
                <p className="text-xs text-muted-foreground">Next.js Framework</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Sources & Partners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">Ministry of Health & Family Welfare</p>
                  <p className="text-xs text-muted-foreground">Government of India</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">National Centre for Disease Control</p>
                  <p className="text-xs text-muted-foreground">Surveillance Data</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">World Health Organization</p>
                  <p className="text-xs text-muted-foreground">Global Health Guidelines</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Disclaimer */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <div className="space-y-2">
            <p className="font-semibold">Important Medical Disclaimer</p>
            <div className="text-sm space-y-1">
              <p>
                Swasthya Mitra is an informational tool designed to provide general health guidance and disease
                surveillance data. It is NOT a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="font-medium">Always seek the advice of qualified healthcare providers for:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Any medical condition or symptoms you may have</li>
                <li>Questions regarding medications or treatments</li>
                <li>Emergency medical situations - call local emergency services immediately</li>
                <li>Specific medical advice tailored to your individual circumstances</li>
              </ul>
              <p className="mt-2">
                The information provided by this application should not be used to delay or replace consultation with
                qualified medical professionals.
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Contact & Support */}
      <Card>
        <CardHeader>
          <CardTitle>Contact & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Chat Support</p>
              <p className="text-sm text-muted-foreground">Available 24/7 through the chat interface</p>
            </div>
            <div className="text-center p-4">
              <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Language Support</p>
              <p className="text-sm text-muted-foreground">English and Hindi with more languages coming soon</p>
            </div>
            <div className="text-center p-4">
              <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-medium">Privacy & Security</p>
              <p className="text-sm text-muted-foreground">Your health data is protected and never stored</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
