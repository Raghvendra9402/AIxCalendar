"use client";

import kyInstance from "@/lib/kyInstance";
import { Event } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, TriangleAlert, X } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardFooter } from "../ui/card";
import { eventNames } from "process";
import { DeleteDialog } from "./delete-event-dialog";
import { ReminderDialog } from "./reminder-dialog";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface EventFormProps {
  date: Date;
  userId: string;
}

export default function GetEvents({ date, userId }: EventFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: events, status } = useQuery<Event[]>({
    queryKey: ["events", date.toISOString()],
    queryFn: async () => {
      const data = await kyInstance
        .get(`/api/events?date=${date.toISOString()}`)
        .json<Event[]>();
      console.log("API response:", data);
      return data ?? [];
    },
  });

  console.log("Events: ", events);

  async function handleDelete(eventId: string) {
    try {
      await axios.delete(`/api/events/${eventId}`);
      toast.success("event deleted");
      queryClient.invalidateQueries({
        queryKey: ["events", date.toISOString()],
      });
      router.refresh();
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
    <div className="flex flex-col gap-1 mt-2">
      {events.map((event) => (
        <Card key={event.id} className="transition-all hover:shadow-lg">
          <CardContent className="p-3 flex flex-col gap-1">
            <div className="flex flex-1 items-center justify-between">
              <h3 className="text-md font-medium text-gray-900">
                {event.eventName}
              </h3>
              <DeleteDialog onClick={() => handleDelete(event.id)}>
                <Button size="icon">
                  <X className="w-4 h-4" />
                </Button>
              </DeleteDialog>
            </div>
            <ReminderDialog
              date={date}
              eventName={event.eventName}
              initialData={event}
            >
              <p className="text-xs text-neutral-500 italic tracking-wide cursor-pointer">
                Click to add reminders
              </p>
            </ReminderDialog>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
