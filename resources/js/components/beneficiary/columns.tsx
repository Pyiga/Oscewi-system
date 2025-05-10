"use client";
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "@inertiajs/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { router } from "@inertiajs/react"
import { toast } from "react-hot-toast"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react"

// This type is used to define the shape of our beneficiary data.
export type Beneficiary = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  beneficiary_number: string | null;
  date_of_birth: string | null; // Or Date type if you handle date objects
  gender: string | null;
  address: string | null;
  nationality: string | null;
  health_background: string | null;
  father_name: string | null;
  father_contact: string | null;
  mother_name: string | null;
  mother_contact: string | null;
  guardian_name: string | null;
  guardian_contact: string | null;
  occupation: string | null;
  emergency_contact: string | null;
  supporting_documents: string | null; // Or perhaps an array of strings/objects
  profile_image: string | null;
};

export const columns: ColumnDef<Beneficiary>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },

    {
        id: "name", // Use a unique ID for columns that don't have a direct accessorKey
        header: " Name",
        cell: ({ row }) => {
          const firstName = row.original.first_name || "N/A";
          const lastName = row.original.last_name || "N/A";
          return `${firstName} ${lastName}`;
        },
    },
      
                                   
  {
    accessorKey: "beneficiary_number",

    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="ml-2 h-4 w-4 " />
            Beneficiary Number
          </Button>
        )
      },
  },
  {
    accessorKey: "date_of_birth",
    header: "Date of Birth",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "address",
    header: "Address",
  },

   {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const beneficiary = row.original

      const handleDelete = () => {
        router.delete(route('beneficiaries.destroy', beneficiary.id), {
          preserveScroll: true,
          onSuccess: () => {
            toast.success('Beneficiary deleted successfully!');
          },
          onError: (errors) => {
            toast.error('Failed to delete beneficiary. Please try again.');
          }
        });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={route('beneficiaries.show', beneficiary.id)}
                className="flex items-center cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={route('beneficiaries.edit', beneficiary.id)}
                className="flex items-center cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  // ...
]

