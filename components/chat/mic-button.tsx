"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic } from "lucide-react"
import type { Language } from "@/lib/types"

interface MicButtonProps {
  language: Language
}

export function MicButton({ language }: MicButtonProps) {
  const handleMicClick = () => {
    // Dummy handler for voice input
    console.log("Voice input clicked")
  }

  const tooltip = language === "en" ? "Voice input (coming soon)" : "आवाज इनपुट (जल्द आ रहा है)"

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button type="button" variant="outline" size="icon" onClick={handleMicClick}>
            <Mic className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
