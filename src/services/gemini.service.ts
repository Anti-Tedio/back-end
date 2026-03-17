import { GoogleGenAI } from "@google/genai";

const Schemas: Record<string, any> = {
  movie: {
    type: "object",
    properties: {
      title: { type: "string" },
      streaming: {
        type: "array",
        items: { type: "string" }
      },
    },
    required: ["title", "streaming"],
  },
  game: {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      cheapest_platform: { type: "string" },
    },
    required: ["title", "description", "cheapest_platform"],
  },
  book: {

    type: "object",

    properties: {

      title: { type: "string" },

      author: { type: "string" },

    },

    required: ["title", "author"],

  }
};

const ai = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GEMINI_API_KEY!,
});

export const geminiService = {
  generateRecommendation: async (prompt: string, schemaKey: keyof typeof Schemas) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: Schemas[schemaKey],
        },
      });

      if (response.text) {
        return JSON.parse(response.text);
      }

      throw new Error("Nenhum conteúdo retornado pela API.");

    } catch (error:any) {
      if (error.status === 429 || error.message?.includes("429")) {
        console.error("⚠️ Limite de requisições atingido. Aguarde um pouco...");
      } else {
        console.error("Erro na Google Gen AI API:", error);
      }
      throw new Error("Falha ao gerar conteúdo estruturado.");
    }
  }
};