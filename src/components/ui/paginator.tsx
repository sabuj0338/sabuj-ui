"use client"

import type { ReactNode } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ChevronFirst, ChevronLast } from "lucide-react"
import { useState, useCallback } from "react"

export type PaginatorProps = {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageChange: (pageNumber: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showPreviousNext?: boolean
  showFirstLast?: boolean
  showPageSizeSelector?: boolean
  showGoToPage?: boolean
  showItemCount?: boolean
  compact?: boolean
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void,
  siblingCount: number = 1
): ReactNode[] => {
  const pages: ReactNode[] = []

  const showPage = (page: number) => {
    if (page === 1 || page === totalPages) return true
    if (Math.abs(page - currentPage) <= siblingCount) return true
    return false
  }

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i} className="cursor-pointer">
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            size="sm"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pages
  }

  let lastShownPage = 0
  for (let i = 1; i <= totalPages; i++) {
    if (showPage(i)) {
      if (lastShownPage > 0 && i - lastShownPage > 1) {
        pages.push(
          <PaginationItem key={`ellipsis-${i}`}>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      pages.push(
        <PaginationItem key={i} className="cursor-pointer">
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
            size="sm"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
      lastShownPage = i
    }
  }

  return pages
}

export default function Paginator({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  onPageChange,
  onPageSizeChange,
  showPreviousNext = true,
  showFirstLast = false,
  showPageSizeSelector = false,
  showGoToPage = false,
  showItemCount = false,
  compact = false,
}: PaginatorProps) {
  const [goToPageValue, setGoToPageValue] = useState("")

  const isFirstPage = currentPage <= 1
  const isLastPage = currentPage >= totalPages

  const handlePreviousClick = useCallback(() => {
    if (!isFirstPage) onPageChange(currentPage - 1)
  }, [currentPage, isFirstPage, onPageChange])

  const handleNextClick = useCallback(() => {
    if (!isLastPage) onPageChange(currentPage + 1)
  }, [currentPage, isLastPage, onPageChange])

  const handleFirstClick = useCallback(() => {
    if (!isFirstPage) onPageChange(1)
  }, [isFirstPage, onPageChange])

  const handleLastClick = useCallback(() => {
    if (!isLastPage) onPageChange(totalPages)
  }, [isLastPage, totalPages, onPageChange])

  const handleGoToPage = useCallback(() => {
    const page = parseInt(goToPageValue, 10)
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page)
      setGoToPageValue("")
    }
  }, [goToPageValue, totalPages, onPageChange])

  const handleGoToPageKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleGoToPage()
    },
    [handleGoToPage]
  )

  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newPageSize = parseInt(value, 10)
      onPageSizeChange?.(newPageSize)
    },
    [onPageSizeChange]
  )

  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0

  if (totalPages <= 0) return null

  return (
    <div className="flex flex-wrap items-center gap-4">
      {showItemCount && totalItems !== undefined && (
        <div className="text-sm whitespace-nowrap text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{startItem}</span>
          {" - "}
          <span className="font-medium text-foreground">{endItem}</span>
          {" of "}
          <span className="font-medium text-foreground">{totalItems}</span>
          {" items"}
        </div>
      )}

      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="hidden text-sm whitespace-nowrap text-muted-foreground sm:inline">
            Rows per page
          </span>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="h-8 w-[70px]" size="sm">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          {showFirstLast && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFirstClick}
                disabled={isFirstPage}
                aria-label="Go to first page"
                className="h-8 w-8 p-0"
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}

          {showPreviousNext && (
            <PaginationItem
              className={isFirstPage ? "opacity-50" : "cursor-pointer"}
            >
              <PaginationPrevious
                onClick={isFirstPage ? undefined : handlePreviousClick}
                aria-disabled={isFirstPage}
                size="sm"
                className={isFirstPage ? "pointer-events-none" : ""}
              />
            </PaginationItem>
          )}

          {!compact && (
            <div className="hidden items-center sm:flex">
              {generatePaginationLinks(currentPage, totalPages, onPageChange)}
            </div>
          )}

          {compact && (
            <div className="px-3 text-sm whitespace-nowrap text-muted-foreground">
              Page{" "}
              <span className="font-medium text-foreground">{currentPage}</span>
              {" of "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </div>
          )}

          {!compact && (
            <div className="flex px-3 text-sm whitespace-nowrap text-muted-foreground sm:hidden">
              <span className="font-medium text-foreground">{currentPage}</span>
              {" / "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </div>
          )}

          {showPreviousNext && (
            <PaginationItem
              className={isLastPage ? "opacity-50" : "cursor-pointer"}
            >
              <PaginationNext
                onClick={isLastPage ? undefined : handleNextClick}
                aria-disabled={isLastPage}
                size="sm"
                className={isLastPage ? "pointer-events-none" : ""}
              />
            </PaginationItem>
          )}

          {showFirstLast && (
            <PaginationItem>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLastClick}
                disabled={isLastPage}
                aria-label="Go to last page"
                className="h-8 w-8 p-0"
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>

      {showGoToPage && (
        <div className="flex items-center gap-2">
          <span className="hidden text-sm whitespace-nowrap text-muted-foreground sm:inline">
            Go to page
          </span>
          <Input
            type="number"
            min={1}
            max={totalPages}
            value={goToPageValue}
            onChange={(e) => setGoToPageValue(e.target.value)}
            onKeyDown={handleGoToPageKeyDown}
            onBlur={handleGoToPage}
            placeholder={currentPage.toString()}
            className="h-8 w-16 text-center"
          />
        </div>
      )}
    </div>
  )
}
