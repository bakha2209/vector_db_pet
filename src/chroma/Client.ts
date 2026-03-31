import { ChromaClient } from "chromadb";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});

const embeddingFunction = {
  generate: async (texts: string[]) => {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });
    return response.data.map((item) => item.embedding);
  },
};

async function main() {
  const heartbeat = await client.heartbeat();
  console.log("heartbeat:", heartbeat);

  const collection = await client.getOrCreateCollection({
    name: "data-test2",
    embeddingFunction: embeddingFunction,
  });

  await collection.add({
    ids: ["id1"],
    documents: ["Here is my entry"],
  });

  console.log("Data added successfully.");

  const data = await collection.get({
    ids: ["id0"],
    include: ["documents", "embeddings", "metadatas"],
  });

  console.log("Fetched data:", data);
}

main().catch((err) => {
  console.error("Error:", err);
});
