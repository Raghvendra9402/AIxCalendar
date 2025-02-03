import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedEvent = await prisma.event.delete({
      where: {
        id: params.eventId,
        userId,
      },
    });

    return NextResponse.json(deletedEvent);
  } catch (error) {
    console.log("[DELETE_EVENT_API]", error);
    return new NextResponse("Invalid error", { status: 500 });
  }
}
