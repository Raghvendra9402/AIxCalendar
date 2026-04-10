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
import { CalendarIcon, Loader2, Plus, X } from "lucide-react";
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
import { useQueryClient } from "@tanstack/react-query";
import GetEvents from "./get-events";

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
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
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
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["events", date.toISOString()],
      });
      router.refresh();
    } catch {
      toast.error("something went wrong");
    }
  }

  return (
    <>
      <div className="py-4 px-2 rounded-md mt-4 borded bg-slate-100">
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
      </div>
      <div className="py-4 px-2 overflow-scroll">
        {!isCreating && <GetEvents date={date} userId={userId} />}
      </div>
    </>
  );
}
