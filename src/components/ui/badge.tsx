import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border- bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        inProgress: "border-blue-500/30 bg-blue-500/10 text-blue-500",
        readyForPrinting: "border-yellow-400/30 bg-yellow-400/20 text-yellow-500",
        partiallyPrinted: "border-orange-500/30 bg-orange-500/20 text-orange-500",
        issues: "border-red-500/30 bg-red-500/20 text-red-500",
        completed: "border-green-500/30 bg-green-500/20 text-green-500",
        notStarted: "border-gray-500/30 bg-gray-500/10 text-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }




// In Progress: When registration is ongoing and IDs are being processed.
// Ready for Printing: When registration is complete and IDs are ready to be printed.
// Partially Printed: When some IDs have been printed but not all.
// Issues: When there are problems or delays in the registration or printing process.
// Completed: Synonym for "Printed," indicating all IDs in the barangay are done.
// Not Started: No registration activities have begun for the barangay.