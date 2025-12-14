import { GoogleGenAI } from "@google/genai";
import { GEMINI_SYSTEM_PROMPT } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.warn("Gemini API Key is missing!");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const simulateChainForgeAgent = async (userInput: string): Promise<string> => {
  try {
    const ai = getClient();
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: userInput }]
        }
      ],
      config: {
        systemInstruction: GEMINI_SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    return response.text || "> No response from simulation.";
  } catch (error) {
    console.error("Gemini Simulation Error:", error);
    return `[ERROR] Simulation failed: ${(error as Error).message}. \n> Ensure API_KEY is set in environment.`;
  }
};
