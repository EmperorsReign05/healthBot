import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";
import type { Message } from "@/lib/types";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <ScrollArea style={{ height: '400px', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', margin: '1rem 0' }}>
      <div>
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <MessageBubble role="assistant" content="..." />}
      </div>
    </ScrollArea>
  );
}