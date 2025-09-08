"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MicButtonProps {
  onTranscript: (text: string) => void;
}

export function MicButton({ onTranscript }: MicButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");
        onTranscript(transcript);
      };
      recognitionRef.current = recognition;
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (recognitionRef.current) {
      if (isRecording) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsRecording(!isRecording);
    } else {
      alert("Sorry, your browser does not support speech recognition.");
    }
  };

  return (
    <Button
      type="button"
      variant={isRecording ? "primary" : "ghost"}
      onClick={toggleRecording}
    >
      {isRecording ? <MicOff /> : <Mic />}
    </Button>
  );
}