import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  type Updater,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, toBengaliNumerals } from "@/lib/utils"
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react"
import Paginator, { type PaginatorProps } from "./paginator"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  pagination?: PaginatorProps
  isLoading?: boolean

  sorting?: SortingState
  setSorting?: (data: SortingState) => void
  onRowClick?: (row: TData) => void
  rowLink?: string
  headerTopRounded?: boolean
  emptyComponent?: React.ReactNode
  className?: string

  locale?: string
  noDataFoundText?: string
  rowsSelectedText?: string
  ofText?: string
}

export default function DataTable<
  TData extends { id: string | number },
  TValue,
>({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
  pagination,
  isLoading,
  sorting,
  setSorting,
  onRowClick,
  rowLink,
  headerTopRounded,
  emptyComponent,
  className,
  locale = "en",
  noDataFoundText = "No data found",
  rowsSelectedText = "rows selected",
  ofText = "of",
}: DataTableProps<TData, TValue>) {
  const onSortingChange = (updater: Updater<SortingState>) => {
    if (setSorting === undefined) return
    if (typeof updater === "function") {
      // If `updater` is a function, call it with the current `sorting` state
      // (or an empty array if `sorting` is undefined) to get the new state.
      setSorting(updater(sorting || []))
    } else {
      // If `updater` is already a `SortingState` value, pass it directly.
      setSorting(updater)
    }
  }

  const table = useReactTable({
    data: data || [],
    columns,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    enableSorting: !!sorting,
    manualSorting: true,
    enableSortingRemoval: false,
    onSortingChange: onSortingChange,

    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: onRowSelectionChange,
    manualPagination: true,
    state: {
      rowSelection: rowSelection || {},
      sorting: sorting,
      columnPinning: {
        left: ["select-col"], // pin `name` column to the left
        right: ["actions"], // or ['actions'] if you want right pinned
      },
    },
  })

  const isPinnedHLeft = (column: Column<TData, unknown>) => {
    const r = table.getState().columnPinning.left?.includes(column.id)
    return r ? `sticky left-0 ${headerTopRounded ? "rounded-tl-xl" : ""}` : ""
  }

  const isPinnedHRight = (column: Column<TData, unknown>) => {
    const r = table.getState().columnPinning.right?.includes(column.id)
    return r
      ? `sticky min-w-auto right-0 ${headerTopRounded ? "rounded-tr-xl" : ""}`
      : ""
  }

  const isPinnedLeft = (column: Column<TData, unknown>) => {
    const r = table.getState().columnPinning.left?.includes(column.id)
    return r ? "sticky left-0 z-11" : ""
  }

  const isPinnedRight = (column: Column<TData, unknown>) => {
    const r = table.getState().columnPinning.right?.includes(column.id)
    return r ? "sticky right-0 z-11" : ""
  }

  const getSortingArrowIcon = (sort: string | boolean) => {
    switch (sort) {
      case "asc":
        return <ArrowDown className="ml-1 inline h-4 w-4" />
      case "desc":
        return <ArrowUp className="ml-1 inline h-4 w-4" />
      default:
        return <ArrowDown className="ml-1 inline h-4 w-4" />
    }
  }

  return (
    <>
      {/* Scrollable table area */}
      <Table
        containerClassName={cn(
          "min-h-0 flex-1 overflow-auto",
          className
        )}
        style={{
          tableLayout: "fixed",
        }}
      >
        <TableHeader className="sticky top-0 z-12 bg-muted dark:bg-zinc-900">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "px-2 font-bold",
                      isPinnedHRight(header.column),
                      isPinnedHLeft(header.column),
                      {
                        "cursor-pointer select-none":
                          header.column.getCanSort(),
                        "first:rounded-tl-xl last:rounded-tr-xl":
                          headerTopRounded,
                      }
                    )}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                    title={
                      { asc: "Sort Ascending", desc: "Sort Descending" }[
                      header.column.getNextSortingOrder() as string
                      ]
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {/* Sort Icon Logic */}
                        {!!sorting &&
                          header.column.getCanSort() &&
                          getSortingArrowIcon(header.column.getIsSorted())}
                      </>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length !== 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick?.(row.original)}
                className={cn("relative h-14.5 bg-background", {
                  "cursor-pointer": !!onRowClick,
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "wrap-break-words relative p-2",
                      isPinnedRight(cell.column),
                      isPinnedLeft(cell.column)
                    )}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.columnDef.minSize,
                      maxWidth: cell.column.columnDef.maxSize,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

                {/* Invisible link that covers the entire row */}
                {rowLink && (
                  <td className="absolute inset-0 z-10">
                    <a
                      href={rowLink.replace(
                        "_link_",
                        row.original.id.toString()
                      )}
                      className="block h-full w-full"
                      aria-label={`View ${row.original.id}`}
                    />
                  </td>
                )}
              </TableRow>
            ))}
          {table.getRowModel().rows.length === 0 && !isLoading && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-14.5 bg-background text-center text-muted-foreground"
              >
                {emptyComponent || noDataFoundText}
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-14.5 bg-background text-center"
              >
                <Loader2 className="mx-auto animate-spin text-[#16A34A]" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Fixed pagination footer */}
      {pagination && (
        <div className="flex flex-col items-start justify-between space-y-2 border-t px-2 pt-10 md:items-center xl:flex-row xl:space-y-0">
          <div className="flex-1 text-sm text-muted-foreground">
            <span className="font-sans">
              {locale === "bn"
                ? toBengaliNumerals(pagination?.totalItems?.toString() || "০")
                : pagination.totalItems}
            </span>{" "}
            {ofText}{" "}
            <span className="font-sans">
              {locale === "bn"
                ? toBengaliNumerals(
                  table.getFilteredRowModel().rows.length.toString()
                )
                : table.getFilteredRowModel().rows.length}
            </span>{" "}
            {rowsSelectedText}
          </div>
          <Paginator {...pagination} />
        </div>
      )}
    </>
  )
}
