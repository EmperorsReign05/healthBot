interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  const bubbleStyle: React.CSSProperties = {
    maxWidth: '75%',
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    marginBottom: '0.5rem',
    lineHeight: '1.5',
    backgroundColor: isUser ? 'var(--primary)' : 'var(--border)',
    color: isUser ? 'var(--primary-foreground)' : 'var(--foreground)',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    marginLeft: isUser ? 'auto' : '0',
    marginRight: isUser ? '0' : 'auto',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={bubbleStyle}>
        {content}
      </div>
    </div>
  );
}