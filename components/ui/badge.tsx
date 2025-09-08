import * as React from "react"

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant, ...props }: BadgeProps) {
  // Basic styling is handled by the 'badge' class in globals.css
  // Variant-specific styles can be added here if needed
  return (
    <div className={`badge ${variant ? `badge-${variant}` : ''} ${className}`} {...props} />
  )
}

export { Badge }