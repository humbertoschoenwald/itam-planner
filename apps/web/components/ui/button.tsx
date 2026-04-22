import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_92%,white),var(--accent))] text-accent-contrast shadow-[0_18px_38px_rgba(31,77,63,0.18)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(31,77,63,0.22)]",
        secondary:
          "border border-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-elevated)_98%,transparent),var(--surface))] text-foreground shadow-[0_10px_24px_rgba(30,34,22,0.05)] hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface-hover hover:shadow-[0_18px_32px_rgba(30,34,22,0.08)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
