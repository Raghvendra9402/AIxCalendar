"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Event } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "../ui/card";
import { eventNames } from "process";
import { DeleteDialog } from "./delete-event-dialog";
import { ReminderDialog } from "./reminder-dialog";

const formSchema = z.object({
  eventDate: z.date(),
  eventName: z.string().min(1, {
    message: "event required",
  }),
});

interface EventFormProps {
  date: Date;

  userId: string;
}

export function EventForm({ date, userId }: EventFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const toggleCreating = () => setIsCreating(!isCreating);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventDate: date!,
      eventName: "",
    },
  });
  const { isValid, isSubmitting } = form.formState;
  React.useEffect(() => {
    if (isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const eventData = {
        eventDate: values.eventDate,
        eventNames: [values.eventName],
      };
      await axios.post("/api/events", eventData);
      toast.success("event created");

      toggleCreating();
      await getEvents();
      router.refresh();
      form.reset();
    } catch {
      toast.error("something went wrong");
    }
  }

  async function getEvents() {
    try {
      const response = await axios.get(
        `/api/events?date=${date.toISOString()}`
      );
      setEvents(response.data);
      router.refresh();
    } catch {
      toast.error("something went wrong");
    }
  }
  async function handledelete(eventId: string) {
    try {
      await axios.delete(`/api/events/${eventId}`);
      toast.success("event deleted");
      router.refresh();
      await getEvents();
    } catch {
      toast.error("something went wrong");
    }
  }
  React.useEffect(() => {
    getEvents();
  }, [date, userId]);

  return (
    <div className="p-2 rounded-md mt-4 borded bg-slate-100">
      <div className="font-medium flex items-center justify-between">
        <h2>Events for {format(date, "PPP")}</h2>
        <Button size={"sm"} variant={"ghost"} onClick={toggleCreating}>
          {!isCreating ? (
            <>
              <Plus className="w-4 h-4" />
              Add Event
            </>
          ) : (
            <>Cancel</>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem className="mb-6 sr-only">
                  <FormControl>
                    <span className="inline-flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {field.value && format(field.value, "PPP")}
                    </span>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write event name..."
                        {...field}
                        disabled={isSubmitting}
                        ref={inputRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !events.length && "text-slate-500 italic"
          )}
        >
          {!events.length && "No events yet..."}
          {events.map((event) => (
            <Card
              key={event.id}
              className="transition-all hover:shadow-lg mb-1"
            >
              <CardContent className="p-3 flex flex-col gap-1">
                <div className="flex flex-1 items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">
                    {event.eventName}
                  </h3>
                  <DeleteDialog onClick={() => handledelete(event.id)}>
                    <Button
                      size={"icon"}
                      className=" flex items-center justify-center"
                    >
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
      )}
    </div>
  );
}
