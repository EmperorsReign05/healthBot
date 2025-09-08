"use client"

import * as React from "react"

const TabsContext = React.createContext<{ selectedTab: string; setSelectedTab: (value: string) => void }>({
  selectedTab: "",
  setSelectedTab: () => {},
});

const Tabs = ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => {
  const [selectedTab, setSelectedTab] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>{children}</div>
);

const TabsTrigger = ({ children, value }: { children: React.ReactNode; value: string }) => {
  const { selectedTab, setSelectedTab } = React.useContext(TabsContext);
  const isActive = selectedTab === value;
  return (
    <button
      onClick={() => setSelectedTab(value)}
      style={{
        padding: '0.5rem 1rem',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
      }}
    >
      {children}
    </button>
  );
};

export { Tabs, TabsList, TabsTrigger }