import * as React from "react"

// Main Card container
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`card ${className}`} // Uses the .card class from your globals.css
    {...props}
  />
))
Card.displayName = "Card"

// CardHeader component
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{ padding: "1.5rem 1.5rem 0 1.5rem" }} // Simple inline styles
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// CardTitle component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={className}
    style={{ fontSize: '1.25rem', fontWeight: '600' }}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// CardDescription component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={className}
    style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// CardContent component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={className}
    style={{ padding: "1.5rem" }}
    {...props}
  />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }