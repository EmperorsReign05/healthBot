"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChatWindow } from "./chat-window";
import { ChatInput } from "./chat-input";
import { QuickActions } from "./quick-actions";
import { LangToggle } from "./lang-toggle";
import type { Message } from "@/lib/types";

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const welcomeMessage = language === 'hi'
      ? "नमस्ते! मैं स्वास्थ्य मित्र हूँ। मैं आपकी स्वास्थ्य संबंधी जानकारी में कैसे मदद कर सकता हूँ?"
      : "Hello! I'm Swasthya Mitra. How can I help you with your health information needs today?";
    setMessages([{ role: "assistant", content: welcomeMessage }]);
  }, [language]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, language: language }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a response from the server.");
      }

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = language === 'hi'
        ? "माफ़ कीजिये, कुछ गड़बड़ हो गई। कृपया पुनः प्रयास करें।"
        : "Sorry, something went wrong. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '768px', margin: '2rem auto' }}>
      <Card>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Chat</h2>
          <LangToggle language={language} setLanguage={setLanguage} />
        </div>
        
        <ChatWindow messages={messages} isLoading={isLoading} />
        
        <div style={{ padding: '0 1rem' }}>
          <QuickActions onActionClick={handleSendMessage} language={language} />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', padding: '0.5rem' }}>
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
}