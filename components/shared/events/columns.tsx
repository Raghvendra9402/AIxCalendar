"use client";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Event, Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { EventForm } from "../event-form";
import { useDeleteEvent } from "@/hooks/useEvents";
import { DeleteDialog } from "../delete-event-dialog";

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
      const deleteEvent = useDeleteEvent();
      const handleDeleteEvent = (eventId: string) => {
        deleteEvent.mutate(eventId);
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogContent className="min-w-4xl max-h-125">
                <DialogHeader>
                  <DialogTitle>Edit listing</DialogTitle>
                </DialogHeader>
                event-form
              </DialogContent>
            </Dialog>
            <DeleteDialog onClick={() => handleDeleteEvent(id)}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
