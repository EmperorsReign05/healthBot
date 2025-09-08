"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageBubble } from "./message-bubble"
import { AlertCard } from "./alert-card"
import type { ChatMessage, Language } from "@/lib/types"

interface ChatWindowProps {
  messages: ChatMessage[]
  isTyping: boolean
  language: Language
}

export function ChatWindow({ messages, isTyping, language }: ChatWindowProps) {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <MessageBubble message={message} language={language} />
            {message.isUrgent && message.sender === "bot" && <AlertCard language={language} />}
          </div>
        ))}

        {isTyping && (
          <MessageBubble
            message={{
              id: "typing",
              content: language === "en" ? "Typing..." : "टाइप कर रहा है...",
              sender: "bot",
              timestamp: new Date(),
            }}
            language={language}
            isTyping
          />
        )}
      </div>
    </ScrollArea>
  )
}
