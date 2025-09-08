"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MicButton } from "./mic-button"
import { Send } from "lucide-react"
import type { Language } from "@/lib/types"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  language: Language
}

export function ChatInput({ onSendMessage, language }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const placeholder =
    language === "en"
      ? "Ask about symptoms, prevention, or health concerns..."
      : "लक्षण, बचाव या स्वास्थ्य संबंधी चिंताओं के बारे में पूछें..."

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <MicButton language={language} />
      <Button type="submit" disabled={!message.trim()}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  )
}
