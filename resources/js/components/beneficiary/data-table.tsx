"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Trash2, FileDown } from "lucide-react"; // Import icons
import {
  ColumnDef,
  FilterFn, // Import FilterFn type
  ColumnFiltersState,
  getFilteredRowModel,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Beneficiary } from "./columns"; // Import Beneficiary type

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDeleteSelected?: (selectedIds: string[]) => void;
  onExportSelected?: (selectedData: TData[]) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDeleteSelected,
  onExportSelected,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [beneficiaryNumberError, setBeneficiaryNumberError] = React.useState<string>('');

  // Custom global filter function
  const globalFilterFn: FilterFn<TData> = (row, columnId, filterValue, addMeta) => {
    const value = String(filterValue).toLowerCase();
    const beneficiary = row.original as Beneficiary;

    return (
      (beneficiary.first_name?.toLowerCase().includes(value) ?? false) ||
      (beneficiary.last_name?.toLowerCase().includes(value) ?? false) ||
      (beneficiary.beneficiary_number?.toLowerCase().includes(value) ?? false) ||
      (beneficiary.address?.toLowerCase().includes(value) ?? false) ||
      (beneficiary.gender?.toLowerCase().includes(value) ?? false)
    );
  };

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: globalFilterFn,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true, // Enable manual pagination
    pageCount: totalPages,
  });

  const handleDelete = () => {
    const selectedIds = table.getFilteredSelectedRowModel().rows.map(row => (row.original as Beneficiary).id);
    onDeleteSelected?.(selectedIds);
    setShowDeleteDialog(false);
  };

  return (
    <div className="w-full px-2 py-2 bg-white dark:bg-black text-black dark:text-white rounded-lg shadow-md border border-[#008080]/20">
      <div className="flex flex-col sm:flex-row items-center py-4 gap-2">
        <Input
          placeholder="Filter by name, number, address, gender..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full sm:max-w-sm border-[#008080]/20 focus:border-[#008080] focus:ring-[#008080]/20"
        />
        <div className="flex flex-wrap gap-2 ml-auto">
          {onDeleteSelected && (
            <>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-600 hover:bg-red-700"
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete 
              </Button>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the selected beneficiaries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          {onExportSelected && (
            <Button
              variant="outline"
              size="sm"
              className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition-colors duration-200"
              disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              onClick={() => onExportSelected(table.getSelectedRowModel().rows.map(row => row.original))}
            >
              <FileDown className="mr-2 h-4 w-4" /> Export(Pdf)
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition-colors duration-200"
              >
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border border-[#008080]/20 overflow-x-auto">
        <Table className="bg-white dark:bg-black text-black dark:text-white">
          <TableHeader className="bg-[#008080]/5">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-[#008080] font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white dark:bg-black text-blaclk dark:text-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-[#008080]/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {totalItems} row(s) selected.
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition-colors duration-200"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition-colors duration-200"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}