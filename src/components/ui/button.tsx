import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:shadow-intense hover:scale-105",
        destructive:
          "bg-destructive text-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-card-border bg-card text-foreground shadow-sm hover:bg-muted hover:shadow-glow",
        secondary:
          "bg-secondary text-secondary-foreground shadow-cyber hover:shadow-intense hover:scale-105",
        ghost: 
          "hover:bg-muted hover:text-foreground",
        link: 
          "text-primary hover:text-primary-glow underline-offset-4 hover:underline",
        hero:
          "bg-gradient-blockchain text-foreground border border-primary/20 shadow-glow hover:shadow-intense hover:scale-105 hover:border-primary/40",
        cyber:
          "bg-gradient-cyber text-foreground border border-secondary/20 shadow-cyber hover:shadow-intense hover:scale-105",
        accent:
          "bg-accent text-accent-foreground shadow-glow hover:shadow-intense hover:scale-105",
        glass:
          "bg-card/20 backdrop-blur-md border border-card-border text-foreground hover:bg-card/30 hover:shadow-glow"
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
