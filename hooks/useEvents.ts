import kyInstance from "@/lib/kyInstance";
import { Prisma } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useMonthEvents() {
  return useQuery({
    queryKey: ["month-events"],
    queryFn: async () => {
      const data = await kyInstance.get("/api/events/all").json<
        Prisma.DateRecordGetPayload<{
          include: {
            events: true;
          };
        }>[]
      >();
      return data ?? [];
    },
  });
}

export function useDeleteEvent() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (eventId: string) => {
      await kyInstance.delete(`/api/events/${eventId}`);
    },
    onSuccess: () => {
      toast.success("Event deleted from calendar");
      router.refresh();
    },
    onError: (err) => {
      toast.error(`Something went wrong: ${err.message}`);
    },
  });
}
