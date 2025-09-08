"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Language } from "@/lib/types"

interface AlertCardProps {
  language: Language
}

export function AlertCard({ language }: AlertCardProps) {
  return (
    <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-red-800 dark:text-red-200 font-medium">
          {language === "en"
            ? "⚠️ Urgent care recommended - Please seek immediate medical attention"
            : "⚠️ तत्काल देखभाल की सिफारिश - कृपया तुरंत चिकित्सा सहायता लें"}
        </span>
        <Button size="sm" variant="destructive" className="ml-4">
          <Phone className="w-4 h-4 mr-2" />
          {language === "en" ? "Emergency" : "आपातकाल"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
