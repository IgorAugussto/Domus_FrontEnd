import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",
        navActive: 'bg-white text-blue-600 shadow-sm hover:bg-white rounded-xl',
        ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        
        navButton: `
          bg-white/10
          text-white
          font-medium
          border-2 border-white/30
          rounded-full
          backdrop-blur-sm
          hover:bg-white/20
          hover:border-white/50
          active:translate-y-0.5
          active:shadow-inner
          transition-all duration-200`,

        navButtonActive: `
          bg-white/25
          text-white
          font-bold
          border-2 border-white/60
          rounded-full
          backdrop-blur-sm
          shadow-lg
          translate-y-0.5
          shadow-inner
          ring-4 ring-white/20
          transition-all duration-200`,

        navActiveDashboard:`
          bg-blue-500/20
          border-blue-400/60 
          text-white 
          font-medium 
          shadow-inner 
          rounded-full 
          backdrop-blur-sm 
          translate-y-0.5 
          ring-2 ring-blue-400/30`,
        navActiveIncome: `
          bg-green-500/20 
          border-green-400/60 
          text-white 
          font-medium 
          shadow-inner 
          rounded-full 
          backdrop-blur-sm 
          translate-y-0.5 
          ring-2 
          ring-green-400/30`,
        navActiveExpenses:`
          bg-red-500/20 
          border-red-400/60 
          text-white 
          font-medium 
          shadow-inner 
          rounded-full 
          backdrop-blur-sm 
          translate-y-0.5 
          ring-2 
          ring-red-400/30`,
        navActiveInvestments:`
          bg-amber-500/20 
          border-amber-400/60 
          text-white 
          font-medium 
          shadow-inner 
          rounded-full 
          backdrop-blur-sm 
          translate-y-0.5 
          ring-2 
          ring-amber-400/30`,
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
