"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, SearchIcon, XIcon } from "lucide-react"
import React from "react"
import type { DateRange } from "react-day-picker"

export type FieldOption = {
  value: string
  label: string
}

export type FieldConfig<T extends Record<string, unknown>> = {
  key: keyof T
  label: string
  inputType: "text" | "date" | "select" | "daterange"
  // defaultValue?: string;
  options?: FieldOption[]
  placeholder?: string
  className?: string
}

interface DynamicSearchControlsProps<T extends Record<string, unknown>> {
  filters: T
  fieldConfigs: FieldConfig<T>[]
  onFilterInputChange: (field: keyof T, value: string) => void
  onSearch: () => void
  onReset: () => void
  isResetDisabled: boolean
  isLoading?: boolean
  children?: React.ReactNode
  defaultInputClassName?: string
}

export default function DynamicSearchControls<
  T extends Record<string, unknown>,
>({
  filters,
  fieldConfigs,
  onFilterInputChange,
  onSearch,
  onReset,
  isResetDisabled,
  isLoading,
  children,
  defaultInputClassName = "w-auto min-w-40 flex-1 md:flex-none", // Default class for inputs
}: DynamicSearchControlsProps<T>) {
  return (
    <>
      {/* <div className="flex flex-wrap w-full items-center gap-3"> */}
      {fieldConfigs.map((field) => {
        const fieldKey = field.key as string
        const fieldValue = filters[fieldKey] as string | undefined
        const inputClasses = cn(defaultInputClassName, field.className)

        switch (field.inputType) {
          case "text":
            return (
              <Input
                key={fieldKey}
                placeholder={field.placeholder || `Search by ${field.label}...`}
                value={fieldValue || ""}
                onChange={(e) => onFilterInputChange(field.key, e.target.value)}
                disabled={isLoading}
                className={inputClasses}
              />
            )
          case "date": {
            const currentDateValue = fieldValue
            let selectedDateObj: Date | undefined = undefined
            if (currentDateValue) {
              const parsedDate = new Date(currentDateValue)
              if (!isNaN(parsedDate.getTime())) {
                selectedDateObj = parsedDate
              }
            }

            return (
              <Popover key={fieldKey}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    disabled={isLoading}
                    className={cn(
                      inputClasses,
                      "justify-start bg-white text-left font-normal",
                      !selectedDateObj && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateObj
                      ? format(selectedDateObj, "PPP")
                      : field.placeholder ||
                        `Pick ${field.label.toLowerCase()}`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDateObj}
                    onSelect={(date) => {
                      if (date) {
                        onFilterInputChange(
                          field.key,
                          format(date, "yyyy-MM-dd")
                        )
                      } else {
                        onFilterInputChange(field.key, "") // Clear the date
                      }
                    }}
                    disabled={isLoading}
                  />
                </PopoverContent>
              </Popover>
            )
          }

          case "daterange": {
            const arr = fieldValue?.split(",")
            const date: DateRange = {
              from: arr?.[0] ? new Date(arr[0]) : undefined,
              to: arr?.[1] ? new Date(arr[1]) : undefined,
            }

            return (
              <Popover key={fieldKey}>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Search by a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(daterange) => {
                      const from = daterange?.from
                      const to = daterange?.to
                      if (from && to) {
                        const val = `${format(from, "yyyy-MM-dd")},${format(
                          to,
                          "yyyy-MM-dd"
                        )}`
                        onFilterInputChange(field.key, val)
                      } else {
                        onFilterInputChange(field.key, "") // Clear the date
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            )
          }
          case "select":
            return (
              <Select
                key={fieldKey + fieldValue}
                onValueChange={(value) => onFilterInputChange(field.key, value)}
                value={fieldValue || ""}
                disabled={isLoading}
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue
                    placeholder={
                      field.placeholder || `Select ${field.label.toLowerCase()}`
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{field.label}</SelectLabel>
                    {/* <SelectItem value={"-1"}>All</SelectItem> */}
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )
          default:
            return null
        }
      })}
      <Button type="button" onClick={onSearch} disabled={isLoading}>
        <SearchIcon />
      </Button>
      <Button
        type="button"
        onClick={onReset}
        variant="destructive"
        disabled={isResetDisabled || isLoading}
      >
        <XIcon />
      </Button>
      {children}
    </>
  )
}
