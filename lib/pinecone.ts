import { Pinecone } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_API_KEY) {
  throw new Error("Invalid pinecone key");
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export const vectorIndex = pc.Index(process.env.PINECONE_INDEX!);
