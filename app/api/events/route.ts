import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const userId = url.searchParams.get("userId");

    if (!dateParam || !userId) {
      return new NextResponse("invalid parameters", { status: 400 });
    }

    const date = new Date(dateParam);
    const events = await prisma.event.findMany({
      where: {
        date: {
          date: date,
        },
        userId,
      },
      include: {
        date: true,
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.log("[GET_EVENTS_API]", error);
    return new NextResponse("Invalid request", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { eventDate, eventNames } = await req.json();
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.log(eventNames);

    const dateRecord = await prisma.date.upsert({
      where: {
        date: new Date(eventDate),
      },
      update: {},
      create: {
        date: new Date(eventDate),
      },
    });
    const createdEvents = await prisma.event.createMany({
      data: eventNames.map((eventName: string) => ({
        eventName: eventName,
        userId,
        dateId: dateRecord.id,
      })),
    });

    return NextResponse.json(createdEvents);
  } catch (error) {
    console.log("[EVENTS_API]", error);
    return new NextResponse("Invalid error");
  }
}
