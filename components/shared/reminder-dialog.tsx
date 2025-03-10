"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { eventNames } from "process";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";
import { Event, Reminder } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2, Pencil, Plus, X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { DeleteDialog } from "./delete-event-dialog";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string(),
  title: z.string(),
  hour: z.string(),
  minute: z.string(),
});

interface ReminderDialogProps {
  children: React.ReactNode;
  date: Date;
  eventName: string;
  initialData: Event;
}

export function ReminderDialog({
  children,
  date,
  eventName,
  initialData,
}: ReminderDialogProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  if (!userEmail) {
    toast.error("email not found");
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      title: eventName ?? "New Reminder",
      hour: "12",
      minute: "00",
    },
  });

  const toggleCreating = () => {
    setIsCreating(!isCreating);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    date.setHours(Number(values.hour));
    date.setMinutes(Number(values.minute));
    const payload = { date, title: values.title, email: userEmail };
    try {
      console.log(payload);
      await axios.post(`/api/events/${initialData.id}/reminders`, payload);
      toast.success("Reminder set");
      toggleCreating();
      router.refresh();
      await getReminders();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  async function getReminders() {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/events/${initialData.id}/reminders?eventId=${initialData.id}`
      );
      setReminders(response.data);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(reminderId: string) {
    try {
      await axios.delete(
        `/api/events/${initialData.id}/reminders/${reminderId}`
      );

      toast.success("Reminder deleted");
      router.refresh();
      await getReminders();
    } catch (error) {
      toast.error("something went wrong");
    }
  }

  React.useEffect(() => {
    getReminders();
  }, [initialData.id]);

  const showDate = format(date, "PPP");

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[550px]">
          <DialogHeader className="my-6">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-medium text-gray-900 mb-2">
                Set Reminder for{" "}
                <span className="font-bold text-primary">{showDate}</span>
              </DialogTitle>

              {isCreating ? (
                <div
                  onClick={toggleCreating}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors cursor-pointer px-3 py-1 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </div>
              ) : (
                <Button
                  variant={"ghost"}
                  className="flex items-center text-sm  text-gray-500 hover:text-gray-700 transition-colors cursor-pointer px-3 py-1 rounded-md hover:bg-gray-100"
                  onClick={toggleCreating}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              )}
            </div>
            <DialogDescription className="text-sm text-gray-500 mt-3">
              {isCreating
                ? "Choose time for your reminder (must be in the future from the current date and time)"
                : "Reminder list"}
            </DialogDescription>
          </DialogHeader>
          {isCreating && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registered email</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="Enter reminder title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Title</FormLabel>
                        <FormControl>
                          <Input
                            disabled
                            placeholder="Enter reminder title"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex space-x-4 mt-4">
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hour</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString().padStart(2, "0")}
                              >
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minute</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Minute" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={i.toString().padStart(2, "0")}
                              >
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full mt-4">
                  Add Reminder
                </Button>
              </form>
            </Form>
          )}
          {!isCreating && reminders.length === 0 && (
            <p className="text-slate-500 italic">No reminders yet...</p>
          )}
          {!isCreating &&
            reminders.map((reminder) => (
              <Card
                key={reminder.id}
                className="p-1 transition-all hover:shadow-lg mb-1"
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-x-4">
                      <h1 className="text-md font-medium text-gray-900">
                        {reminder.reminderTitle}
                      </h1>
                      <Badge
                        className={cn(
                          "p-1 font-medium italic",
                          reminder.reminderStatus === true
                            ? "bg-emerald-500 hover:bg-emerald-500"
                            : "bg-red-600  hover:bg-red-600"
                        )}
                      >
                        {reminder.reminderStatus === true
                          ? "Pending"
                          : "Expired"}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400">
                      {format(reminder.remindAt, "PPP p")}
                    </span>
                  </div>
                  <div>
                    <DeleteDialog onClick={() => handleDelete(reminder.id)}>
                      <Button
                        type="button"
                        size={"icon"}
                        className="flex justify-center items-center"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </DeleteDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
}
