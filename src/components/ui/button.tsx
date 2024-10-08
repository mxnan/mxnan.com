import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-stone-950 dark:focus-visible:ring-stone-300",
  {
    variants: {
      variant: {
        default:
          "bg-stone-900 text-stone-50 hover:bg-stone-900/90 dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-50/90",
        destructive: "bg-lightone text-white dark:bg-darkone dark:text-gray-200 hover:bg-lightone/90 dark:hover:bg-darkone/90",
        
        secondary:
          "bg-gray-100 text-black hover:bg-gray-200 dark:bg-stone-900 dark:text-white dark:hover:bg-stone-800",
        ghost: "hover:bg-stone-200 dark:hover:bg-stone-800 ",
        link: "text-gray-600 dark:text-gray-500 ",
      },
      size: {
        default: "rounded-xl px-3 py-2",
        sm: "px-3 py-2",
       
        link: "px-2 pb-2 pt-1",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
