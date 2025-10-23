
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { ChatMode } from '../types';
import { MODEL_CONFIG, SYSTEM_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeminiResponse {
  text: string;
  sources?: GroundingChunk[];
}

export const runQuery = async (
  prompt: string,
  history: { role: 'user' | 'model'; parts: string }[],
  mode: ChatMode
): Promise<GeminiResponse> => {
  try {
    let response: GenerateContentResponse;

    // FIX: The `contents` array must be an array of `Content` objects,
    // where the `parts` property is an array of `Part` objects (e.g., [{ text: '...' }]).
    // The original code was passing a string for `parts`.
    const contents = [
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.parts }] })),
      { role: 'user' as const, parts: [{ text: prompt }] },
    ];

    switch (mode) {
      case ChatMode.THINKING:
        response = await ai.models.generateContent({
          model: MODEL_CONFIG.THINKING,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            thinkingConfig: { thinkingBudget: 32768 },
          },
        });
        break;
      
      case ChatMode.SEARCH:
        response = await ai.models.generateContent({
            model: MODEL_CONFIG.SEARCH,
            contents: contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                tools: [{googleSearch: {}}],
            },
        });
        break;

      case ChatMode.STANDARD:
      default:
        response = await ai.models.generateContent({
          model: MODEL_CONFIG.STANDARD,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });
        break;
    }

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return { text, sources };
  } catch (error) {
    console.error("Error running query with Gemini:", error);
    if (error instanceof Error) {
        return { text: `Desculpe, ocorreu um erro: ${error.message}` };
    }
    return { text: "Desculpe, ocorreu um erro inesperado ao processar sua solicitação." };
  }
};
