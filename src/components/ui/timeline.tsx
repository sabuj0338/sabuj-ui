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
      data-orientation={orientation}
      className={cn(timelineVariants({ orientation }), "group", className)}
      {...props}
    />
  )
}

function TimelineItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-item"
      className={cn(
        "flex flex-col items-center gap-1 group-data-[orientation=vertical]:flex-row group-data-[orientation=vertical]:items-center group-data-[orientation=vertical]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const timelineIndicatorVariants = cva(
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border p-[3px] text-current transition-colors",
  {
    variants: {
      status: {
        default: "border-border bg-background text-muted-foreground",
        completed: "border-primary bg-primary text-primary-foreground",
        current: "border-primary bg-background text-primary",
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
}: React.ComponentProps<"div"> &
  VariantProps<typeof timelineIndicatorVariants>) {
  return (
    <div
      data-slot="timeline-indicator"
      className={cn(timelineIndicatorVariants({ status }), className)}
      {...props}
    />
  )
}

const timelineTitleVariants = cva(
  "text-center text-xs text-nowrap transition-colors group-data-[orientation=vertical]:text-left",
  {
    variants: {
      status: {
        default: "font-medium text-muted-foreground",
        completed: "font-bold text-foreground",
        current: "font-bold text-primary",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

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

const timelineSeparatorVariants = cva(
  "mx-1 mt-3 flex h-px flex-1 shrink-0 self-start transition-colors group-data-[orientation=vertical]:mx-0 group-data-[orientation=vertical]:my-1 group-data-[orientation=vertical]:ml-3 group-data-[orientation=vertical]:h-8 group-data-[orientation=vertical]:w-px group-data-[orientation=vertical]:flex-none",
  {
    variants: {
      status: {
        default: "bg-border",
        completed: "bg-primary",
        current: "bg-primary/40",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

function TimelineSeparator({
  className,
  status,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof timelineSeparatorVariants>) {
  return (
    <div
      data-slot="timeline-separator"
      className={cn(timelineSeparatorVariants({ status }), className)}
      {...props}
    />
  )
}

export {
  Timeline,
  TimelineIndicator,
  timelineIndicatorVariants,
  TimelineItem,
  TimelineSeparator,
  timelineSeparatorVariants,
  TimelineTitle,
  timelineTitleVariants,
  timelineVariants,
}
