import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        warning:
          "border-yellow-600 bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        secondary:
          "border-gray-500 bg-gray-100 text-gray-800 hover:bg-gray-200",
        success:
          "border-green-600 bg-green-100 text-green-800 hover:bg-green-200",
        destructive:
          "border-red-600 bg-red-100 text-red-800 hover:bg-red-200",
        outline:
          "border border-gray-400 text-foreground hover:bg-gray-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
