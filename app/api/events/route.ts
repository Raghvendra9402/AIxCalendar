import { prisma } from "@/lib/db";
import { getEmbeddings } from "@/lib/getEmbeddings";
import { vectorIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const { userId } = await auth();

    if (!dateParam || !userId) {
      return new NextResponse("invalid parameters", { status: 400 });
    }

    const date = new Date(dateParam);
    const events = await prisma.event.findMany({
      where: {
        userId,
        dateRecord: {
          date: date,
        },
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
    const parsedDate = new Date(eventDate);
    const textToEmbed = `Event Date : ${eventDate}\n\n Event Name : ${eventNames[0]}`;
    const embedding = await getEmbeddings(textToEmbed);

    const newEvent = await prisma.$transaction(
      async (tx) => {
        const dateRecord = await tx.dateRecord.upsert({
          where: { date: parsedDate },
          update: {},
          create: { date: parsedDate },
        });

        const newEvent = await tx.event.create({
          data: {
            eventName: eventNames[0],
            dateId: dateRecord.id,
            userId,
          },
        });

        await vectorIndex.upsert([
          {
            id: newEvent.id,
            values: embedding,
            metadata: { userId },
          },
        ]);
        return newEvent;
      },
      { timeout: 10000 }
    );
    return NextResponse.json(newEvent);
  } catch (error) {
    console.log("[FILES_ROUTE]", error);
    return new NextResponse("Invalid error", { status: 500 });
  }
}
