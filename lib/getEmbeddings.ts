import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("invalid gemini key");
}

export async function getEmbeddings(input: string) {
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY!,
    model: "gemini-embedding-001",
  });
  const embedding = await embeddings.embedQuery(input);

  return embedding;
}
