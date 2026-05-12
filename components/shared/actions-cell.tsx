"use client";

import { Button } from "@/components/ui/button";
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
import { useDeleteEvent } from "@/hooks/useEvents";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeleteDialog } from "./delete-event-dialog";

export function ActionsCell({ id }: { id: string }) {
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
}
