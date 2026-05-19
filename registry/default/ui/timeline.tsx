import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const timelineVariants = cva("flex w-full items-start", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

function Timeline({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof timelineVariants>) {
  return (
    <div
      data-slot="timeline"
      className={cn(timelineVariants({ orientation }), className)}
      {...props}
    />
  )
}

function TimelineItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-item"
      className={cn("flex flex-col items-center gap-1", className)}
      {...props}
    />
  )
}

const timelineIndicatorVariants = cva(
  "w-6 h-6 p-[3px] flex items-center justify-center rounded-full border shrink-0 text-current",
  {
    variants: {
      status: {
        default: "text-[#A3A3A3] border-border bg-background",
        completed: "bg-[#16A34A] border-[#16A34A] text-white",
        current: "border-[#16A34A] text-[#16A34A] bg-background",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

function TimelineIndicator({
  className,
  status,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof timelineIndicatorVariants>) {
  return (
    <div
      data-slot="timeline-indicator"
      className={cn(timelineIndicatorVariants({ status }), className)}
      {...props}
    />
  )
}

const timelineTitleVariants = cva("text-xs text-nowrap text-center", {
  variants: {
    status: {
      default: "text-gray-900 font-normal",
      completed: "text-[#16A34A] font-bold",
      current: "text-[#16A34A] font-bold",
    },
  },
  defaultVariants: {
    status: "default",
  },
})

function TimelineTitle({
  className,
  status,
  ...props
}: React.ComponentProps<"p"> & VariantProps<typeof timelineTitleVariants>) {
  return (
    <p
      data-slot="timeline-title"
      className={cn(timelineTitleVariants({ status }), className)}
      {...props}
    />
  )
}

function TimelineSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-separator"
      className={cn("h-[1px] bg-[#A3A3A3] shrink-0 flex-1 mx-1 flex self-start mt-3 data-[orientation=vertical]:h-auto data-[orientation=vertical]:w-[1px] data-[orientation=vertical]:mx-0 data-[orientation=vertical]:my-2 data-[orientation=vertical]:ml-3", className)}
      {...props}
    />
  )
}

export {
  Timeline, TimelineIndicator, timelineIndicatorVariants, TimelineItem, TimelineSeparator, TimelineTitle, timelineTitleVariants, timelineVariants
}

