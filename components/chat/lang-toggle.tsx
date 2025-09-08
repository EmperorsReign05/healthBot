"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface LangToggleProps {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}

export function LangToggle({ language, setLanguage }: LangToggleProps) {
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Label htmlFor="lang-switch">English</Label>
      <Switch
        id="lang-switch"
        checked={language === 'hi'}
        onCheckedChange={toggleLanguage}
      />
      <Label htmlFor="lang-switch">हिन्दी</Label>
    </div>
  );
}