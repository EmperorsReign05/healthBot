"use client"

import { useState, useRef, useEffect } from "react"
import { ChatWindow } from "./chat-window"
import { ChatInput } from "./chat-input"
import { QuickActions } from "./quick-actions"
import { LangToggle } from "./lang-toggle"
import { Card } from "@/components/ui/card"
import type { ChatMessage, Language } from "@/lib/types"
import { URGENT_KEYWORDS } from "@/lib/constants"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your health assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [language, setLanguage] = useState<Language>("en")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkForUrgentSymptoms = (message: string): boolean => {
    return URGENT_KEYWORDS.some((keyword) => message.toLowerCase().includes(keyword.toLowerCase()))
  }

  const generateBotResponse = (userMessage: string): string => {
    const isUrgent = checkForUrgentSymptoms(userMessage)

    if (isUrgent) {
      return language === "en"
        ? "I understand you're experiencing concerning symptoms. Please seek immediate medical attention or call emergency services. This is not a substitute for professional medical care."
        : "मैं समझता हूं कि आप चिंताजनक लक्षणों का अनुभव कर रहे हैं। कृपया तुरंत चिकित्सा सहायता लें या आपातकालीन सेवाओं को कॉल करें।"
    }

    // Simple response logic for demo
    if (userMessage.toLowerCase().includes("fever")) {
      return language === "en"
        ? "For fever, rest and stay hydrated. Monitor your temperature and consult a doctor if it persists above 101°F (38.3°C) for more than 3 days."
        : "बुखार के लिए, आराम करें और पानी पिएं। अपना तापमान देखते रहें और यदि यह 3 दिन से अधिक 101°F (38.3°C) से ऊपर रहे तो डॉक्टर से सलाह लें।"
    }

    if (userMessage.toLowerCase().includes("dengue")) {
      return language === "en"
        ? "Dengue symptoms include high fever, severe headache, and body aches. Prevent mosquito breeding by removing stagnant water. Seek medical care if symptoms worsen."
        : "डेंगू के लक्षणों में तेज बुखार, सिरदर्द और शरीर में दर्द शामिल है। रुके हुए पानी को हटाकर मच्छरों के प्रजनन को रोकें।"
    }

    return language === "en"
      ? "Thank you for your question. For specific medical concerns, please consult with a healthcare professional. I can provide general health information and prevention tips."
      : "आपके प्रश्न के लिए धन्यवाद। विशिष्ट चिकित्सा चिंताओं के लिए, कृपया किसी स्वास्थ्य पेशेवर से सलाह लें।"
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(
      () => {
        const isUrgent = checkForUrgentSymptoms(content)
        const botResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: generateBotResponse(content),
          sender: "bot",
          timestamp: new Date(),
          isUrgent,
        }

        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleQuickAction = (actionId: string) => {
    const actions = {
      symptoms:
        language === "en"
          ? "What are the common symptoms of dengue, malaria, and diarrhea?"
          : "डेंगू, मलेरिया और दस्त के सामान्य लक्षण क्या हैं?",
      prevention:
        language === "en" ? "How can I prevent mosquito-borne diseases?" : "मैं मच्छर जनित बीमारियों से कैसे बच सकता हूं?",
      alerts:
        language === "en" ? "What are the current health alerts in my area?" : "मेरे क्षेत्र में वर्तमान स्वास्थ्य चेतावनी क्या हैं?",
    }

    const message = actions[actionId as keyof typeof actions]
    if (message) {
      handleSendMessage(message)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold">Health Assistant</h2>
          <QuickActions onAction={handleQuickAction} language={language} />
        </div>
        <LangToggle language={language} onLanguageChange={setLanguage} />
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatWindow messages={messages} isTyping={isTyping} language={language} />
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <ChatInput onSendMessage={handleSendMessage} language={language} />
      </div>
    </Card>
  )
}
