import { prisma } from "./db";

export async function FindEvents(date: Date, userId: string) {
  const events = await prisma.event.findMany({
    where: {
      date: {
        date,
      },
      userId,
    },
  });

  return events;
}
