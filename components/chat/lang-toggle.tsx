"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Language } from "@/lib/types"

interface LangToggleProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export function LangToggle({ language, onLanguageChange }: LangToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="language-toggle" className="text-sm font-medium">
        EN
      </Label>
      <Switch
        id="language-toggle"
        checked={language === "hi"}
        onCheckedChange={(checked) => onLanguageChange(checked ? "hi" : "en")}
      />
      <Label htmlFor="language-toggle" className="text-sm font-medium">
        हिंदी
      </Label>
    </div>
  )
}
