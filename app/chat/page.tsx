import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-balance">Health Assistant Chat</h1>
        <p className="text-muted-foreground mt-2">
          Ask questions about health, symptoms, and prevention. Available in English and Hindi.
        </p>
      </div>
      <ChatInterface />
    </div>
  )
}
