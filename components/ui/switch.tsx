"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={`switch-root ${className}`}
    {...props}
    ref={ref}
    style={{
      position: 'relative',
      display: 'inline-flex',
      height: '24px',
      width: '44px',
      flexShrink: 0,
      cursor: 'pointer',
      alignItems: 'center',
      borderRadius: '9999px',
      border: '2px solid transparent',
      transition: 'background-color 0.2s',
      backgroundColor: 'var(--border)',
    }}
  >
    <SwitchPrimitives.Thumb
      className="switch-thumb"
      style={{
        pointerEvents: 'none',
        display: 'block',
        height: '20px',
        width: '20px',
        borderRadius: '9999px',
        backgroundColor: 'var(--background)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
        transform: 'translateX(2px)',
      }}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }