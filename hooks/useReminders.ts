import kyInstance from "@/lib/kyInstance";
import { Prisma, Reminder } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useGetReminders(eventId: string) {
  return useQuery({
    queryKey: ["reminders"],
    queryFn: async () => {
      const data = await kyInstance
        .get(`/api/events/${eventId}/reminders?eventId=${eventId}`)
        .json<Reminder[]>();
      return data ?? [];
    },
  });
}

export function useCreateReminder(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      date: Date;
      title: string;
      email: string;
    }) => {
      const data = await kyInstance
        .post(`/api/events/${eventId}/reminders`, { json: payload })
        .json<Reminder>();
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder set");
    },
    onError: () => toast.error("Something went wrong"),
  });
}

export function useDeleteReminder(eventId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: string) => {
      await kyInstance.delete(`/api/events/${eventId}/reminders/${reminderId}`);
    },
    onSuccess: () => {
      toast.success("Reminder deleted");
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
    onError: () => toast.error("Something went wrong"),
  });
}
