"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Bot, User } from "lucide-react"
import type { ChatMessage, Language } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  message: ChatMessage
  language: Language
  isTyping?: boolean
}

export function MessageBubble({ message, language, isTyping }: MessageBubbleProps) {
  const isBot = message.sender === "bot"

  return (
    <div className={cn("flex gap-3", isBot ? "justify-start" : "justify-end")}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className={cn("max-w-[80%] space-y-2", !isBot && "flex flex-col items-end")}>
        <Card className={cn("p-3", isBot ? "bg-muted" : "bg-primary text-primary-foreground ml-auto")}>
          <p className={cn("text-sm leading-relaxed", isTyping && "animate-pulse")}>{message.content}</p>
        </Card>

        {isBot && !isTyping && (
          <Badge variant="secondary" className="text-xs">
            {language === "en" ? "Not medical advice" : "चिकित्सा सलाह नहीं"}
          </Badge>
        )}

        <span className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  )
}
