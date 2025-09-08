"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { MicButton } from "./mic-button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  language: "en" | "hi";
}

export function ChatInput({ onSendMessage, isLoading, language }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  // This function will be called by the MicButton with the live transcript
  const handleTranscript = (text: string) => {
    setInputValue(text);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center space-x-2 p-2"
    >
      <MicButton language={language} onTranscript={handleTranscript} />
      <Input
        type="text"
        placeholder={language === "en" ? "Type a message..." : "संदेश टाइप करें..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading || !inputValue.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}