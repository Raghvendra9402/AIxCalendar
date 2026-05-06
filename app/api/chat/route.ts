import { prisma } from "@/lib/db";
import { getEmbeddings } from "@/lib/getEmbeddings";
import { vectorIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { toUIMessageStream } from "@ai-sdk/langchain";
import { LangChainAdapter } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 400 });
    }
    type Message = {
      role: "user" | "assistant";
      content: string;
    };
    const messages: Message[] = body.messages;

    const messageTruncated = messages.slice(-6);
    const latestMessage = messages[messages.length - 1]?.content || "";

    const textToEmbed = messageTruncated.map((msg) => msg.content).join("\n");
    const embedding = await getEmbeddings(textToEmbed);

    const vectorQueryResponse = await vectorIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    const eventId = vectorQueryResponse.matches.map((match) => match.id);
    const relevantEvents = await prisma.event.findMany({
      where: {
        id: { in: eventId },
      },
      include: {
        dateRecord: true,
      },
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a strict calendar assistant.

                  Your responsibilities:
                  - Answer ONLY using the provided event data
                  - DO NOT guess or fabricate any event
                  - If the event is not found, say exactly:
                    "I checked your calendar but couldn’t find that event."

                  Rules:
                  - Only use events from the "EVENTS" section
                  - Do NOT infer missing details
                  - Do NOT make assumptions
                  - Be concise and factual

                  When answering:
                  - Include event name and date if found
                  - Clearly state that the information comes from the calendar

                  If the user wants to create an event:
                  - Call the "create_event" tool

                  Current date: ${formattedDate}
                  Current time: ${formattedTime}

                  EVENTS:
                  {events}
                  `,
      ],
      ["user", "{input}"],
    ]);

    console.log("[CHAT_API_ROUTE] Creating event tool");
    const createEventTool = tool(
      async ({ eventName, eventDate }) => {
        console.log("[CHAT_API_ROUTE] Creating event:", eventName, eventDate);
        try {
          const eventTextEmbed = `Event Date: ${eventDate}\n\n Event Name : ${eventName}`;
          const eventEmbedding = await getEmbeddings(eventTextEmbed);
          const parsedDate = new Date(eventDate);
          const dateAsObject = new Date(parsedDate);
          const newEvent = await prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
              const dateRecord = await tx.dateRecord.upsert({
                where: { date: dateAsObject },
                update: {},
                create: { date: dateAsObject },
              });
              console.log("[DATERECORD from inside]", dateRecord);
              const createdEvent = await tx.event.create({
                data: {
                  eventName,
                  dateId: dateRecord.id,
                  userId,
                },
              });

              await vectorIndex.upsert([
                {
                  id: createdEvent.id,
                  values: eventEmbedding,
                  metadata: { userId },
                },
              ]);
              return { createdEvent, dateRecord };
            },
            { timeout: 10000 },
          );
          console.log("[DEBUG] Event creation result:", newEvent);
          return {
            success: true,
            data: newEvent,
            message: "Event created successfully!",
          };
        } catch (error) {
          console.log("[CREATE_EVENT_FUNCTION]", error);
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred.",
          };
        }
      },
      {
        name: "create_event",
        description: "creating a event for a particular date on a calendar",
        schema: z.object({
          eventName: z.string().describe("Name of the event"),
          eventDate: z.string().describe("Date of the event as ISO string"),
        }),
      },
    );

    const google = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-2.5-flash",
    }).bindTools([createEventTool]);

    const chain = prompt.pipe(google);
    const response = await chain.invoke({
      input: messageTruncated.map((m) => m.content).join("\n"),
      events: relevantEvents
        .map(
          (e) =>
            `Event Date : ${e.dateRecord.date}\n\n EventName: ${e.eventName}`,
        )
        .join("\n"),
    });
    console.log("[CHAT_API_ROUTE] Response streaming started");
    console.log("[Response]", response);

    if (response.tool_calls && response.tool_calls.length > 0) {
      for (const toolCall of response.tool_calls) {
        if (toolCall.name === "create_event") {
          const toolResult = await createEventTool.invoke(
            toolCall.args as { eventName: string; eventDate: string },
          );

          console.log(toolResult);

          const messagesWithToolResult = [
            new HumanMessage(latestMessage),
            response,
            new ToolMessage({
              tool_call_id: toolCall.id ?? "create_event",
              content: JSON.stringify(toolResult),
            }),
          ];

          const finalStream = await google.stream(messagesWithToolResult);
          return LangChainAdapter.toDataStreamResponse(finalStream);
        }
      }
    }

    const finalResponse = await chain.stream({
      input: messageTruncated.map((m) => m.content).join("\n"),
      events: relevantEvents
        .map(
          (e) =>
            `Event Date : ${e.dateRecord.date}\n\n EventName: ${e.eventName}`,
        )
        .join("\n"),
    });

    console.log("[CHAT_API_ROUTE] Response streaming started");
    console.log(finalResponse);

    return LangChainAdapter.toDataStreamResponse(finalResponse);
  } catch (error) {
    console.log("[CHAT_API_ROUTE]", error);
    return new NextResponse("Invalid error", { status: 500 });
  }
}
