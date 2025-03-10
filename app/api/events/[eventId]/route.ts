import { prisma } from "@/lib/db";
import { vectorIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();
    const { eventId } = await params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { dateId: true },
    });

    if (!event) {
      return new NextResponse("No event found!!");
    }
    const deletedEvent = await prisma.$transaction(async (tx) => {
      const deletedEvent = await tx.event.delete({
        where: {
          id: eventId,
          userId,
        },
      });

      const remainingEvent = await prisma.event.findMany({
        where: { dateId: event.dateId },
      });

      if (remainingEvent.length === 0) {
        await tx.dateRecord.delete({
          where: { id: event.dateId },
        });
      }

      await vectorIndex.deleteOne(eventId);

      return deletedEvent;
    });
    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[DELETE_EVENT_API]", error);
    return new NextResponse("Invalid error", { status: 500 });
  }
}
