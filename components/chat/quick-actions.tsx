import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  language: 'en' | 'hi';
}

export function QuickActions({ onActionClick, language }: QuickActionsProps) {
  const actions = language === 'hi'
    ? ["डेंगू के लक्षण क्या हैं?", "टीकाकरण शेड्यूल दिखाओ"]
    : ["What are the symptoms of Dengue?", "Show vaccination schedule"];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
      {actions.map((action, index) => (
        <Button key={index} variant="ghost" onClick={() => onActionClick(action)}>
          {action}
        </Button>
      ))}
    </div>
  );
}