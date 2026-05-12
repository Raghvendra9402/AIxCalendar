"use client";

import kyInstance from "@/lib/kyInstance";
import { Event } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { Loader2, TriangleAlert, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DeleteDialog } from "./delete-event-dialog";
import { ReminderDialog } from "./reminder-dialog";

interface EventFormProps {
  date: Date;
}

export default function GetEvents({ date }: EventFormProps) {
  const queryClient = useQueryClient();
  const { data: events, status } = useQuery<Event[]>({
    queryKey: ["events", format(date, "yyyy-MM-dd")],
    queryFn: async () => {
      const data = await kyInstance
        .get(`/api/events?date=${format(date, "yyyy-MM-dd")}`)
        .json<Event[]>();
      console.log("API response:", data);
      return data ?? [];
    },
  });

  console.log("Events: ", events);

  async function handleDelete(eventId: string) {
    try {
      await axios.delete(`/api/events/${eventId}`);

      await queryClient.invalidateQueries({
        queryKey: ["events", format(date, "yyyy-MM-dd")],
      });
      await queryClient.invalidateQueries({
        queryKey: ["month-events"], // ✅ refreshes calendar tiles too
      });
      toast.success("event deleted");
    } catch {
      toast.error("something went wrong");
    }
  }

  if (status === "pending") {
    return (
      <div className="h-full flex flex-col gap-1 items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
        <p className="text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="h-full flex flex-col gap-1 items-center justify-center">
        <TriangleAlert className="size-4 text-rose-500" />
        <p>An error occured while getting events</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500 italic text-sm">No events yet...</p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {events.map((event) => (
        <Card
          key={event.id}
          className="border bg-card transition-all hover:shadow-md"
        >
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {event.eventName}
                </h3>
              </div>

              <DeleteDialog onClick={() => handleDelete(event.id)}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DeleteDialog>
            </div>

            <ReminderDialog
              date={date}
              eventName={event.eventName}
              initialData={event}
            >
              <button
                type="button"
                className="w-fit text-xs font-medium tracking-wide text-primary transition-colors hover:underline"
              >
                Add reminders
              </button>
            </ReminderDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
