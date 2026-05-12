"use client";

import { Button } from "@/components/ui/button";
import { Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { ActionsCell } from "../actions-cell";

// This type is used to define the shape of our data.
// You can use a Zo

export const columns: ColumnDef<
  Prisma.EventGetPayload<{ include: { dateRecord: true } }>
>[] = [
  {
    accessorKey: "eventName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "dateRecord.date",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return format(row.original.dateRecord.date, "dd MMM yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return <ActionsCell id={id} />;
    },
  },
];
