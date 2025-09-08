"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { MicButton } from "./mic-button";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleTranscript = (text: string) => {
    setInputValue(text);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        width: '100%' // Ensure form takes full width
      }}
    >
      <MicButton onTranscript={handleTranscript} />
      <Input
        type="text"
        placeholder="Type a message..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isLoading}
        style={{ flexGrow: 1 }} // Allow input to take available space
      />
      <Button 
        type="submit" 
        variant="primary" 
        disabled={isLoading || !inputValue.trim()}
        style={{ flexShrink: 0 }} // Prevent the button from shrinking
      >
        <Send style={{ height: '1rem', width: '1rem' }} />
      </Button>
    </form>
  );
}