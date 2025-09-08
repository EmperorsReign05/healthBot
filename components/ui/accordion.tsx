"use client"

import * as React from "react"

// A context to share the selected item between accordion components
const AccordionContext = React.createContext<{
  selected: string | null;
  setSelected: (value: string | null) => void;
}>({
  selected: null,
  setSelected: () => {},
});

// The main Accordion container
const Accordion = ({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) => {
  const [selected, setSelected] = React.useState<string | null>(defaultValue || null);
  return (
    <AccordionContext.Provider value={{ selected, setSelected }}>
      <div style={{ borderTop: '1px solid var(--border)' }}>{children}</div>
    </AccordionContext.Provider>
  );
};

// Represents a single item in the accordion
const AccordionItem = ({ children, value }: { children: React.ReactNode; value: string }) => (
  <div style={{ borderBottom: '1px solid var(--border)' }}>
    {React.Children.map(children, child =>
      React.isValidElement(child) ? React.cloneElement(child, { value } as React.Attributes) : child
    )}
  </div>
);

// The part of the item that is always visible and clickable
const AccordionTrigger = ({ children, value }: { children: React.ReactNode; value?: string }) => {
  const { selected, setSelected } = React.useContext(AccordionContext);
  const isOpen = selected === value;
  return (
    <button
      onClick={() => setSelected(isOpen ? null : value || null)}
      style={{
        width: '100%',
        padding: '1rem',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        fontWeight: '600',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {children}
      <span style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>+</span>
    </button>
  );
};

// The content part that is hidden or shown
const AccordionContent = ({ children, value }: { children: React.ReactNode; value?: string }) => {
  const { selected } = React.useContext(AccordionContext);
  const isOpen = selected === value;
  return isOpen ? <div style={{ padding: '0 1rem 1rem 1rem' }}>{children}</div> : null;
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }